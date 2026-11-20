// Migrates, then loads the demo data into an empty database. Safe to run on
// every deploy: a database that already has stores is left alone.
import { count } from "drizzle-orm";
import { createDb } from "../db/client";
import { stores } from "../db/schema";
import { env } from "../env";
import { hasAllCareData, seedAllCare } from "./allcare";
import { seedDemo } from "./demo";

const handle = await createDb({ url: env.DATABASE_URL, dataDir: env.PGLITE_DIR });
await handle.migrate();
const [row] = await handle.db.select({ n: count() }).from(stores);
if (row && row.n > 0) {
  console.log(`database has ${row.n} stores, seed skipped`);
} else {
  await seedDemo(handle.db);
  console.log("demo data seeded");
}
if (await hasAllCareData(handle.db)) {
  console.log("all care data present, seed skipped");
} else {
  await seedAllCare(handle.db);
  console.log("all care demo data seeded");
}
await handle.close();
