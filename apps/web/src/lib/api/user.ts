import { z } from "zod";
import { customer } from "@notension/shared";
import {
  CUSTOMER_LOGOUT,
  DEMO_LOGIN,
  OTP_FOR_REGISTRATION,
  USER_REGISTRATION,
  VERIFY_OTP,
} from "@/api-endpoints/api-endpoint";
import { apiPost } from "./request";

// Customer login and profile (/api/v1/customer/*). Two flows share the
// paths: the new API (live login, OTP checked on the server, session
// cookie) and the old one, which demo mode answers (demo/modules/user.ts).

export type Customer = customer.Customer;
export type SessionCustomer = customer.SessionCustomer;
export type SendOtpResult = z.infer<typeof customer.sendOtpResult>;
export type LegacySendOtpResult = z.infer<typeof customer.legacySendOtpResult>;
export type LoginResult = z.infer<typeof customer.loginResult>;
export type ProfileResult = z.infer<typeof customer.profileResult>;

/** New API: makes and sends (or, without SMS, returns) the code. */
export function sendOtp(contactNo: string): Promise<SendOtpResult> {
  return apiPost("USER", OTP_FOR_REGISTRATION, { contact_no: contactNo }, customer.sendOtpResult);
}

/**
 * Old flow: the app makes the code itself and sends it along (demo mode
 * shows it in a toast). Without `otp` it only looks the account up.
 */
export function sendOtpLegacy(body: {
  contact_no: string;
  otp?: number;
  smsKey?: string;
}): Promise<LegacySendOtpResult> {
  return apiPost("USER", OTP_FOR_REGISTRATION, body, customer.legacySendOtpResult);
}

/** New API: checks the code and sets the session cookie. */
export function verifyOtp(contactNo: string, otp: string): Promise<LoginResult> {
  return apiPost("USER", VERIFY_OTP, { contact_no: contactNo, otp }, customer.loginResult);
}

/** New API: signs in as the shared demo account, no SMS. */
export function demoLogin(): Promise<LoginResult> {
  return apiPost("USER", DEMO_LOGIN, undefined, customer.loginResult);
}

/**
 * Saves name, address and location ("register"). The old flow also logs in
 * or creates the account here. latitude/longitude travel swapped (useUser).
 */
export function saveProfile(body: Record<string, unknown>): Promise<ProfileResult> {
  return apiPost("USER", USER_REGISTRATION, body, customer.profileResult);
}

/** New API: ends the server session. */
export function logoutCustomer(): Promise<z.infer<typeof customer.logoutResult>> {
  return apiPost("USER", CUSTOMER_LOGOUT, undefined, customer.logoutResult);
}
