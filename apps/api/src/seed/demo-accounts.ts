// Demo sign-ins, one per role (the list lives in @notension/shared so the
// web demo panel and the PDF show the same thing). Run on every deploy and on
// reset: creates the accounts and roles if missing, unblocks them, and puts
// the demo password back, so the published credentials always work.
//
// Demo accounts can't change their password and never get setup links
// (src/modules/admin/routes.ts).
import { DEMO_ACCOUNTS, DEMO_PASSWORD, isDemoAccountPhone, type DemoAccount } from "@notension/shared";
import { hashPassword } from "better-auth/crypto";
import { and, eq, isNull, or } from "drizzle-orm";
import type { Db } from "../db/client";
import { account, careProviders, customers, doctors, stores, user, userRole } from "../db/schema";
import { grantRole } from "../modules/admin/staff";

export { DEMO_ACCOUNTS, DEMO_PASSWORD, isDemoAccountPhone };
export type { DemoAccount };

// Fixed ids ("dea0" + phone), so a demo account keeps its id across resets
// and a demo super admin's session survives "Reset to default".
export const demoUserId = (phone: string) => `dea0${phone.padStart(20, "0")}`;

export async function ensureDemoAccounts(db: Db, log: (line: string) => void = () => {}) {
  // One hash for all of them: the password is public anyway, and scrypt is
  // the slow part of this step.
  const hash = await hashPassword(DEMO_PASSWORD);
  let linked = 0;
  for (const a of DEMO_ACCOUNTS) {
    const [found] = await db.select({ id: user.id }).from(user).where(eq(user.phoneNumber, a.phone));
    let userId = found?.id;
    if (userId) {
      await db.update(user).set({ name: a.name, banned: false, phoneNumberVerified: true }).where(eq(user.id, userId));
    } else {
      const [created] = await db
        .insert(user)
        .values({
          id: demoUserId(a.phone),
          name: a.name,
          email: `${a.phone}@phone.notension.invalid`,
          phoneNumber: a.phone,
          phoneNumberVerified: true,
        })
        .returning({ id: user.id });
      userId = created!.id;
      await db.insert(userRole).values({ userId, role: "customer" }).onConflictDoNothing();
      await db.insert(customers).values({ userId }).onConflictDoNothing();
    }

    // The role (store roles only when the store exists).
    let storeId: string | null = null;
    if (a.storeId) {
      const [s] = await db.select({ id: stores.id }).from(stores).where(eq(stores.id, a.storeId));
      if (!s) {
        log(`demo account ${a.phone}: store ${a.storeId} not found, role skipped`);
        continue;
      }
      storeId = s.id;
    }
    await grantRole(db, userId, a.role, storeId, null);

    // Password: always back to the demo one.
    const [cred] = await db
      .select({ id: account.id })
      .from(account)
      .where(and(eq(account.userId, userId), eq(account.providerId, "credential")));
    if (cred) await db.update(account).set({ password: hash }).where(eq(account.id, cred.id));
    else await db.insert(account).values({ userId, accountId: userId, providerId: "credential", password: hash });

    // The profile a doctor / service provider manages. Only claims one that
    // nobody else manages.
    if (a.doctorId) {
      const res = await db
        .update(doctors)
        .set({ userId })
        .where(and(eq(doctors.id, a.doctorId), or(isNull(doctors.userId), eq(doctors.userId, userId))))
        .returning({ id: doctors.id });
      linked += res.length;
    }
    if (a.providerId) {
      const res = await db
        .update(careProviders)
        .set({ userId })
        .where(and(eq(careProviders.id, a.providerId), or(isNull(careProviders.userId), eq(careProviders.userId, userId))))
        .returning({ id: careProviders.id });
      linked += res.length;
    }
    // TODO(rider): orders have no rider_id yet; when they do, assign a few
    // demo orders to the demo rider here.
  }
  log(`demo accounts ready (${DEMO_ACCOUNTS.length}, ${linked} profiles linked)`);
}
