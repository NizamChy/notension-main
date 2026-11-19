// Demo mode: when on, every API request is answered from the frontend demo
// data in `src/demo/modules/*` instead of the real backends, and images
// come from `public/demo/`. It is on by default; the choice is kept per
// browser in localStorage. Changing it reloads the page so every module
// (API clients, image base URLs) picks up the new mode from the start.

const STORAGE_KEY = "notension-demo-mode";
export const DEMO_MODE_DEFAULT = true;

export const isDemoMode = () => {
  // The server never answers API calls itself (all data is fetched in the
  // browser), so it only needs a stable value.
  if (typeof window === "undefined") return DEMO_MODE_DEFAULT;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === null) return DEMO_MODE_DEFAULT;
    return saved === "on";
  } catch {
    return DEMO_MODE_DEFAULT;
  }
};

export const saveDemoMode = (on) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Storage blocked (private mode etc.): the default stays in effect.
  }
};
