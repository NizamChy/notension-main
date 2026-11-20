import axios from "axios";
import store from "@/redux/store";
import { demoAdapter } from "./demoAdapter";
import { startBackendCheck } from "./backendStatus";
import { handleUserReducer } from "@/redux/userReducer";
import { DEFAULT_DEMO_LOCATION, toUserLocation } from "./demoLocations";

// The fashion module calls the global axios instance directly, so it gets the
// same adapter as the API clients: the network, or demo data while the API is
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

// Runs after redux-persist rehydrates and before the app renders: a first
// visit starts in Dhaka, which has data in every module.
export const applyDemoDefaults = () => {
  const { currentUserLocation } = store.getState().user;
  if (!currentUserLocation?.districtId) {
    store.dispatch(
      handleUserReducer({
        type: "SAVE_USER_CURRENT_LOCATION",
        data: toUserLocation(DEFAULT_DEMO_LOCATION),
      }),
    );
  }
};
