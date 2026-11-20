// Everything a fresh deploy loads: each module's demo data (only when that
// module is empty), the SUPER_ADMIN_PHONES super admins and the demo
// accounts. Used by the deploy script (run.ts) and by "Reset to default"
// (src/modules/admin/data.ts).
import { count } from "drizzle-orm";
import type { Db } from "../db/client";
import { stores } from "../db/schema";
import { hasAllCareData, seedAllCare } from "./allcare";
import { bootstrapSuperAdmins } from "./bootstrap-admins";
import { seedDemo } from "./demo";
import { ensureDemoAccounts } from "./demo-accounts";
import { hasFashionData, seedFashion } from "./fashion";
import { hasFoodData, seedFood } from "./food";
import { hasHealthCareData, seedHealthCare } from "./healthCare";
import { hasMedicineData, seedMedicine } from "./medicine";

export type SeedOptions = {
  // SUPER_ADMIN_PHONES (comma-separated) or the parsed list.
  superAdminPhones: string | string[];
  // For password setup links printed to the log.
  webUrl: string;
  // false: don't issue setup links (Reset to default keeps the existing one).
  setupLinks?: boolean;
  log?: (line: string) => void;
};

export async function seedAll(db: Db, opts: SeedOptions) {
  const log = opts.log ?? console.log;
  const [row] = await db.select({ n: count() }).from(stores);
  if (row && row.n > 0) {
    log(`database has ${row.n} stores, grocery seed skipped`);
  } else {
    await seedDemo(db);
    log("grocery demo data seeded");
  }
  const modules: [string, (db: Db) => Promise<boolean>, (db: Db) => Promise<void>][] = [
    ["medicine", hasMedicineData, seedMedicine],
    ["food", hasFoodData, seedFood],
    ["all care", hasAllCareData, seedAllCare],
    ["fashion", hasFashionData, seedFashion],
    ["health care", hasHealthCareData, seedHealthCare],
  ];
  for (const [name, has, seed] of modules) {
    if (await has(db)) {
      log(`${name} data present, seed skipped`);
    } else {
      await seed(db);
      log(`${name} demo data seeded`);
    }
  }
  await bootstrapSuperAdmins(db, opts.superAdminPhones, opts.webUrl, log, opts.setupLinks ?? true);
  await ensureDemoAccounts(db, log);
}
