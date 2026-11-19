// Serverless entry for Vercel. `npm run build` bundles this file into
// dist/vercel.js, which api/index.js re-exports; the build has already
// migrated the database.
import { createApp } from "./app";
import { createDb } from "./db/client";
import { env } from "./env";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is required on Vercel");

const { db } = await createDb({ url: env.DATABASE_URL });

export default createApp(db, { corsOrigins: env.CORS_ORIGINS.split(",") });
