import { isLiveService, proxyBase } from "./live";

// Backend base URLs come from .env.local. Without them (a fresh clone, or a
// deploy with no env vars) each service gets a placeholder base, so demo mode,
// which matches requests by base URL, still answers every request. Real
// requests to a placeholder simply fail (.invalid never resolves).
//
// Services on the new API (NEXT_PUBLIC_LIVE_SERVICES, see live.js) ignore
// their old backend URL and go through this app's /api-proxy/<service>.
const base = (value, service) =>
  isLiveService(service.toUpperCase())
    ? proxyBase(service)
    : value || `https://${service}.demo.invalid`;

export const ALL_CARE_SERVICE_URL = base(
  process.env.NEXT_PUBLIC_ALL_CARE_SERVICE_URL,
  "all-care",
);
export const FOOD_URL = base(process.env.NEXT_PUBLIC_FOOD_URL, "food");
export const USER_URL = base(process.env.NEXT_PUBLIC_USER_URL, "user");
// Images are the files in public/demo/ (see next.config.mjs rewrites): the
// API's data and the demo fallback both point at them.
const localImages = true;
export const IMAGE_URL = localImages
  ? "/demo-images"
  : process.env.NEXT_PUBLIC_IMAGE_URL;
export const GROCERY_URL = base(process.env.NEXT_PUBLIC_GROCERY_URL, "grocery");
export const MEDICINE_URL = base(
  process.env.NEXT_PUBLIC_MEDICINE_URL,
  "medicine",
);
export const HEALTH_CARE_URL = base(
  process.env.NEXT_PUBLIC_HEALTH_CARE_URL,
  "health-care",
);
export const ALL_DISTRICTS_URL = base(
  process.env.NEXT_PUBLIC_ALL_DISTRICTS_URL,
  "districts",
);
export const FASHION_BASE_URL = base(
  process.env.NEXT_PUBLIC_FASHION_BASE_URL,
  "fashion",
);
export const FASHION_IMAGE_URL = localImages
  ? "/demo-images/fashion"
  : process.env.NEXT_PUBLIC_FASHION_IMAGE_URL;
