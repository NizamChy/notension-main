// The customer ("user") shape the web app keeps in redux, and the login
// requests. Paths: /api/v1/customer/*.
import { z } from "zod";

export const NO_AREA_ID = "303030303030303030303030";

export const bdPhone = z
  .string()
  .trim()
  .regex(/^01[3-9]\d{8}$/, "Enter a valid mobile number (01XXXXXXXXX)");

export const customer = z.object({
  _id: z.string(),
  custom_id: z.string(),
  customer_name: z.string(),
  customer_address: z.string(),
  email: z.string(),
  contact_no: z.string(),
  alternative_contact_no: z.string(),
  district_id: z.string(),
  district_name_by_location: z.string(),
  district_area_id: z.string(),
  district_subarea_id: z.string(),
  ref_contact: z.string(),
  // [latitude, longitude], the order the app reads them in.
  location: z.object({ type: z.literal("Point"), coordinates: z.tuple([z.number(), z.number()]) }).nullable(),
  roles: z.array(z.string()),
});
export type Customer = z.infer<typeof customer>;

export const sendOtpInput = z.object({ contact_no: z.string() });
export const verifyOtpInput = z.object({ contact_no: z.string(), otp: z.string().trim().min(4).max(8) });

export const sendOtpResult = z.object({
  success: z.literal(true),
  message: z.string(),
  // "response": no SMS provider yet, the code is in `demo_otp`.
  otp_delivery: z.enum(["sms", "response"]),
  demo_otp: z.string().optional(),
});

// Profile fields the app sends to /register. latitude/longitude arrive
// swapped (see useUser.ts): `longitude` holds the latitude.
const text = z.string().trim().max(300).optional().catch(undefined);
const coord = z.coerce.number().finite().optional().catch(undefined);
export const registerInput = z.object({
  customer_name: z.string().trim().max(100).optional().catch(undefined),
  customer_address: text,
  email: z.string().trim().email().optional().catch(undefined),
  alternative_contact_no: z.string().trim().max(20).optional().catch(undefined),
  district_id: text,
  district_name_by_location: text,
  latitude: coord,
  longitude: coord,
});

// ---- Responses the web app reads (apps/api and demo mode) ----

// A customer as the app keeps it. The new API adds `roles`; the old flow
// (answered by demo data, apps/web/src/demo/modules/user.ts) has none.
export const sessionCustomer = customer.extend({ roles: z.array(z.string()).optional() });
export type SessionCustomer = z.infer<typeof sessionCustomer>;

// verify-otp and demo-login (new API). `is_new`: the account has no name
// yet, so the app asks for name and address next.
export const loginResult = z.object({
  success: z.literal(true),
  message: z.string(),
  is_new: z.boolean(),
  result: customer.nullable(),
});

// send-otp on the old flow (demo data): also says whether the number has an
// account, and returns it.
export const legacySendOtpResult = z.object({
  success: z.literal(true),
  message: z.string(),
  user_exist: z.boolean(),
  result: sessionCustomer.nullable(),
});

// register (saves name, address and location), on both flows.
export const profileResult = z.object({
  success: z.literal(true),
  message: z.string(),
  result: sessionCustomer.nullable(),
});

export const logoutResult = z.object({ success: z.literal(true), message: z.string() });
