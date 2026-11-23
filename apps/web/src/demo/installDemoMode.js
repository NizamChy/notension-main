import axios from "axios";
import { demoAdapter } from "./demoAdapter";
import { startBackendCheck } from "./backendStatus";
import { useSessionStore } from "@/stores/sessionStore";
import { DEFAULT_DEMO_LOCATION, toUserLocation } from "./demoLocations";

// Anything that calls the global axios instance directly gets the same
// adapter as the API clients: the network, or demo data while the API is
// down. This runs when the module is first imported, before any component
// renders or fetches.
axios.defaults.adapter = demoAdapter;

if (typeof window !== "undefined") {
  // The old demo-mode switch (on by default) saved its choice under this key;
  // the new one uses another, so nobody is stuck on sample data.
  try {
    window.localStorage.removeItem("notension-demo-mode");
  } catch {
    // Storage blocked: nothing to clean up.
  }
  startBackendCheck();
}

// Runs after the saved stores load and before the app renders: a first
// visit starts in Dhaka, which has data in every module.
export const applyDemoDefaults = () => {
  const { currentUserLocation } = useSessionStore.getState();
  if (!currentUserLocation?.districtId) {
    const loc = toUserLocation(DEFAULT_DEMO_LOCATION);
    useSessionStore.getState().saveLocation(loc);
  }
};
