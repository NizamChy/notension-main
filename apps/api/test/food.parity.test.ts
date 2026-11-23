// The food API must answer exactly like the web app's demo mode
// (src/demo/modules/food.ts). Each case sends the same request to both and
// compares the bodies; API responses are also checked against the contract.
import { food as contract } from "@notension/shared";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { DEMO_ROUTES } from "@/demo/routes";
import { createApp } from "../src/app";
import { createDb, type DbHandle } from "../src/db/client";
import { seedFood } from "../src/seed/food";
import { testApp } from "./helpers";

const DHAKA = "64f032f6c6635d0242c01e03";
const CTG = "64f03388fdd8ffc6aa95bdb9";
const KACCHI = "66f00d200000000000000001";
const SEABREEZE = "66f00d200000000000000007";
const CAT_PIZZA = "66f00d100000000000000003";
const CAT_CAFE = "66f00d100000000000000005";

let handle: DbHandle;
let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  handle = await createDb({}); // in-memory PGlite + PostGIS
  await handle.migrate();
  await seedFood(handle.db);
  app = testApp(handle.db);
});
afterAll(() => handle?.close());

type Req = { method: "GET" | "POST"; path: string; query?: Record<string, string>; body?: unknown };

const demoRoutes = (DEMO_ROUTES as any[]).filter((r) => r.service === "FOOD");

const demo = (req: Req) => {
  const route = demoRoutes.find((r) => r.method === req.method && r.path === req.path);
  if (!route) throw new Error(`no demo route ${req.method} ${req.path}`);
  return JSON.parse(JSON.stringify(route.handler({ query: req.query ?? {}, body: req.body ?? {}, params: {} })));
};

const api = async (req: Req) => {
  const url = `${req.path}?${new URLSearchParams(req.query ?? {})}`;
  const res = await app.request(url, {
    method: req.method,
    headers: req.body ? { "content-type": "application/json" } : {},
    body: req.body ? JSON.stringify(req.body) : undefined,
  });
  expect(res.status).toBe(200);
  return res.json();
};

const P = "/client-app-api/v1/food";
const list = <T extends z.ZodType>(s: T) => contract.ok(z.array(s));
const explore = contract.ok(contract.exploreStore);

const cases: [string, Req, z.ZodType?][] = [
  ["module, Dhaka", { method: "GET", path: `${P}/explore-module`, query: { district_id: DHAKA } }, contract.ok(contract.exploreModule)],
  ["module, Chittagong", { method: "GET", path: `${P}/explore-module`, query: { district_id: CTG } }, contract.ok(contract.exploreModule)],
  ["module, no district", { method: "GET", path: `${P}/explore-module` }],
  ["module, other district", { method: "GET", path: `${P}/explore-module`, query: { district_id: "64f0000000000000000000ff" } }],
  ["find by name", { method: "GET", path: `${P}/find-store`, query: { search: "Kacchi" } }, list(contract.foodStore)],
  ["find by dish", { method: "GET", path: `${P}/find-store`, query: { search: "biryani" } }],
  ["find by area", { method: "GET", path: `${P}/find-store`, query: { search: "gulshan" } }],
  ["find by address in category", { method: "GET", path: `${P}/find-store`, query: { search: "gulshan", StoreCategory: CAT_CAFE } }],
  ["find one letter", { method: "GET", path: `${P}/find-store`, query: { search: "a" } }],
  ["find blank", { method: "GET", path: `${P}/find-store`, query: { search: "  " } }],
  ["find wildcard", { method: "GET", path: `${P}/find-store`, query: { search: "%" } }],
  ["explore by id", { method: "GET", path: `${P}/explore-store`, query: { storeId: KACCHI } }, explore],
  ["explore by code", { method: "GET", path: `${P}/explore-store`, query: { custom_store_id: "FS-1003" } }, explore],
  ["explore closed store", { method: "GET", path: `${P}/explore-store`, query: { storeId: SEABREEZE } }, explore],
  ["explore missing", { method: "GET", path: `${P}/explore-store`, query: { storeId: "000000000000000000000000" } }, explore],
  ["explore nothing", { method: "GET", path: `${P}/explore-store` }, explore],
];

describe("food API matches demo mode", () => {
  it.each(cases)("%s", async (_name, req, schema) => {
    const [got, want] = await Promise.all([api(req), demo(req)]);
    expect(got).toEqual(want);
    if (schema) schema.parse(got);
  });

  it.each([
    ["Dhaka, with position", { district_id: DHAKA, shop_latitude: 23.7925, shop_longitude: 90.4078 }],
    ["Dhaka, category and range", { district_id: DHAKA, shop_latitude: 23.7925, shop_longitude: 90.4078, max_distance: 10000, StoreCategory: CAT_PIZZA }],
    ["Dhaka, short range", { district_id: DHAKA, shop_latitude: 23.7925, shop_longitude: 90.4078, max_distance: 1500 }],
    ["Dhaka, string coordinates", { district_id: DHAKA, shop_latitude: "23.79", shop_longitude: "90.41", max_distance: 10000 }],
    ["Chittagong, with position", { district_id: CTG, shop_latitude: 22.3264, shop_longitude: 91.8123 }],
    ["Dhaka, no position", { district_id: DHAKA }],
    ["Dhaka, no position, category", { district_id: DHAKA, StoreCategory: CAT_CAFE, max_distance: 10 }],
    ["no district", { shop_latitude: 23.79, shop_longitude: 90.41 }],
    ["other district", { district_id: "64f0000000000000000000ff", shop_latitude: 24, shop_longitude: 90 }],
  ])("nearest stores: %s", async (_name, body) => {
    const req: Req = { method: "POST", path: `${P}/get-nearest-store`, body };
    const [got, want] = await Promise.all([api(req), demo(req)]);
    list(contract.nearbyStore).parse(got);
    // PostGIS measures on the WGS84 spheroid, demo mode on a sphere: same
    // order, distances within 0.5%.
    expect(got.result.map((s: any) => s._id)).toEqual(want.result.map((s: any) => s._id));
    got.result.forEach((s: any, i: number) => {
      const { distance, ...rest } = s;
      const { distance: wantDistance, ...wantRest } = want.result[i];
      expect(rest).toEqual(wantRest);
      if (wantDistance === undefined) expect(distance).toBeUndefined();
      else expect(Math.abs(distance - wantDistance)).toBeLessThanOrEqual(Math.max(2, wantDistance * 0.005));
    });
    expect(got.success).toBe(true);
    expect(got.message).toBe(want.message);
  });
});
