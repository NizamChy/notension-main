// Deploy step (npm run db:seed): migrates, then loads whatever is missing
// (see seedAll). Safe to run on every deploy: modules that already have data
// are left alone; super admins and demo accounts are re-applied.
import { createDb } from "../db/client";
import { env, webUrl } from "../env";
import { seedAll } from "./all";

const handle = await createDb({ url: env.DATABASE_URL, dataDir: env.PGLITE_DIR });
await handle.migrate();
await seedAll(handle.db, { superAdminPhones: env.SUPER_ADMIN_PHONES, webUrl: webUrl() });
await handle.close();
