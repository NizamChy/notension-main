import { z } from "zod";

const schema = z.object({
  // Postgres with PostGIS (Neon, Supabase, local). Without it the API uses an
  // embedded PGlite database (PostGIS included) stored in PGLITE_DIR.
  DATABASE_URL: z.string().url().optional(),
  PGLITE_DIR: z.string().default("./.pglite"),
  PORT: z.coerce.number().int().positive().default(4000),
  // Comma-separated origins allowed to call the API from a browser.
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
});

export const env = schema.parse(process.env);
export type Env = z.infer<typeof schema>;
