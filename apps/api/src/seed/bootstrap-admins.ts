// Makes every SUPER_ADMIN_PHONES number a super_admin (runs on each deploy,
// from seed/run.ts). An account without a password gets a one-time setup
// link, printed to the deploy log, which only the project's owners can read.
import { DEMO_PHONE } from "../auth/auth";
import { normalizeBdPhone } from "../auth/sms";
import type { Db } from "../db/client";
import { createSetupLink, ensureUser, grantRole, hasPassword } from "../modules/admin/staff";

export async function bootstrapSuperAdmins(db: Db, phonesCsv: string, webUrl: string, log = console.log) {
  const phones = phonesCsv
    .split(",")
    .map(normalizeBdPhone)
    .filter((p): p is string => !!p && p !== DEMO_PHONE);
  const links: Record<string, string> = {};
  for (const phone of phones) {
    const u = await ensureUser(db, phone, "Super Admin");
    if (await grantRole(db, u.id, "super_admin", null, null)) log(`super_admin granted to ${phone}`);
    if (!(await hasPassword(db, u.id))) {
      links[phone] = await createSetupLink(db, u.id, webUrl);
      log(`Super admin ${phone}: set a password at ${links[phone]} (valid 7 days)`);
    }
  }
  return links;
}
