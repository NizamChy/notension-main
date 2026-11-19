import { sql } from "drizzle-orm";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { fileURLToPath } from "node:url";
import pg from "pg";
import * as schema from "./schema";

export type Db = ReturnType<typeof drizzlePg<typeof schema>>;

// Resolved when migrating (from src/), not at import: the serverless bundle
// never migrates; the build step does.
const migrationsFolder = () => fileURLToPath(new URL("../../drizzle", import.meta.url));

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
        const { migrate } = await import("drizzle-orm/node-postgres/migrator");
        await db.execute(sql`CREATE EXTENSION IF NOT EXISTS postgis`);
        await migrate(db, { migrationsFolder: migrationsFolder() });
      },
      close: () => pool.end(),
    };
  }

  // Loaded only here, so production (Postgres) never loads the WebAssembly build.
  const [{ PGlite }, { postgis }, { drizzle: drizzlePglite }, { migrate: migratePglite }] = await Promise.all([
    import("@electric-sql/pglite"),
    import("@electric-sql/pglite-postgis"),
    import("drizzle-orm/pglite"),
    import("drizzle-orm/pglite/migrator"),
  ]);
  const client = await PGlite.create({ dataDir: opts.dataDir, extensions: { postgis } });
  const db = drizzlePglite(client, { schema });
  return {
    // Both drivers expose the same query builder; the types differ only in
    // the result wrapper, which this code never touches.
    db: db as unknown as Db,
    migrate: async () => {
      await client.exec("CREATE EXTENSION IF NOT EXISTS postgis");
      await migratePglite(db, { migrationsFolder: migrationsFolder() });
    },
    close: () => client.close(),
  };
}
