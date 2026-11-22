import type { z } from "zod";
import { getApiClient } from "@/lib/apiClient";
import {
  ALL_CARE_SERVICE_URL,
  ALL_DISTRICTS_URL,
  FASHION_BASE_URL,
  FOOD_URL,
  GROCERY_URL,
  HEALTH_CARE_URL,
  MEDICINE_URL,
  USER_URL,
} from "@/api-endpoints/env";
import { validate, type Source } from "./validate";

export type Service =
  | "GROCERY"
  | "MEDICINE"
  | "FOOD"
  | "FASHION"
  | "HEALTH_CARE"
  | "ALL_CARE"
  | "USER"
  | "ALL_DISTRICTS";

const SERVICE_URLS: Record<Service, string> = {
  GROCERY: GROCERY_URL,
  MEDICINE: MEDICINE_URL,
  FOOD: FOOD_URL,
  FASHION: FASHION_BASE_URL,
  HEALTH_CARE: HEALTH_CARE_URL,
  ALL_CARE: ALL_CARE_SERVICE_URL,
  USER: USER_URL,
  ALL_DISTRICTS: ALL_DISTRICTS_URL,
};

const sourceOf = (headers: Record<string, unknown> | undefined): Source =>
  headers?.["x-notension-source"] === "demo" ? "demo" : "live";

export async function apiGet<S extends z.ZodType>(
  service: Service,
  path: string,
  schema: S,
  params?: Record<string, unknown>,
): Promise<z.infer<S>> {
  const response = await getApiClient(SERVICE_URLS[service]).get(path, { params });
  return validate(schema, response.data, {
    source: sourceOf(response.headers),
    endpoint: `GET ${service} ${path}`,
  });
}

export async function apiPost<S extends z.ZodType>(
  service: Service,
  path: string,
  body: unknown,
  schema: S,
): Promise<z.infer<S>> {
  const response = await getApiClient(SERVICE_URLS[service]).post(path, body);
  return validate(schema, response.data, {
    source: sourceOf(response.headers),
    endpoint: `POST ${service} ${path}`,
  });
}
