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
  // Login and profile; favourites are still demo data.
  USER: /^\/api\/v1\/customer\/(send-otp|verify-otp|demo-login|register|me|logout)$/,
};

export const isLiveRequest = (service, path) =>
  isLiveService(service) && (!LIVE_PATHS[service] || LIVE_PATHS[service].test(path));

export const proxyBase = (service) => `/api-proxy/${service.toLowerCase()}`;
