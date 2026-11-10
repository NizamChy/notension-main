import { AxiosError } from "axios";
import {
  FOOD_URL,
  USER_URL,
  GROCERY_URL,
  MEDICINE_URL,
  HEALTH_CARE_URL,
  FASHION_BASE_URL,
  ALL_DISTRICTS_URL,
  ALL_CARE_SERVICE_URL,
} from "@/api-endpoints/env";
import { DEMO_ROUTES } from "./routes";

// An axios adapter that answers requests from the demo routes instead of the
// network. Every route belongs to one backend ("service"), matched by the
// base URL the request was sent to.

const SERVICE_BASES = {
  FOOD: FOOD_URL,
  USER: USER_URL,
  GROCERY: GROCERY_URL,
  MEDICINE: MEDICINE_URL,
  HEALTH_CARE: HEALTH_CARE_URL,
  FASHION: FASHION_BASE_URL,
  ALL_DISTRICTS: ALL_DISTRICTS_URL,
  ALL_CARE: ALL_CARE_SERVICE_URL,
};

const LATENCY_MS = 250;

const trimSlashes = (value = "") => value.replace(/\/+$/, "");
const normalizePath = (value = "") =>
  `/${value.replace(/^\/+/, "").replace(/\/{2,}/g, "/")}`.replace(/\/+$/, "") ||
  "/";

const isAbsolute = (url = "") => /^https?:\/\//i.test(url);

const resolveRequest = (config) => {
  const rawUrl = config.url || "";
  const fullUrl = isAbsolute(rawUrl)
    ? rawUrl
    : `${trimSlashes(config.baseURL || "")}/${rawUrl.replace(/^\/+/, "")}`;

  const [withoutQuery, queryString = ""] = fullUrl.split("?");
  const query = {
    ...Object.fromEntries(new URLSearchParams(queryString)),
    ...(config.params || {}),
  };

  // Longest base first, in case one backend URL is a prefix of another.
  const services = Object.entries(SERVICE_BASES)
    .filter(([, base]) => base)
    .sort(([, a], [, b]) => b.length - a.length);

  for (const [service, base] of services) {
    const cleanBase = trimSlashes(base);
    if (withoutQuery.startsWith(cleanBase)) {
      return {
        service,
        path: normalizePath(withoutQuery.slice(cleanBase.length)),
        query,
      };
    }
  }

  return { service: null, path: normalizePath(withoutQuery), query };
};

const matchPath = (pattern, path) => {
  const patternParts = normalizePath(pattern).split("/");
  const pathParts = path.split("/");
  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    const part = patternParts[i];
    if (part.startsWith(":")) {
      params[part.slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (part !== pathParts[i]) {
      return null;
    }
  }
  return params;
};

const parseBody = (data) => {
  if (data == null) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  if (typeof FormData !== "undefined" && data instanceof FormData) {
    return Object.fromEntries(data.entries());
  }
  return data;
};

// Handlers return the response body. To answer with another status, return
// `demoResponse(status, body)`.
const STATUS = Symbol("demoStatus");
export const demoResponse = (status, body) => ({ [STATUS]: status, body });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const demoAdapter = async (config) => {
  const method = (config.method || "get").toUpperCase();
  const { service, path, query } = resolveRequest(config);

  let status = 404;
  let body = { success: false, message: "Not available in demo mode" };

  const route = DEMO_ROUTES.find(
    (r) =>
      r.service === service &&
      r.method.toUpperCase() === method &&
      matchPath(r.path, path),
  );

  if (route) {
    const params = matchPath(route.path, path);
    try {
      const result = await route.handler({
        params,
        query,
        body: parseBody(config.data),
        path,
        method,
      });
      if (result && result[STATUS]) {
        status = result[STATUS];
        body = result.body;
      } else {
        status = 200;
        body = result;
      }
    } catch (error) {
      console.error("[demo] handler failed", method, path, error);
      status = 500;
      body = { success: false, message: "Demo handler error" };
    }
  } else if (process.env.NODE_ENV !== "production") {
    console.warn("[demo] no demo route for", service, method, path);
  }

  await sleep(LATENCY_MS);

  const response = {
    data: body,
    status,
    statusText: status === 200 ? "OK" : "Demo",
    headers: { "content-type": "application/json" },
    config,
    request: {},
  };

  const validateStatus = config.validateStatus || ((s) => s >= 200 && s < 300);
  if (validateStatus(status)) return response;

  throw new AxiosError(
    `Request failed with status code ${status}`,
    status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
    config,
    response.request,
    response,
  );
};
