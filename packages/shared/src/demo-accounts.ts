// Public demo sign-ins, one per role. The API seeds them on every deploy
// (apps/api/src/seed/demo-accounts.ts) and resets their passwords; the web
// shows them on /admin/login and /demo-accounts, and the PDF script
// (apps/web/scripts/demo-accounts-pdf.mjs) reads the same JSON file.
// These are demo values, meant to be public.
import data from "./demo-accounts.json";

export type DemoAccount = {
  phone: string;
  name: string;
  role:
    | "super_admin"
    | "admin"
    | "support"
    | "finance"
    | "content_manager"
    | "merchant_owner"
    | "merchant_manager"
    | "merchant_staff"
    | "rider"
    | "doctor"
    | "service_provider";
  // Store roles: the store, and its module.
  storeId?: string;
  storeName?: string;
  module?: string;
  // The doctor / All Care provider profile this account manages.
  doctorId?: string;
  providerId?: string;
  // What the role can do, in a line.
  can: string;
};

export const DEMO_PASSWORD: string = data.password;
export const DEMO_ACCOUNTS = data.accounts as DemoAccount[];
// The shared demo customer ("Log in as Demo User", no password).
export const DEMO_CUSTOMER = data.customer;

export const DEMO_ACCOUNT_PHONES: readonly string[] = DEMO_ACCOUNTS.map((a) => a.phone);
export const isDemoAccountPhone = (phone: string | null | undefined) => !!phone && DEMO_ACCOUNT_PHONES.includes(phone);
