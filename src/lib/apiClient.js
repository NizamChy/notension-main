import axios from "axios";
import { isDemoMode } from "@/demo/demoMode";
import { demoAdapter } from "@/demo/demoAdapter";

// One shared axios instance per base URL (instead of a new instance being
// created inside every hook on every render).
const clients = new Map();

const DEFAULT_TIMEOUT_MS = 15000;

export const getApiClient = (baseURL) => {
  if (!clients.has(baseURL)) {
    clients.set(
      baseURL,
      axios.create({
        baseURL,
        withCredentials: true,
        // Requests that hang now fail after the timeout, so every `.catch`
        // that resets a loading flag actually runs.
        timeout: DEFAULT_TIMEOUT_MS,
        // Demo mode answers from frontend demo data instead of the network.
        ...(isDemoMode() && { adapter: demoAdapter }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    );
  }
  return clients.get(baseURL);
};
