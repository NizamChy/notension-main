import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { authFromEnv } from "./auth/from-env";
import { createDb } from "./db/client";
import { env } from "./env";

const { db, migrate } = await createDb({ url: env.DATABASE_URL, dataDir: env.PGLITE_DIR });
await migrate();
const setup = await authFromEnv(db, env);
const app = createApp(db, { ...setup, log: true });
serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`API on http://localhost:${info.port} (${env.DATABASE_URL ? "Postgres" : "PGlite"})`);
  if (!setup.smsEnabled) console.log("No SMS provider: OTPs are returned in the send-otp response");
});
