// Migrates, then loads the demo data into an empty database. Safe to run on
// every deploy: a database that already has stores is left alone.
import { count } from "drizzle-orm";
import { createDb } from "../db/client";
import { stores } from "../db/schema";
import { env, webUrl } from "../env";
import { bootstrapSuperAdmins } from "./bootstrap-admins";
import { hasAllCareData, seedAllCare } from "./allcare";
import { seedDemo } from "./demo";
import { hasMedicineData, seedMedicine } from "./medicine";
import { hasFoodData, seedFood } from "./food";
import { hasFashionData, seedFashion } from "./fashion";
import { hasHealthCareData, seedHealthCare } from "./healthCare";

const handle = await createDb({ url: env.DATABASE_URL, dataDir: env.PGLITE_DIR });
await handle.migrate();
const [row] = await handle.db.select({ n: count() }).from(stores);
if (row && row.n > 0) {
  console.log(`database has ${row.n} stores, seed skipped`);
} else {
  await seedDemo(handle.db);
  console.log("demo data seeded");
}
if (!(await hasMedicineData(handle.db))) {
  await seedMedicine(handle.db);
  console.log("medicine demo data seeded");
}
if (await hasFoodData(handle.db)) {
  console.log("food data present, food seed skipped");
} else {
  await seedFood(handle.db);
  console.log("food demo data seeded");
}
if (await hasAllCareData(handle.db)) {
  console.log("all care data present, seed skipped");
} else {
  await seedAllCare(handle.db);
  console.log("all care demo data seeded");
}
await bootstrapSuperAdmins(handle.db, env.SUPER_ADMIN_PHONES, webUrl());
if (!(await hasFashionData(handle.db))) {
  await seedFashion(handle.db);
  console.log("fashion demo data seeded");
if (!(await hasHealthCareData(handle.db))) {
  await seedHealthCare(handle.db);
  console.log("health care demo data seeded");
}
await handle.close();
