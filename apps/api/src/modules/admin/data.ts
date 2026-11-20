// Backup, restore and "Reset to default" (super admins only, see routes.ts).
//
// A backup is JSON: { format, version, createdAt, tables: { name: rows } }
// with every app table except session, verification and app_secret. Account
// rows (password hashes) are included for everyone but the demo accounts,
// whose passwords are re-applied anyway.
//
// Restore and reset run in one transaction. Both keep the protected super
// admins (SUPER_ADMIN_PHONES): their user row, their password and the
// super_admin role, whatever the file says. Both end every session except the
// caller's.
import { is, sql } from "drizzle-orm";
import { getTableConfig, PgTable } from "drizzle-orm/pg-core";
import { z } from "zod";
import type { Db } from "../../db/client";
import { objectId } from "../../db/ids";
import * as schema from "../../db/schema";
import { seedAll } from "../../seed/all";
import { DEMO_ACCOUNTS, ensureDemoAccounts } from "../../seed/demo-accounts";

export const BACKUP_FORMAT = "notension-backup";
export const BACKUP_VERSION = 1;

// Never in a backup, never touched by restore (app_secret keeps sessions
// signed with the same secret).
const SKIPPED = new Set(["session", "verification", "app_secret"]);

type Row = Record<string, unknown>;

// Optional links ("on delete set null"): a restore clears the ones that
// point at rows the file doesn't have, as Postgres would have on delete.
type SoftLink = { column: string; table: string; foreignColumn: string };
const softLinks = new Map<string, SoftLink[]>();

// App tables, parents before children (foreign-key order).
function appTables(): string[] {
  const tables = (Object.values(schema) as unknown[]).filter((v): v is PgTable => is(v, PgTable));
  const deps = new Map<string, Set<string>>();
  for (const t of tables) {
    const cfg = getTableConfig(t);
    if (cfg.schema && cfg.schema !== "public") continue;
    deps.set(
      cfg.name,
      new Set(cfg.foreignKeys.map((fk) => getTableConfig(fk.reference().foreignTable).name).filter((n) => n !== cfg.name)),
    );
    for (const fk of cfg.foreignKeys) {
      const ref = fk.reference();
      if (fk.onDelete !== "set null" || ref.columns.length !== 1) continue;
      if (!softLinks.has(cfg.name)) softLinks.set(cfg.name, []);
      softLinks.get(cfg.name)!.push({
        column: ref.columns[0]!.name,
        table: getTableConfig(ref.foreignTable).name,
        foreignColumn: ref.foreignColumns[0]!.name,
      });
    }
  }
  const order: string[] = [];
  const seen = new Set<string>();
  const visit = (name: string) => {
    if (seen.has(name)) return;
    seen.add(name);
    for (const d of deps.get(name) ?? []) visit(d);
    order.push(name);
  };
  for (const name of [...deps.keys()].sort()) visit(name);
  return order;
}

export const BACKUP_TABLES = appTables().filter((t) => !SKIPPED.has(t));

const q = (name: string) => `"${name.replace(/"/g, '""')}"`;
const rowsOf = <T = Row>(res: unknown) => ((res as { rows: T[] }).rows ?? []) as T[];

// Writable columns per table (generated ones, like store.location, are left out).
async function columnsOf(db: Db) {
  const res = await db.execute(
    sql`select table_name, column_name from information_schema.columns
        where table_schema = 'public' and is_generated = 'NEVER' order by table_name, ordinal_position`,
  );
  const cols = new Map<string, string[]>();
  for (const r of rowsOf<{ table_name: string; column_name: string }>(res)) {
    if (!cols.has(r.table_name)) cols.set(r.table_name, []);
    cols.get(r.table_name)!.push(r.column_name);
  }
  return cols;
}

async function readTable(db: Db, table: string, cols: string[], where = "") {
  const res = await db.execute(
    sql.raw(`select coalesce(json_agg(t), '[]'::json) as rows from (select ${cols.map(q).join(", ")} from ${q(table)} ${where}) t`),
  );
  const value = rowsOf<{ rows: unknown }>(res)[0]?.rows ?? [];
  return (typeof value === "string" ? JSON.parse(value) : value) as Row[];
}

// Inserts rows as Postgres would read them from JSON (arrays, jsonb, enums,
// timestamps all cast by json_populate_recordset).
async function insertRows(db: Db, table: string, writable: string[], rows: Row[]) {
  if (!rows.length) return;
  const present = new Set<string>();
  for (const r of rows) for (const k of Object.keys(r)) present.add(k);
  const cols = writable.filter((c) => present.has(c)).map(q).join(", ");
  for (let i = 0; i < rows.length; i += 1000) {
    const chunk = JSON.stringify(rows.slice(i, i + 1000));
    await db.execute(
      sql`${sql.raw(`insert into ${q(table)} (${cols}) select ${cols} from json_populate_recordset(null::${q(table)},`)} ${chunk}::json)`,
    );
  }
}

const demoPhones = () => DEMO_ACCOUNTS.map((a) => a.phone);

export async function createBackup(db: Db) {
  const cols = await columnsOf(db);
  const tables: Record<string, Row[]> = {};
  const demo = new Set(
    (await readTable(db, "user", ["id", "phone_number"]))
      .filter((u) => demoPhones().includes(String(u.phone_number)))
      .map((u) => String(u.id)),
  );
  for (const t of BACKUP_TABLES) {
    const rows = await readTable(db, t, cols.get(t) ?? []);
    tables[t] = t === "account" ? rows.filter((r) => !demo.has(String(r.user_id))) : rows;
  }
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, createdAt: new Date().toISOString(), tables };
}

export const backupSchema = z.object({
  format: z.literal(BACKUP_FORMAT, { message: "This is not a NoTension backup file" }),
  version: z.literal(BACKUP_VERSION, { message: "This backup was made by a different version" }),
  createdAt: z.string(),
  tables: z
    .record(z.string(), z.array(z.record(z.string(), z.unknown())))
    .refine((t) => Object.keys(t).every((name) => BACKUP_TABLES.includes(name)), {
      message: "The backup has tables this app doesn't know",
    })
    .refine((t) => (t.user?.length ?? 0) > 0 || Object.values(t).every((rows) => rows.length === 0), {
      message: "The backup has no users",
    }),
});
export type Backup = z.infer<typeof backupSchema>;

type Kept = { users: Row[]; accounts: Row[]; callerSession: Row | null };

// What survives a restore / reset: protected super admins and the caller's
// session.
async function snapshotKept(db: Db, protectedPhones: string[], callerSessionId: string | null): Promise<Kept> {
  const cols = await columnsOf(db);
  const list = protectedPhones.map((p) => `'${p.replace(/'/g, "''")}'`).join(", ");
  const users = protectedPhones.length ? await readTable(db, "user", cols.get("user")!, `where phone_number in (${list})`) : [];
  const ids = users.map((u) => `'${String(u.id).replace(/'/g, "''")}'`).join(", ");
  const accounts = users.length ? await readTable(db, "account", cols.get("account")!, `where user_id in (${ids})`) : [];
  const callerSession = callerSessionId
    ? ((await readTable(db, "session", cols.get("session")!, `where id = '${callerSessionId.replace(/'/g, "''")}'`))[0] ?? null)
    : null;
  return { users, accounts, callerSession };
}

async function truncateAll(db: Db) {
  const names = [...BACKUP_TABLES, "session", "verification"].map(q).join(", ");
  await db.execute(sql.raw(`truncate table ${names} restart identity cascade`));
}

// Puts the protected super admins back: same user row if the data doesn't
// already have one for that phone, their own password, super_admin, unblocked.
async function restoreKept(db: Db, kept: Kept) {
  const cols = await columnsOf(db);
  for (const u of kept.users) {
    const phone = String(u.phone_number);
    let [found] = rowsOf<{ id: string }>(await db.execute(sql`select id from "user" where phone_number = ${phone}`));
    if (!found) {
      const clash = rowsOf(await db.execute(sql`select 1 from "user" where id = ${String(u.id)} or email = ${String(u.email ?? "")}`));
      await insertRows(db, "user", cols.get("user")!, [clash.length ? { ...u, id: objectId(), email: null } : u]);
      [found] = rowsOf<{ id: string }>(await db.execute(sql`select id from "user" where phone_number = ${phone}`));
    }
    const id = found!.id;
    await db.execute(sql`update "user" set banned = false where id = ${id}`);
    await db.execute(sql`delete from account where user_id = ${id}`);
    await insertRows(
      db,
      "account",
      cols.get("account")!,
      kept.accounts.filter((a) => a.user_id === u.id).map((a) => ({ ...a, id: objectId(), user_id: id })),
    );
    await db.execute(sql`insert into user_role (id, user_id, role) values (${objectId()}, ${id}, 'customer') on conflict do nothing`);
    await db.execute(sql`insert into user_role (id, user_id, role) values (${objectId()}, ${id}, 'super_admin') on conflict do nothing`);
    await db.execute(sql`insert into customer (user_id) values (${id}) on conflict do nothing`);
  }
}

async function restoreCallerSession(db: Db, kept: Kept) {
  const s = kept.callerSession;
  if (!s) return false;
  const [u] = rowsOf(await db.execute(sql`select 1 from "user" where id = ${String(s.user_id)}`));
  if (!u) return false;
  const cols = await columnsOf(db);
  await insertRows(db, "session", cols.get("session")!, [s]);
  return true;
}

// Counters behind CUS0000001 / GRO-...-2001 codes and favourite order: past
// the highest value in the data, so new rows don't collide.
async function syncSequences(db: Db) {
  await db.execute(sql`select setval('customer_number_seq',
    greatest(1, coalesce((select max(substring(code from '[0-9]+$')::bigint) from customer), 0)),
    exists (select 1 from customer))`);
  await db.execute(sql`select setval('order_number_seq',
    greatest(2000, coalesce((select max(substring(code from '[0-9]+$')::bigint) from "order"), 0)), true)`);
  await db.execute(sql`select setval(pg_get_serial_sequence('favourite', 'seq'),
    greatest(1, coalesce((select max(seq) from favourite), 0)), exists (select 1 from favourite))`);
}

async function countRows(db: Db) {
  const counts: Record<string, number> = {};
  for (const t of BACKUP_TABLES) {
    const [r] = rowsOf<{ n: string | number }>(await db.execute(sql.raw(`select count(*) as n from ${q(t)}`)));
    counts[t] = Number(r?.n ?? 0);
  }
  return counts;
}

export type DataOptions = {
  protectedPhones: string[];
  callerSessionId: string | null;
  webUrl: string;
  log?: (line: string) => void;
};

const inTx = <T>(db: Db, fn: (tx: Db) => Promise<T>) => db.transaction((tx) => fn(tx as unknown as Db));

export async function restoreBackup(db: Db, backup: Backup, opts: DataOptions) {
  return inTx(db, async (tx) => {
    const kept = await snapshotKept(tx, opts.protectedPhones, opts.callerSessionId);
    const cols = await columnsOf(tx);
    await truncateAll(tx);
    for (const t of BACKUP_TABLES) {
      let rows = backup.tables[t] ?? [];
      for (const link of softLinks.get(t) ?? []) {
        const known = new Set((backup.tables[link.table] ?? []).map((r) => r[link.foreignColumn]));
        rows = rows.map((r) => (r[link.column] == null || known.has(r[link.column]) ? r : { ...r, [link.column]: null }));
      }
      await insertRows(tx, t, cols.get(t) ?? [], rows);
    }
    await syncSequences(tx); // before any new customer row takes a code
    await restoreKept(tx, kept);
    await ensureDemoAccounts(tx, opts.log);
    await syncSequences(tx);
    const keptSession = await restoreCallerSession(tx, kept);
    return { counts: await countRows(tx), signedIn: keptSession };
  });
}

export async function resetToDefault(db: Db, opts: DataOptions) {
  return inTx(db, async (tx) => {
    const kept = await snapshotKept(tx, opts.protectedPhones, opts.callerSessionId);
    await truncateAll(tx);
    await syncSequences(tx); // codes start over, as on a fresh database
    await restoreKept(tx, kept);
    await seedAll(tx, { superAdminPhones: opts.protectedPhones, webUrl: opts.webUrl, log: opts.log ?? (() => {}) });
    await syncSequences(tx);
    const keptSession = await restoreCallerSession(tx, kept);
    return { counts: await countRows(tx), signedIn: keptSession };
  });
}
