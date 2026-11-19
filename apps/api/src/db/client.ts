import { PGlite } from "@electric-sql/pglite";
import { postgis } from "@electric-sql/pglite-postgis";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import { fileURLToPath } from "node:url";
import pg from "pg";
import * as schema from "./schema";

export type Db = ReturnType<typeof drizzlePg<typeof schema>>;

const MIGRATIONS = fileURLToPath(new URL("../../drizzle", import.meta.url));

export type DbHandle = { db: Db; migrate: () => Promise<void>; close: () => Promise<void> };

// Postgres when a URL is given, otherwise embedded PGlite. `dataDir`
// undefined keeps PGlite in memory (tests).
export async function createDb(opts: { url?: string; dataDir?: string }): Promise<DbHandle> {
  if (opts.url) {
    const pool = new pg.Pool({ connectionString: opts.url, max: 5 });
    const db = drizzlePg(pool, { schema });
    return {
      db,
      migrate: async () => {
        await db.execute(sql`CREATE EXTENSION IF NOT EXISTS postgis`);
        await migratePg(db, { migrationsFolder: MIGRATIONS });
      },
      close: () => pool.end(),
    };
  }

  const client = await PGlite.create({ dataDir: opts.dataDir, extensions: { postgis } });
  const db = drizzlePglite(client, { schema });
  return {
    // Both drivers expose the same query builder; the types differ only in
    // the result wrapper, which this code never touches.
    db: db as unknown as Db,
    migrate: async () => {
      await client.exec("CREATE EXTENSION IF NOT EXISTS postgis");
      await migratePglite(db, { migrationsFolder: MIGRATIONS });
    },
    close: () => client.close(),
  };
}
