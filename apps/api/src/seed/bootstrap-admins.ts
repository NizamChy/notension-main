// Makes every SUPER_ADMIN_PHONES number a super_admin (runs on each deploy,
// from seed/run.ts). An account without a password gets a one-time setup
// link, printed to the deploy log, which only the project's owners can read.
//
// These accounts are also "protected": only the same person can block them,
// remove their roles or issue them a setup link (src/modules/admin/routes.ts),
// and Reset to default / Restore keep them and their passwords.
import { isDemoAccountPhone } from "@notension/shared";
import { DEMO_PHONE } from "../auth/auth";
import { normalizeBdPhone } from "../auth/sms";
import type { Db } from "../db/client";
import { createSetupLink, ensureUser, grantRole, hasPassword } from "../modules/admin/staff";

// "01811111111, +8801922222222" -> ["01811111111", "01922222222"]. The demo
// numbers never count.
export const parseSuperAdminPhones = (phonesCsv: string) => [
  ...new Set(
    phonesCsv
      .split(",")
      .map(normalizeBdPhone)
      .filter((p): p is string => !!p && p !== DEMO_PHONE && !isDemoAccountPhone(p)),
  ),
];

export async function bootstrapSuperAdmins(db: Db, phonesCsv: string | string[], webUrl: string, log = console.log) {
  const phones = Array.isArray(phonesCsv) ? phonesCsv : parseSuperAdminPhones(phonesCsv);
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
