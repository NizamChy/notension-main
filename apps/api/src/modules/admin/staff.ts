// Staff accounts (every role except `customer`): passwords, one-time setup
// links, and role changes that must end existing sessions.
//
// Staff never sign in with an echoed OTP. A new staff member gets a setup link
// (from a super admin, or printed in the deploy log for SUPER_ADMIN_PHONES),
// opens it and chooses a password; after that they sign in with phone +
// password at /admin/login.
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { and, eq, gt, ne } from "drizzle-orm";
import type { Auth } from "../../auth/auth";
import type { Db } from "../../db/client";
import { objectId } from "../../db/ids";
import { account, customers, session, user, userRole, verification, type Role } from "../../db/schema";

const SETUP_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const setupIdentifier = (userId: string) => `staff-setup:${userId}`;
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export const isStaffRole = (role: string) => role !== "customer";

export async function staffRoles(db: Db, userId: string) {
  return db
    .select({ role: userRole.role, storeId: userRole.storeId })
    .from(userRole)
    .where(and(eq(userRole.userId, userId), ne(userRole.role, "customer")));
}

// Creates (or replaces) a setup token and returns the link to send. The token
// is stored hashed; the link is `${webUrl}/admin/setup?token=<userId>.<secret>`.
export async function createSetupLink(db: Db, userId: string, webUrl: string) {
  const secret = randomBytes(24).toString("base64url");
  await db.delete(verification).where(eq(verification.identifier, setupIdentifier(userId)));
  await db.insert(verification).values({
    identifier: setupIdentifier(userId),
    value: sha256(secret),
    expiresAt: new Date(Date.now() + SETUP_TTL_MS),
  });
  return `${webUrl}/admin/setup?token=${userId}.${secret}`;
}

// Checks a setup token; returns the user id, or null. Does not consume it.
export async function checkSetupToken(db: Db, token: string) {
  const [userId, secret] = token.split(".");
  if (!userId || !secret) return null;
  const [row] = await db
    .select()
    .from(verification)
    .where(and(eq(verification.identifier, setupIdentifier(userId)), gt(verification.expiresAt, new Date())));
  if (!row) return null;
  const a = Buffer.from(row.value);
  const b = Buffer.from(sha256(secret));
  return a.length === b.length && timingSafeEqual(a, b) ? userId : null;
}

export const consumeSetupToken = (db: Db, userId: string) =>
  db.delete(verification).where(eq(verification.identifier, setupIdentifier(userId)));

export async function hasPassword(db: Db, userId: string) {
  const [row] = await db
    .select({ password: account.password })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "credential")));
  return !!row?.password;
}

// Sets the password (Better Auth's "credential" account) and signs the user
// out everywhere else.
export async function setPassword(db: Db, { hashPassword }: Auth, userId: string, password: string) {
  const hash = await hashPassword(password);
  const [existing] = await db
    .select({ id: account.id })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "credential")));
  if (existing) await db.update(account).set({ password: hash }).where(eq(account.id, existing.id));
  else await db.insert(account).values({ userId, accountId: userId, providerId: "credential", password: hash });
  await db.delete(session).where(eq(session.userId, userId));
}

// Finds or creates the account for a phone number (verified: staff phones are
// entered by a super admin or the deploy config).
export async function ensureUser(db: Db, phone: string, name: string) {
  const [found] = await db.select().from(user).where(eq(user.phoneNumber, phone));
  if (found) return found;
  const [created] = await db
    .insert(user)
    .values({
      id: objectId(),
      name,
      email: `${phone}@phone.notension.invalid`,
      phoneNumber: phone,
      phoneNumberVerified: true,
    })
    .returning();
  await db.insert(userRole).values({ userId: created!.id, role: "customer" }).onConflictDoNothing();
  await db.insert(customers).values({ userId: created!.id }).onConflictDoNothing();
  return created!;
}

// Grants a role. A user's first staff role ends their existing sessions, so a
// session obtained before (e.g. by OTP) can't carry the new rights.
export async function grantRole(db: Db, userId: string, role: Role, storeId: string | null, grantedBy: string | null) {
  const before = await staffRoles(db, userId);
  const inserted = await db
    .insert(userRole)
    .values({ userId, role, storeId, grantedBy })
    .onConflictDoNothing()
    .returning({ id: userRole.id });
  if (inserted.length && isStaffRole(role) && before.length === 0) {
    await db.delete(session).where(eq(session.userId, userId));
  }
  return inserted.length > 0;
}

export const searchPattern = (q: string) => `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
