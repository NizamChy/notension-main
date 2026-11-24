import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
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
import { isLiveRequest } from "@/api-endpoints/live";
import { isBackendOffline, isSampleDataForced, markBackendOffline } from "./backendStatus";

// An axios adapter that answers requests from the demo routes instead of the
// network. Every route belongs to one backend ("service"), matched by the
// base URL the request was sent to.

// `params` (the route's `:name` segments), `query` and `body` are whatever the
// app sent, so handlers read them field by field the way the real backend
// did: `any` on purpose.
type RequestData = any;

export type DemoRequest = {
  params: Record<string, RequestData>;
  query: Record<string, RequestData>;
  body: RequestData;
  path: string;
  method: string;
};

export type DemoRoute = {
  service: string;
  method: string;
  path: string;
  handler: (request: DemoRequest) => unknown;
};

const SERVICE_BASES: Record<string, string> = {
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

const trimSlashes = (value: string = "") => value.replace(/\/+$/, "");
const normalizePath = (value = "") =>
  `/${value.replace(/^\/+/, "").replace(/\/{2,}/g, "/")}`.replace(/\/+$/, "") ||
  "/";

const isAbsolute = (url = "") => /^https?:\/\//i.test(url);

const resolveRequest = (config: InternalAxiosRequestConfig) => {
  const rawUrl = config.url || "";
  const fullUrl = isAbsolute(rawUrl)
    ? rawUrl
    : `${trimSlashes(config.baseURL || "")}/${rawUrl.replace(/^\/+/, "")}`;

  const [withoutQuery = "", queryString = ""] = fullUrl.split("?");
  const query: Record<string, RequestData> = {
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

const matchPath = (pattern: string, path: string) => {
  const patternParts = normalizePath(pattern).split("/");
  const pathParts = path.split("/");
  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    const part = patternParts[i] ?? "";
    const value = pathParts[i] ?? "";
    if (part.startsWith(":")) {
      params[part.slice(1)] = decodeURIComponent(value);
    } else if (part !== value) {
      return null;
    }
  }
  return params;
};

const parseBody = (data: unknown): RequestData => {
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
type DemoStatusResponse = { [STATUS]: number; body: unknown };
export const demoResponse = (status: number, body: unknown): DemoStatusResponse => ({
  [STATUS]: status,
  body,
});

const isStatusResponse = (result: unknown): result is DemoStatusResponse =>
  Boolean(result && (result as Partial<DemoStatusResponse>)[STATUS]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Services on the new API (see live.ts) go to the network.
const networkAdapter = axios.getAdapter(["fetch", "xhr", "http"]);

// Did this request fail because the API is down (rather than refusing the
// request)? A read is retried from demo data on any server failure. A write
// only when it surely never reached the API, so an order is never placed
// twice.
const isOutage = (error: unknown, method: string) => {
  if (axios.isCancel(error)) return false;
  const { code, response } = (error ?? {}) as Partial<AxiosError>;
  if (code === AxiosError.ERR_CANCELED) return false;
  const status = response?.status;
  if (method === "GET") return !status || status >= 500;
  return status ? [502, 503].includes(status) : code === AxiosError.ERR_NETWORK;
};

const OFFLINE_MESSAGE = "Our server isn't responding right now. Please try again in a few minutes.";

export const demoAdapter = async (
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> => {
  const method = (config.method || "get").toUpperCase();
  const { service, path, query } = resolveRequest(config);

  // Endpoints on the new API go to the network (see live.ts). While the API
  // is down, or the visitor chose sample data, they get demo data
  // (src/demo/backendStatus.ts).
  const forced = isSampleDataForced();
  let fallback = false;
  // `service` is null for a URL outside every backend; passed on unchanged.
  if (isLiveRequest(service as string, path)) {
    if (!forced && !isBackendOffline()) {
      try {
        return await networkAdapter(config);
      } catch (error) {
        if (!isOutage(error, method)) throw error;
        markBackendOffline();
      }
    }
    fallback = true;
  }

  let status = fallback ? 503 : 404;
  let body: unknown = { success: false, message: fallback ? OFFLINE_MESSAGE : "Not available in demo mode" };

  // During an outage, sign-in and favourites need the real account, so they
  // wait for the API. Chosen sample data has its own demo sign-in.
  const route = fallback && !forced && service === "USER" ? null : DEMO_ROUTES.find(
    (r) =>
      r.service === service &&
      r.method.toUpperCase() === method &&
      matchPath(r.path, path),
  );

  if (route) {
    const params = matchPath(route.path, path);
    try {
      const result = await route.handler({
        params: params ?? {},
        query,
        body: parseBody(config.data),
        path,
        method,
      });
      if (isStatusResponse(result)) {
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

  const response: AxiosResponse = {
    data: body,
    status,
    statusText: status === 200 ? "OK" : "Demo",
    headers: { "content-type": "application/json", "x-notension-source": "demo" },
    config,
    request: {},
  };

  const validateStatus = config.validateStatus || ((s: number) => s >= 200 && s < 300);
  if (validateStatus(status)) return response;

  throw new AxiosError(
    `Request failed with status code ${status}`,
    status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
    config,
    response.request,
    response,
  );
};
