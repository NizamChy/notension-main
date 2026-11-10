import axios from "axios";
import store from "@/redux/store";
import { isDemoMode } from "./demoMode";
import { demoAdapter } from "./demoAdapter";
import { handleUserReducer } from "@/redux/userReducer";
import { DEFAULT_DEMO_LOCATION, toUserLocation } from "./demoLocations";

// The fashion module calls the global axios instance directly, so demo mode
// replaces its adapter too. This runs when the module is first imported,
// before any component renders or fetches.
if (isDemoMode()) {
  axios.defaults.adapter = demoAdapter;
}

// Runs after redux-persist rehydrates and before the app renders, so the
// first data requests already use a location that has demo data.
export const applyDemoDefaults = () => {
  if (!isDemoMode()) return;

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
