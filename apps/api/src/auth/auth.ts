// Sign-in with a phone number and a one-time code, via Better Auth's
// phone-number plugin. Sessions are cookies; the web app reaches the API
// through its own /api-proxy rewrite, so they are first-party cookies there.
//
// Roles: every new user is a `customer`. Phones listed in SUPER_ADMIN_PHONES
// become `super_admin` on sign-in, but only when codes go out by SMS: without
// an SMS provider the code is returned in the response (demo behaviour), and
// anyone could then sign in as any number.
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { phoneNumber } from "better-auth/plugins";
import { and, eq, ne } from "drizzle-orm";
import type { Db } from "../db/client";
import { objectId } from "../db/ids";
import { account, customers, session, user, userRole, verification } from "../db/schema";
import type { SmsSender } from "./sms";

export type AuthConfig = {
  secret: string;
  baseURL: string;
  trustedOrigins: string[];
  // null: no SMS provider, codes come back in the send-otp response.
  sms: SmsSender | null;
  superAdminPhones: string[];
};

// The shared demo account ("Login as Demo User").
export const DEMO_PHONE = "01700000000";

const TEMP_EMAIL_DOMAIN = "phone.notension.invalid";
export const isTempEmail = (email: string | null | undefined) => !email || email.endsWith(`@${TEMP_EMAIL_DOMAIN}`);

export function createAuth(db: Db, config: AuthConfig) {
  // Codes produced by sendPhoneNumberOTP calls made from our own routes,
  // read back right after the call (sendOTP is awaited inside it).
  const issuedCodes = new Map<string, string>();

  const hasStaffRole = async (phone: string) => {
    const [row] = await db
      .select({ id: userRole.id })
      .from(userRole)
      .innerJoin(user, eq(user.id, userRole.userId))
      .where(and(eq(user.phoneNumber, phone), ne(userRole.role, "customer")))
      .limit(1);
    return !!row;
  };

  const auth = betterAuth({
    secret: config.secret,
    baseURL: config.baseURL,
    basePath: "/api/auth",
    trustedOrigins: config.trustedOrigins,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: { user, session, account, verification },
    }),
    advanced: { database: { generateId: () => objectId() } },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24, // refreshed once a day
    },
    plugins: [
      phoneNumber({
        otpLength: 6,
        expiresIn: 300,
        allowedAttempts: 5,
        phoneNumberValidator: (phone) => /^01[3-9]\d{8}$/.test(phone),
        signUpOnVerification: {
          getTempEmail: (phone) => `${phone}@${TEMP_EMAIL_DOMAIN}`,
          getTempName: () => "",
        },
        sendOTP: async ({ phoneNumber: phone, code }) => {
          // The demo number never gets an SMS; its code is only used by the
          // demo-login route.
          const viaSms = !!config.sms && phone !== DEMO_PHONE;
          if (viaSms) {
            await config.sms!(phone, `Your NoTension code is ${code}. It expires in 5 minutes.`);
          } else {
            // Staff accounts must never be reachable with an echoed code.
            if (await hasStaffRole(phone)) {
              throw new APIError("FORBIDDEN", { message: "SMS sign-in is not configured for this account" });
            }
            if (process.env.NODE_ENV !== "production") console.info(`[otp] ${phone}: ${code}`);
          }
          issuedCodes.set(phone, code);
        },
      }),
    ],
    databaseHooks: {
      user: {
        create: {
          after: async (created) => {
            await db.insert(userRole).values({ userId: created.id, role: "customer" }).onConflictDoNothing();
            await db.insert(customers).values({ userId: created.id }).onConflictDoNothing();
          },
        },
      },
      session: {
        create: {
          before: async (s) => {
            const [u] = await db.select({ banned: user.banned }).from(user).where(eq(user.id, s.userId));
            if (u?.banned) return false;
          },
          after: async (s) => {
            if (!config.sms || !config.superAdminPhones.length) return;
            const [u] = await db.select({ phone: user.phoneNumber }).from(user).where(eq(user.id, s.userId));
            if (u?.phone && u.phone !== DEMO_PHONE && config.superAdminPhones.includes(u.phone)) {
              await db.insert(userRole).values({ userId: s.userId, role: "super_admin" }).onConflictDoNothing();
            }
          },
        },
      },
    },
  });

  // Sends a code and returns it (callers decide whether to reveal it).
  const issueOtp = async (phone: string) => {
    issuedCodes.delete(phone);
    await auth.api.sendPhoneNumberOTP({ body: { phoneNumber: phone } });
    const code = issuedCodes.get(phone);
    issuedCodes.delete(phone);
    return code;
  };

  return { auth, issueOtp };
}

export type Auth = ReturnType<typeof createAuth>;
