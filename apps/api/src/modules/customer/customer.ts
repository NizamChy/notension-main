// Customer login and profile, on the paths the web app uses
// (/api/v1/customer/*). Login is two steps: send-otp, then verify-otp, which
// sets the session cookie. Better Auth's own endpoints stay available under
// /api/auth/* for other clients.
import { zValidator } from "@hono/zod-validator";
import { customer as contract } from "@notension/shared";
import { eq } from "drizzle-orm";
import { Hono, type Context } from "hono";
import type { Auth } from "../../auth/auth";
import { DEMO_PHONE, isTempEmail } from "../../auth/auth";
import { requireUser, userRoles, type AuthEnv } from "../../auth/middleware";
import { normalizeBdPhone } from "../../auth/sms";
import type { Db } from "../../db/client";
import { customers, user } from "../../db/schema";

const P = "/api/v1/customer";

const fail = (c: Context, status: 400 | 401 | 403 | 404 | 409 | 429, message: string) =>
  c.json({ success: false as const, message }, status);

export async function loadCustomer(db: Db, userId: string): Promise<contract.Customer | null> {
  const [row] = await db
    .select({ user, profile: customers })
    .from(user)
    .leftJoin(customers, eq(customers.userId, user.id))
    .where(eq(user.id, userId));
  if (!row) return null;
  const { user: u, profile: p } = row;
  const roles = await userRoles(db, userId);
  return {
    _id: u.id,
    custom_id: p?.code ?? "",
    customer_name: u.name,
    customer_address: p?.address ?? "",
    email: isTempEmail(u.email) ? "" : (u.email ?? ""),
    contact_no: u.phoneNumber ?? "",
    alternative_contact_no: p?.altPhone ?? "",
    district_id: p?.districtId ?? contract.NO_AREA_ID,
    district_name_by_location: p?.districtName ?? "",
    district_area_id: contract.NO_AREA_ID,
    district_subarea_id: contract.NO_AREA_ID,
    ref_contact: "",
    location:
      p?.latitude != null && p.longitude != null ? { type: "Point", coordinates: [p.latitude, p.longitude] } : null,
    roles: [...new Set(roles.map((r) => r.role))],
  };
}

// Passes Better Auth's Set-Cookie headers on to our response.
const withCookies = (c: Context, headers: Headers | undefined) => {
  for (const cookie of headers?.getSetCookie?.() ?? []) c.header("Set-Cookie", cookie, { append: true });
};

// Better Auth reports a wrong / expired code as an APIError with a status.
const authErrorStatus = (err: unknown) => {
  const status = (err as { statusCode?: number })?.statusCode;
  return typeof status === "number" && status >= 400 && status < 500 ? status : null;
};

export const customerRoutes = (db: Db, { auth, issueOtp }: Auth, opts: { demoLogin: boolean; smsEnabled: boolean }) => {
  const signIn = async (c: Context, phone: string, code: string) => {
    // Better Auth refuses the session too (databaseHooks), but with a 500.
    const [existing] = await db.select({ banned: user.banned }).from(user).where(eq(user.phoneNumber, phone));
    if (existing?.banned) return fail(c, 403, "This account is blocked. Please contact support.");
    const { headers, response } = await auth.api.verifyPhoneNumber({
      body: { phoneNumber: phone, code },
      headers: c.req.raw.headers,
      returnHeaders: true,
    });
    withCookies(c, headers);
    const result = await loadCustomer(db, response.user.id);
    return c.json({
      success: true as const,
      message: "Login successful",
      // New accounts have no name yet: the app then asks for name/address.
      is_new: !result?.customer_name,
      result,
    });
  };

  return (
    new Hono<AuthEnv>()
      .post(`${P}/send-otp`, zValidator("json", contract.sendOtpInput), async (c) => {
        const phone = normalizeBdPhone(c.req.valid("json").contact_no);
        if (!phone) return fail(c, 400, "Enter a valid mobile number (01XXXXXXXXX)");
        try {
          const code = await issueOtp(phone);
          return c.json({
            success: true as const,
            message: opts.smsEnabled ? "OTP sent to your phone" : "Demo mode: no SMS is sent",
            otp_delivery: opts.smsEnabled ? ("sms" as const) : ("response" as const),
            ...(!opts.smsEnabled && code ? { demo_otp: code } : {}),
          });
        } catch (err) {
          const status = authErrorStatus(err);
          if (status) return fail(c, status === 403 ? 403 : 429, (err as Error).message);
          throw err;
        }
      })

      .post(`${P}/verify-otp`, zValidator("json", contract.verifyOtpInput), async (c) => {
        const body = c.req.valid("json");
        const phone = normalizeBdPhone(body.contact_no);
        if (!phone) return fail(c, 400, "Enter a valid mobile number (01XXXXXXXXX)");
        try {
          return await signIn(c, phone, body.otp);
        } catch (err) {
          if (authErrorStatus(err)) return fail(c, 400, "Wrong or expired code");
          throw err;
        }
      })

      // Signs in as the shared demo account without an SMS.
      .post(`${P}/demo-login`, async (c) => {
        if (!opts.demoLogin) return fail(c, 404, "Not found");
        const code = await issueOtp(DEMO_PHONE).catch(() => undefined);
        if (!code) return fail(c, 403, "Demo login is not available");
        const res = await signIn(c, DEMO_PHONE, code);
        // First demo login: give the account a name and a Gulshan address.
        const [u] = await db.select({ id: user.id, name: user.name }).from(user).where(eq(user.phoneNumber, DEMO_PHONE));
        if (u && !u.name) {
          await db.update(user).set({ name: "Demo User" }).where(eq(user.id, u.id));
          await db
            .update(customers)
            .set({ address: "House 12, Road 45, Gulshan 2, Dhaka", latitude: 23.7925, longitude: 90.4078 })
            .where(eq(customers.userId, u.id));
          const result = await loadCustomer(db, u.id);
          return c.json({ success: true as const, message: "Login successful", is_new: false, result });
        }
        return res;
      })

      .get(`${P}/me`, requireUser, async (c) => {
        const result = await loadCustomer(db, c.get("user")!.id);
        return c.json({ success: true as const, result });
      })

      // Saves name, address and location (also called "registration").
      .post(`${P}/register`, requireUser, zValidator("json", contract.registerInput), async (c) => {
        const id = c.get("user")!.id;
        const b = c.req.valid("json");
        // The app sends latitude in `longitude` and longitude in `latitude`.
        const latitude = b.longitude;
        const longitude = b.latitude;
        const hasPoint =
          latitude !== undefined &&
          longitude !== undefined &&
          Math.abs(latitude) <= 90 &&
          Math.abs(longitude) <= 180 &&
          !(latitude === 0 && longitude === 0);

        const userPatch: Partial<typeof user.$inferInsert> = {};
        if (b.customer_name !== undefined) userPatch.name = b.customer_name;
        if (b.email) {
          const [taken] = await db.select({ id: user.id }).from(user).where(eq(user.email, b.email.toLowerCase()));
          if (taken && taken.id !== id) return fail(c, 409, "This email is already used by another account");
          userPatch.email = b.email.toLowerCase();
        }
        if (Object.keys(userPatch).length) await db.update(user).set(userPatch).where(eq(user.id, id));

        await db
          .insert(customers)
          .values({ userId: id })
          .onConflictDoNothing();
        await db
          .update(customers)
          .set({
            ...(b.customer_address !== undefined && { address: b.customer_address }),
            ...(b.alternative_contact_no !== undefined && { altPhone: b.alternative_contact_no }),
            ...(b.district_id && b.district_id !== contract.NO_AREA_ID && { districtId: b.district_id }),
            ...(b.district_name_by_location !== undefined && { districtName: b.district_name_by_location }),
            ...(hasPoint && { latitude, longitude }),
          })
          .where(eq(customers.userId, id));

        const result = await loadCustomer(db, id);
        return c.json({ success: true as const, message: "Profile saved", result });
      })

      .post(`${P}/logout`, async (c) => {
        if (c.get("session")) {
          const { headers } = await auth.api.signOut({ headers: c.req.raw.headers, returnHeaders: true });
          withCookies(c, headers);
        }
        return c.json({ success: true as const, message: "Logged out" });
      })
  );
};
