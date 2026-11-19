// Builds the auth setup from environment variables (server and Vercel).
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Db } from "../db/client";
import { appSecrets } from "../db/schema";
import type { Env } from "../env";
import { createAuth } from "./auth";
import { bulkSmsBd, normalizeBdPhone } from "./sms";

// BETTER_AUTH_SECRET if set, otherwise one generated once and kept in the
// database, so sessions survive restarts and serverless cold starts.
async function authSecret(db: Db, env: Env) {
  if (env.BETTER_AUTH_SECRET) return env.BETTER_AUTH_SECRET;
  await db
    .insert(appSecrets)
    .values({ name: "better_auth_secret", value: randomBytes(32).toString("base64url") })
    .onConflictDoNothing();
  const [row] = await db.select().from(appSecrets).where(eq(appSecrets.name, "better_auth_secret"));
  return row!.value;
}

export async function authFromEnv(db: Db, env: Env) {
  const sms = env.SMS_API_KEY && env.SMS_SENDER_ID ? bulkSmsBd(env.SMS_API_KEY, env.SMS_SENDER_ID) : null;
  const baseURL =
    env.BETTER_AUTH_URL ??
    (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : `http://localhost:${env.PORT}`);
  const corsOrigins = env.CORS_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
  const auth = createAuth(db, {
    secret: await authSecret(db, env),
    baseURL,
    trustedOrigins: corsOrigins,
    sms,
    superAdminPhones: env.SUPER_ADMIN_PHONES.split(",")
      .map(normalizeBdPhone)
      .filter((p): p is string => !!p),
  });
  return { auth, corsOrigins, smsEnabled: !!sms, demoLogin: env.DEMO_LOGIN };
}
