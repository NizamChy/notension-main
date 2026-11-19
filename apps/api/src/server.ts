import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { createDb } from "./db/client";
import { env } from "./env";

const { db, migrate } = await createDb({ url: env.DATABASE_URL, dataDir: env.PGLITE_DIR });
await migrate();
const app = createApp(db, { corsOrigins: env.CORS_ORIGINS.split(","), log: true });
serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`API on http://localhost:${info.port} (${env.DATABASE_URL ? "Postgres" : "PGlite"})`);
});
