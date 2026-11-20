// Services that already run on the new API (apps/api). Set with
// NEXT_PUBLIC_LIVE_SERVICES=GROCERY,USER. A live service is reached through
// this app's /api-proxy rewrite (next.config.mjs), so its session cookie is
// first-party, unless NEXT_PUBLIC_<SERVICE>_URL points elsewhere.
//
// Demo mode keeps answering everything else, including the parts of a live
// service the API doesn't have yet (LIVE_PATHS).
export const LIVE_SERVICES = new Set(
  (process.env.NEXT_PUBLIC_LIVE_SERVICES || "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean),
);

export const isLiveService = (service) => LIVE_SERVICES.has(service);

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
