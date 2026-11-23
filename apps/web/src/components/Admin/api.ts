// The admin / merchant panel always talks to the real API (apps/api), even in
// demo mode: plain fetch through this site's /api-proxy rewrite, so the staff
// session cookie is first-party. The demo adapter only hooks the axios
// clients, never fetch.
import type { ApiResponse, Module, OrderStatus, Role } from "./types";

export const ADMIN_API = "/api-proxy/admin/api/v1/admin";

export class ApiError extends Error {
  status: number;
  response: { status: number };

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    // React Query's retry rule (QueryProvider) reads error.response.status.
    this.response = { status };
  }
}

// HTTP status of a failed admin request (React Query types its errors as
// plain Error; adminApi throws ApiError).
export const statusOf = (error: unknown): number | undefined =>
  typeof error === "object" && error !== null && "status" in error && typeof error.status === "number" ? error.status : undefined;

type Issue = { path?: (string | number)[]; message: string };

// What an error body may carry; anything else is ignored.
type ErrorBody = {
  success?: boolean;
  message?: string;
  error?: { issues?: Issue[]; message?: unknown };
};

// The API answers { success: false, message } for its own errors; request
// validation errors come as { error: { message: "<JSON list of issues>" } }.
function messageOf(body: ErrorBody | null, status: number): string {
  if (body?.message) return body.message;
  const err = body?.error;
  if (err?.issues?.[0]?.message) return issueText(err.issues[0]);
  if (typeof err?.message === "string") {
    try {
      const issues: unknown = JSON.parse(err.message);
      if (Array.isArray(issues) && issues[0]) return issueText(issues[0] as Issue);
    } catch {
      return err.message;
    }
  }
  if (status === 401) return "Please log in first";
  if (status === 403) return "You don't have access to this";
  if (status === 404) return "Not found";
  return "Something went wrong. Please try again.";
}

const issueText = (issue: Issue) =>
  issue.path?.length ? `${issue.path.join(".")}: ${issue.message}` : issue.message;

const isPublic = (path: string) => path === "/login" || path.startsWith("/setup");

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
};

// R is the shape of `result` for this endpoint (see ./types).
export async function adminApi<R = unknown>(
  path: string,
  { method = "GET", body, query }: RequestOptions = {},
): Promise<ApiResponse<R>> {
  let url = ADMIN_API + path;
  if (query) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    }
    const s = qs.toString();
    if (s) url += `?${s}`;
  }
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      credentials: "include",
      cache: "no-store",
      headers: body !== undefined ? { "content-type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }
  let data: (ApiResponse<R> & ErrorBody) | null = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok || data?.success === false) {
    // A session that ended (signed out elsewhere, role removed): back to login.
    if (res.status === 401 && !isPublic(path) && typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin:unauthorized"));
    }
    throw new ApiError(messageOf(data, res.status), res.status);
  }
  // A 2xx body is always JSON from this API.
  return data as ApiResponse<R>;
}

// ------------------------------------------------------------- formatting

export const MODULES: Module[] = ["grocery", "medicine", "food", "fashion"];
export const ORDER_STATUSES: OrderStatus[] = ["Pending", "Accepted", "Processing", "On the way", "Delivered", "Cancelled"];

const takaFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
export const taka = (n: number | string | null | undefined) => `৳${takaFmt.format(Number(n) || 0)}`;

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Dhaka",
});
export const formatDate = (d: string | number | Date | null | undefined) => (d ? dateFmt.format(new Date(d)) : "");

type Pack = { packSize?: string | null; unit?: string | null };

// "1 kg" + "kg" -> "1 kg" (some pack sizes already carry the unit)
export const packLabel = ({ packSize, unit }: Pack = {}) => {
  if (!packSize) return unit || "";
  if (!unit || String(packSize).toLowerCase().includes(String(unit).toLowerCase())) return String(packSize);
  return `${packSize} ${unit}`;
};

export const titleCase = (s: string | null | undefined) =>
  String(s || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  support: "Support",
  finance: "Finance",
  content_manager: "Content manager",
  merchant_owner: "Store owner",
  merchant_manager: "Store manager",
  merchant_staff: "Store staff",
  rider: "Rider",
  doctor: "Doctor",
  service_provider: "Service provider",
  customer: "Customer",
};
// Takes any string: demo accounts and old data may carry other role names.
export const roleLabel = (r: string) => ROLE_LABELS[r as Role] || titleCase(r);
