// Demo accounts, protected super admins, and backup / restore / reset.
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@notension/shared";
import { and, count, eq, inArray, sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDb, type DbHandle } from "../src/db/client";
import { account, careProviders, doctors, orders, storeItems, user, userRole } from "../src/db/schema";
import { BACKUP_TABLES } from "../src/modules/admin/data";
import { checkSetupToken, setPassword } from "../src/modules/admin/staff";
import { seedAll } from "../src/seed/all";
import { ensureDemoAccounts } from "../src/seed/demo-accounts";
import { createAuth } from "../src/auth/auth";
import { client, testApp } from "./helpers";

const STORE = "6650a00100000000000000a1";
const OWNER = "01811111111"; // stands in for a SUPER_ADMIN_PHONES number
const OWNER_PW = "owner password 123";
const NEWBIE = "01822222222"; // a SUPER_ADMIN_PHONES number that hasn't set a password yet
let newbieLink = "";
const CUSTOMER = "01877777777";
const demo = (role: string) => DEMO_ACCOUNTS.find((a) => a.role === role)!;

let handle: DbHandle;
let app: ReturnType<typeof testApp>;
const quiet = () => {};

beforeAll(async () => {
  handle = await createDb({});
  await handle.migrate();
  const links: string[] = [];
  await seedAll(handle.db, { superAdminPhones: `${OWNER},${NEWBIE}`, webUrl: "http://web.test", log: (l) => links.push(l) });
  app = testApp(handle.db, { protectedPhones: [OWNER, NEWBIE] });
  // The owner sets a password through the deploy-log setup link.
  const linkOf = (phone: string) =>
    links.find((l) => l.includes(phone) && l.includes("/admin/setup?token="))!.match(/http\S+/)![0];
  const link = linkOf(OWNER);
  newbieLink = linkOf(NEWBIE);
  const res = await client(app).request("POST", "/api/v1/admin/setup", {
    token: new URL(link).searchParams.get("token"),
    password: OWNER_PW,
  });
  expect(res.status).toBe(200);
});
afterAll(() => handle?.close());

async function login(phone: string, password = DEMO_PASSWORD) {
  const c = client(app);
  const res = await c.request("POST", "/api/v1/admin/login", { phone, password });
  return { c, res };
}

const userIdOf = async (phone: string) =>
  (await handle.db.select({ id: user.id }).from(user).where(eq(user.phoneNumber, phone)))[0]?.id;

async function tableCounts() {
  const res = await handle.db.execute(
    sql.raw(BACKUP_TABLES.map((t) => `select '${t}' as t, count(*)::int as n from "${t}"`).join(" union all ")),
  );
  return Object.fromEntries((res as unknown as { rows: { t: string; n: number }[] }).rows.map((r) => [r.t, Number(r.n)]));
}

async function placeOrder() {
  const c = client(app);
  const sent = await c.request("POST", "/api/v1/customer/send-otp", { contact_no: CUSTOMER });
  await c.request("POST", "/api/v1/customer/verify-otp", { contact_no: CUSTOMER, otp: sent.body.demo_otp });
  const [item] = await handle.db.select().from(storeItems).where(eq(storeItems.storeId, STORE)).limit(1);
  const res = await c.request("POST", "/client-app-api/v1/grocery/order", {
    orderObj: JSON.stringify({
      merchant_id: STORE,
      orderItems: [{ _id: item!.id, quantity: 1, sale_price: 1 }],
      paymet_method: "Cash on Delivery",
      customerInfo: { customer_name: "Rahim", customer_address: "Road 5, Gulshan", latitude: 23.79, longitude: 90.41 },
      subTotal: 1,
      totalAmount: 1,
    }),
  });
  expect(res.status).toBe(200);
}

describe("demo accounts", () => {
  it("every role signs in with the demo password", async () => {
    expect(DEMO_ACCOUNTS.length).toBeGreaterThanOrEqual(14);
    for (const a of DEMO_ACCOUNTS) {
      const { res } = await login(a.phone);
      expect(res.status, a.phone).toBe(200);
      const roles = res.body.result.roles.map((r: { role: string; storeId: string | null }) => r);
      expect(roles.some((r: { role: string; storeId: string | null }) => r.role === a.role && (r.storeId ?? undefined) === a.storeId)).toBe(true);
    }
    const doctorUser = await userIdOf(demo("doctor").phone);
    const [d] = await handle.db.select({ userId: doctors.userId }).from(doctors).where(eq(doctors.id, demo("doctor").doctorId!));
    expect(d!.userId).toBe(doctorUser);
    const [p] = await handle.db.select({ userId: careProviders.userId }).from(careProviders).where(eq(careProviders.id, demo("service_provider").providerId!));
    expect(p!.userId).toBe(await userIdOf(demo("service_provider").phone));
  });

  it("is idempotent and puts the demo password back", async () => {
    const phones = DEMO_ACCOUNTS.map((a) => a.phone);
    const before = await handle.db.select({ n: count() }).from(user);
    const rolesBefore = await handle.db.select({ n: count() }).from(userRole);

    const id = (await userIdOf(demo("admin").phone))!;
    const auth = createAuth(handle.db, { secret: "x".repeat(40), baseURL: "http://localhost", trustedOrigins: [], sms: null });
    await setPassword(handle.db, auth, id, "somebody changed it");
    await handle.db.update(user).set({ banned: true }).where(eq(user.id, id));
    expect((await login(demo("admin").phone)).res.status).not.toBe(200);

    await ensureDemoAccounts(handle.db, quiet);
    await ensureDemoAccounts(handle.db, quiet);
    expect(await handle.db.select({ n: count() }).from(user)).toEqual(before);
    expect(await handle.db.select({ n: count() }).from(userRole)).toEqual(rolesBefore);
    const creds = await handle.db
      .select({ n: count() })
      .from(account)
      .innerJoin(user, eq(user.id, account.userId))
      .where(inArray(user.phoneNumber, phones));
    expect(creds[0]!.n).toBe(phones.length);
    expect((await login(demo("admin").phone)).res.status).toBe(200);
  });
});

describe("protections", () => {
  it("demo accounts can't change their password or get setup links", async () => {
    const { c } = await login(demo("admin").phone);
    const res = await c.request("POST", "/api/v1/admin/password", { current: DEMO_PASSWORD, next: "a new password" });
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Demo accounts can't change the password");

    const owner = (await login(OWNER, OWNER_PW)).c;
    const link = await owner.request("POST", `/api/v1/admin/users/${await userIdOf(demo("support").phone)}/setup-link`);
    expect(link.status).toBe(403);
    // Adding a role to a demo account never hands out a link either.
    const role = await owner.request("POST", "/api/v1/admin/roles", { phone: demo("support").phone, role: "finance" });
    expect(role.status).toBe(200);
    expect(role.body.result.setupLink).toBeNull();
  });

  it("only the protected super admin can block, demote or re-link themselves", async () => {
    const ownerId = (await userIdOf(OWNER))!;
    const [superRole] = await handle.db
      .select({ id: userRole.id })
      .from(userRole)
      .where(and(eq(userRole.userId, ownerId), eq(userRole.role, "super_admin")));
    const demoSuper = (await login(demo("super_admin").phone)).c;
    expect((await demoSuper.request("PATCH", `/api/v1/admin/users/${ownerId}`, { banned: true })).status).toBe(403);
    expect((await demoSuper.request("DELETE", `/api/v1/admin/roles/${superRole!.id}`)).status).toBe(403);
    expect((await demoSuper.request("POST", `/api/v1/admin/users/${ownerId}/setup-link`)).status).toBe(403);
    // The demo super admin is not protected.
    const demoSuperId = (await userIdOf(demo("super_admin").phone))!;
    const owner = (await login(OWNER, OWNER_PW)).c;
    expect((await owner.request("PATCH", `/api/v1/admin/users/${demoSuperId}`, { banned: true })).status).toBe(200);
    expect((await owner.request("PATCH", `/api/v1/admin/users/${demoSuperId}`, { banned: false })).status).toBe(200);
    // The owner may re-link themselves.
    expect((await owner.request("POST", `/api/v1/admin/users/${ownerId}/setup-link`)).status).toBe(200);
    const list = await owner.request("GET", `/api/v1/admin/users?q=${OWNER}`);
    expect(list.body.result[0]).toMatchObject({ isProtected: true, isDemo: false });
  });

  it("only super admins can back up, restore or reset", async () => {
    for (const role of ["admin", "support", "merchant_owner"]) {
      const { c } = await login(demo(role).phone);
      expect((await c.request("GET", "/api/v1/admin/backup")).status).toBe(403);
      expect((await c.request("POST", "/api/v1/admin/restore", { format: "notension-backup" })).status).toBe(403);
      expect((await c.request("POST", "/api/v1/admin/reset", { confirm: "RESET" })).status).toBe(403);
    }
    expect((await client(app).request("GET", "/api/v1/admin/backup")).status).toBe(401);
  });
});

describe("backup, reset, restore", () => {
  it("round-trips the data", async () => {
    await placeOrder();
    const owner = (await login(OWNER, OWNER_PW)).c;
    const before = await tableCounts();
    expect(before.order).toBeGreaterThan(0);

    const backup = await owner.request("GET", "/api/v1/admin/backup");
    expect(backup.status).toBe(200);
    expect(backup.body).toMatchObject({ format: "notension-backup", version: 1 });
    expect(Object.keys(backup.body.tables).sort()).toEqual([...BACKUP_TABLES].sort());
    expect(backup.body.tables.session).toBeUndefined();
    for (const t of BACKUP_TABLES) {
      if (t !== "account") expect(backup.body.tables[t].length, t).toBe(before[t]);
    }
    // Password hashes only for non-demo accounts.
    expect(backup.body.tables.account.length).toBe(before.account! - DEMO_ACCOUNTS.length);

    // Reset: needs the word.
    expect((await owner.request("POST", "/api/v1/admin/reset", { confirm: "reset" })).status).toBe(400);
    const reset = await owner.request("POST", "/api/v1/admin/reset", { confirm: "RESET" });
    expect(reset.status).toBe(200);
    expect(reset.body.result.signedIn).toBe(true);
    console.log(`reset took ${reset.body.result.ms} ms on PGlite`);
    expect(reset.body.result.counts.order).toBe(0);
    expect(await userIdOf(CUSTOMER)).toBeUndefined();
    // The owner is still here, still super admin, same password, same session.
    expect((await owner.request("GET", "/api/v1/admin/me")).body.result.roles.map((r: { role: string }) => r.role)).toEqual(["super_admin"]);
    expect((await login(OWNER, OWNER_PW)).res.status).toBe(200);
    expect((await login(demo("merchant_staff").phone)).res.status).toBe(200);
    // Same demo data as a fresh deploy.
    const fresh = await tableCounts();
    expect(fresh.store).toBe(before.store);
    expect(fresh.product).toBe(before.product);

    // Restore: a bad file changes nothing.
    expect((await owner.request("POST", "/api/v1/admin/restore", { format: "nope" })).status).toBe(400);
    const bad = await owner.request("POST", "/api/v1/admin/restore", { ...backup.body, tables: { ...backup.body.tables, order: [{ id: 1 }] } });
    expect(bad.status).toBe(400);
    expect((await tableCounts()).order).toBe(0);

    const restored = await owner.request("POST", "/api/v1/admin/restore", backup.body);
    expect(restored.status).toBe(200);
    console.log(`restore took ${restored.body.result.ms} ms on PGlite`);
    expect(restored.body.result.counts).toEqual(before);
    expect(await tableCounts()).toEqual(before);
    expect(await userIdOf(CUSTOMER)).toBeDefined();
    expect((await handle.db.select({ n: count() }).from(orders))[0]!.n).toBe(before.order);
    expect((await login(OWNER, OWNER_PW)).res.status).toBe(200);
    expect((await login(demo("doctor").phone)).res.status).toBe(200);
    // New orders still get fresh codes.
    await placeOrder();
  });

  it("restore keeps a protected super admin the file doesn't have", async () => {
    const owner = (await login(OWNER, OWNER_PW)).c;
    const backup = (await owner.request("GET", "/api/v1/admin/backup")).body;
    const ownerId = await userIdOf(OWNER);
    backup.tables.user = backup.tables.user.filter((u: { id: string }) => u.id !== ownerId);
    for (const t of ["account", "user_role", "customer", "favourite", "patient", "appointment"]) {
      backup.tables[t] = backup.tables[t].filter((r: { user_id?: string }) => r.user_id !== ownerId);
    }
    backup.tables.order = backup.tables.order.filter((r: { customer_id?: string }) => r.customer_id !== ownerId);
    const res = await owner.request("POST", "/api/v1/admin/restore", backup);
    expect(res.status).toBe(200);
    expect((await login(OWNER, OWNER_PW)).res.status).toBe(200);
  });

  it("keeps the deploy-log setup link of a super admin without a password", async () => {
    // Reset and restore have run above; the newbie's link must still work.
    const token = new URL(newbieLink).searchParams.get("token")!;
    expect(await checkSetupToken(handle.db, token)).toBe(await userIdOf(NEWBIE));
  });
});
