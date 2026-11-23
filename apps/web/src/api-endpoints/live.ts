// Services that run on the new API (apps/api). A live service is reached
// through this app's /api-proxy rewrite (next.config.mjs), so its session
// cookie is first-party.
//
// Every service the API implements is live. NEXT_PUBLIC_LIVE_SERVICES can add
// more; NEXT_PUBLIC_DEMO_ONLY_SERVICES (e.g. "FOOD,FASHION") sends some back
// to demo data. Demo mode keeps answering everything else, including the parts
// of a live service the API doesn't have yet (LIVE_PATHS).
const API_SERVICES = ["GROCERY", "USER", "MEDICINE", "FOOD", "FASHION", "HEALTH_CARE", "ALL_CARE"];

const serviceList = (value) =>
  (value || "")
    .split(",")
    .map((s) => s.trim().toUpperCase().replace(/-/g, "_"))
    .filter(Boolean);

const demoOnly = new Set(serviceList(process.env.NEXT_PUBLIC_DEMO_ONLY_SERVICES));

export const LIVE_SERVICES = new Set(
  [...API_SERVICES, ...serviceList(process.env.NEXT_PUBLIC_LIVE_SERVICES)].filter((s) => !demoOnly.has(s)),
);

// Accepts "HEALTH_CARE" or "health-care".
export const isLiveService = (service) => LIVE_SERVICES.has(service.toUpperCase().replace(/-/g, "_"));

// Services only partly on the API: the paths it serves. Others: all paths.
const LIVE_PATHS = {
  // Login, profile and favourites (stores, items, centres/doctors).
  USER: new RegExp(
    "^/api/v1/customer/(" +
      [
        "send-otp|verify-otp|demo-login|register|me|logout",
        "add-favourite-store|push-store|remove-store|get-favourite-store-info",
        "add-favourite-item|push-item|remove-item|get-favourite-item-info",
        "add-to-favourite-list|push-to-favourite-list|remove-from-favourite-list|get-favourite-list",
      ].join("|") +
      ")$",
  ),
};

export const isLiveRequest = (service, path) =>
  isLiveService(service) && (!LIVE_PATHS[service] || LIVE_PATHS[service].test(path));

export const proxyBase = (service) => `/api-proxy/${service.toLowerCase()}`;
