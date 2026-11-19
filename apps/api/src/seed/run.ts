import { env } from "../env";
import { createDb } from "../db/client";
import { seedDemo } from "./demo";

const handle = await createDb({ url: env.DATABASE_URL, dataDir: env.PGLITE_DIR });
await handle.migrate();
await seedDemo(handle.db);
await handle.close();
console.log("demo data seeded");
