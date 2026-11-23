import axios, { type AxiosInstance } from "axios";
import { demoAdapter } from "@/demo/demoAdapter";

// One shared axios instance per base URL (instead of a new instance being
// created inside every hook on every render).
const clients = new Map<string, AxiosInstance>();

const DEFAULT_TIMEOUT_MS = 15000;

export const getApiClient = (baseURL: string): AxiosInstance => {
  if (!clients.has(baseURL)) {
    clients.set(
      baseURL,
      axios.create({
        baseURL,
        withCredentials: true,
        // Requests that hang now fail after the timeout, so every `.catch`
        // that resets a loading flag actually runs.
        timeout: DEFAULT_TIMEOUT_MS,
        // Sends API requests to the network and answers from demo data while
        // the API is down (src/demo/backendStatus.ts).
        adapter: demoAdapter,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    );
  }
  // Set just above when it was missing.
  return clients.get(baseURL)!;
};
