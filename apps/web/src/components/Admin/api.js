// The admin / merchant panel always talks to the real API (apps/api), even in
// demo mode: plain fetch through this site's /api-proxy rewrite, so the staff
// session cookie is first-party. The demo adapter only hooks the axios
// clients, never fetch.
export const ADMIN_API = "/api-proxy/admin/api/v1/admin";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    // React Query's retry rule (QueryProvider) reads error.response.status.
    this.response = { status };
  }
}

// The API answers { success: false, message } for its own errors; request
// validation errors come as { error: { message: "<JSON list of issues>" } }.
function messageOf(body, status) {
  if (body?.message) return body.message;
  const err = body?.error;
  if (err?.issues?.[0]?.message) return issueText(err.issues[0]);
  if (typeof err?.message === "string") {
    try {
      const issues = JSON.parse(err.message);
      if (Array.isArray(issues) && issues[0]) return issueText(issues[0]);
    } catch {
      return err.message;
    }
  }
  if (status === 401) return "Please log in first";
  if (status === 403) return "You don't have access to this";
  if (status === 404) return "Not found";
  return "Something went wrong. Please try again.";
}

const issueText = (issue) =>
  issue.path?.length ? `${issue.path.join(".")}: ${issue.message}` : issue.message;

const isPublic = (path) => path === "/login" || path.startsWith("/setup");

export async function adminApi(path, { method = "GET", body, query } = {}) {
  let url = ADMIN_API + path;
  if (query) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    }
    const s = qs.toString();
    if (s) url += `?${s}`;
  }
  let res;
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
  let data = null;
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
  return data;
}

// ------------------------------------------------------------- formatting

export const MODULES = ["grocery", "medicine", "food", "fashion"];
export const ORDER_STATUSES = ["Pending", "Accepted", "Processing", "On the way", "Delivered", "Cancelled"];

const takaFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
export const taka = (n) => `৳${takaFmt.format(Number(n) || 0)}`;

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Dhaka",
});
export const formatDate = (d) => (d ? dateFmt.format(new Date(d)) : "");

// "1 kg" + "kg" -> "1 kg" (some pack sizes already carry the unit)
export const packLabel = ({ packSize, unit } = {}) => {
  if (!packSize) return unit || "";
  if (!unit || String(packSize).toLowerCase().includes(String(unit).toLowerCase())) return String(packSize);
  return `${packSize} ${unit}`;
};

export const titleCase = (s) =>
  String(s || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const ROLE_LABELS = {
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
export const roleLabel = (r) => ROLE_LABELS[r] || titleCase(r);
