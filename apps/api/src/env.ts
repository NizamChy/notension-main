import { z } from "zod";

const flag = (fallback: boolean) =>
  z
    .enum(["true", "false", "1", "0"])
    .optional()
    .transform((v) => (v === undefined ? fallback : v === "true" || v === "1"));

const schema = z.object({
  // Postgres with PostGIS (Neon, Supabase, local). Without it the API uses an
  // embedded PGlite database (PostGIS included) stored in PGLITE_DIR.
  DATABASE_URL: z.string().url().optional(),
  PGLITE_DIR: z.string().default("./.pglite"),
  PORT: z.coerce.number().int().positive().default(4000),
  // Comma-separated origins allowed to call the API from a browser.
  CORS_ORIGINS: z.string().default("http://localhost:3000,https://notension-main.vercel.app"),

  // Session signing secret. When unset, one is generated on first start and
  // kept in the database (table app_secret).
  BETTER_AUTH_SECRET: z.string().min(32).optional(),
  // The API's public URL. Defaults to the Vercel production URL, or
  // http://localhost:PORT.
  BETTER_AUTH_URL: z.string().url().optional(),
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),

  // BulkSMSBD (https://bulksmsbd.net). Without a key no SMS is sent: the OTP
  // comes back in the send-otp response (demo behaviour), and such accounts
  // never get staff roles.
  SMS_API_KEY: z.string().optional(),
  SMS_SENDER_ID: z.string().optional(),
  // Comma-separated phone numbers (01XXXXXXXXX) that become super_admin when
  // they sign in. Only honoured when OTPs go out by SMS.
  SUPER_ADMIN_PHONES: z.string().default(""),
  // The "Login as Demo User" shortcut (phone 01700000000, no OTP).
  DEMO_LOGIN: flag(true),
});

export const env = schema.parse(process.env);
export type Env = z.infer<typeof schema>;
