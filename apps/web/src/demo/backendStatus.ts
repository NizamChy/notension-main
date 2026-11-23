// Is the API (apps/api) reachable? The site uses the API; while it can't be
// reached, the demo adapter answers from the demo data in src/demo/modules
// instead, and BackendStatusBanner tells the visitor. The visitor can also
// choose sample data on purpose (the Demo mode button, isSampleDataForced).
//
//   "unknown" : not checked yet (requests still go to the API)
//   "online"  : the API answers
//   "offline" : a request or the health check failed; demo data is shown
//   "back"    : the API answers again; the banner offers a reload
//
// Only the browser changes it. The server render always says "unknown".

const HEALTH_URL = "/api-proxy/health/health";
const CHECK_TIMEOUT_MS = 8000;
const RECHECK_MS = 60 * 1000;

let status = "unknown";
let recheckTimer = null;
const listeners = new Set();

export const getBackendStatus = () => status;
export const isBackendOffline = () => status === "offline";
export const getServerBackendStatus = () => "unknown";

// The Demo mode button: sample data even while the API answers. Kept per
// browser; switching reloads the page (DemoModeToggle).
const FORCED_KEY = "notension-sample-data";

export const isSampleDataForced = () => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(FORCED_KEY) === "on";
  } catch {
    return false;
  }
};

export const setSampleDataForced = (on) => {
  try {
    if (on) window.localStorage.setItem(FORCED_KEY, "on");
    else window.localStorage.removeItem(FORCED_KEY);
  } catch {
    // Storage blocked (private mode etc.): stays on live data.
  }
};

export const subscribeBackendStatus = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const setStatus = (next) => {
  if (next === status) return;
  status = next;
  listeners.forEach((listener) => listener());
};

// True when the API's health endpoint answers in time.
export const checkBackend = async () => {
  try {
    const res = await fetch(HEALTH_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
    });
    return res.ok;
  } catch {
    return false;
  }
};

const recheck = async () => {
  if (!(await checkBackend())) return;
  clearInterval(recheckTimer);
  recheckTimer = null;
  setStatus("back");
};

export const markBackendOffline = () => {
  if (typeof window === "undefined") return;
  setStatus("offline");
  if (!recheckTimer) recheckTimer = setInterval(recheck, RECHECK_MS);
};

// Once on page load, so a dead API is noticed before the first data request
// has to time out.
export const startBackendCheck = async () => {
  if (typeof window === "undefined") return;
  if (await checkBackend()) {
    if (status === "unknown") setStatus("online");
  } else {
    markBackendOffline();
  }
};
