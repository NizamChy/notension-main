import axios from "axios";

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
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
    );
  }
  return clients.get(baseURL);
};
