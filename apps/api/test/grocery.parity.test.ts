// The API must answer exactly like the web app's demo mode, which is what the
// frontend is built against. Each case sends the same request to both and
// compares the bodies; every API response is also checked against the shared
// contract.
import { grocery as contract } from "@notension/shared";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { DEMO_ROUTES } from "@/demo/routes";
import { createApp } from "../src/app";
import { testApp } from "./helpers";
import { createDb, type DbHandle } from "../src/db/client";
import { seedDemo } from "../src/seed/demo";

const DHAKA = "64f032f6c6635d0242c01e03";
const CTG = "64f03388fdd8ffc6aa95bdb9";
const STORE = "6650a00100000000000000a1";
const STORE_CODE = "GS260002";
const SUB_RICE = "6650c00100000000000000d1";
const { specialOffer, popularItem } = contract.GROCERY_CUSTOM_TYPE_IDS;

let handle: DbHandle;
let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  handle = await createDb({}); // in-memory PGlite + PostGIS
  await handle.migrate();
  await seedDemo(handle.db);
  app = testApp(handle.db);
});
afterAll(() => handle?.close());

type Req = { method: "GET" | "POST"; path: string; query?: Record<string, string>; body?: unknown };

// Through the routes index: the module files import each other in a cycle.
const demoRoutes = (DEMO_ROUTES as any[]).filter((r) => r.service === "GROCERY");

const demo = (req: Req) => {
  const route = demoRoutes.find((r) => r.method === req.method && r.path === req.path);
  if (!route) throw new Error(`no demo route ${req.method} ${req.path}`);
  return JSON.parse(JSON.stringify(route.handler({ query: req.query ?? {}, body: req.body, params: {} })));
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

const P = "/client-app-api/v1/grocery";
const list = <T extends z.ZodType>(s: T) => contract.ok(z.array(s));

const cases: [string, Req, z.ZodType?][] = [
  ["explore by id", { method: "GET", path: `${P}/explore-store`, query: { storeId: STORE } }, contract.ok(contract.groceryExplore)],
  ["explore by code", { method: "GET", path: `${P}/explore-store`, query: { custom_store_id: STORE_CODE } }, contract.ok(contract.groceryExplore)],
  ["explore small store", { method: "GET", path: `${P}/explore-store`, query: { storeId: "6650a00100000000000000b2" } }],
  ["explore missing", { method: "GET", path: `${P}/explore-store`, query: { storeId: "000000000000000000000000" } }],
  ["find store by name", { method: "GET", path: `${P}/find-store`, query: { search: "fresh" } }, list(contract.groceryStore)],
  ["find store by area", { method: "GET", path: `${P}/find-store`, query: { search: "agrabad" } }],
  ["find store too short", { method: "GET", path: `${P}/find-store`, query: { search: "g" } }],
  ["search items", { method: "GET", path: `${P}/search-items`, query: { groceryStoreId: STORE, search: "rice" } }, list(contract.groceryItem)],
  ["search items bangla", { method: "GET", path: `${P}/search-items`, query: { groceryStoreId: STORE, search: "চাল" } }],
  ["search items by code", { method: "GET", path: `${P}/search-items`, query: { custom_store_id: STORE_CODE, search: "oil" } }],
  ["items by subtype", { method: "GET", path: `${P}/items-by-subtype`, query: { groceryStoreId: STORE, productSubtype: SUB_RICE } }, list(contract.groceryItem)],
  ["custom type p1", { method: "GET", path: `${P}/items-by-customType`, query: { groceryStoreId: STORE, customType: popularItem, page: "1" } }],
  ["custom type p2", { method: "GET", path: `${P}/items-by-customType`, query: { groceryStoreId: STORE, customType: specialOffer, page: "2" } }],
  ["item details by product", { method: "GET", path: `${P}/item-details`, query: { groceryStoreId: STORE, productInfoTable: "6650d0010000000000000001" } }, contract.ok(contract.groceryItem)],
  ["item details missing", { method: "GET", path: `${P}/item-details`, query: { groceryStoreId: STORE, productInfoTable: "nope" } }],
  ["unknown store items", { method: "GET", path: `${P}/items-by-subtype`, query: { groceryStoreId: "x", productSubtype: SUB_RICE } }],
];

describe("grocery API matches demo mode", () => {
  it.each(cases)("%s", async (_name, req, schema) => {
    const [got, want] = await Promise.all([api(req), demo(req)]);
    expect(got).toEqual(want);
    if (schema) schema.parse(got);
  });

  // Store paging: the store with all 40 products has 2 pages of 24.
  it("pages items 24 at a time", async () => {
    const page = (n: number) =>
      api({ method: "GET", path: `${P}/items-by-customType`, query: { groceryStoreId: STORE, customType: popularItem, page: String(n) } });
    const all = await api({ method: "GET", path: `${P}/explore-store`, query: { storeId: STORE } });
    expect(all.result.popularItem.length).toBeLessThanOrEqual(24);
    const [p1, p2] = await Promise.all([page(1), page(2)]);
    expect(new Set([...p1.result, ...p2.result].map((i: any) => i._id)).size).toBe(p1.result.length + p2.result.length);
  });

  it.each([
    ["Dhaka, with position", { districtId: DHAKA, shop_latitude: 23.7925, shop_longitude: 90.4078 }],
    ["Chittagong, with position", { districtId: CTG, shop_latitude: 22.3264, shop_longitude: 91.8123 }],
    ["Dhaka, no position", { districtId: DHAKA }],
    ["other district", { districtId: "64f0000000000000000000ff", shop_latitude: 24, shop_longitude: 90 }],
  ])("nearest stores: %s", async (_name, body) => {
    const req: Req = { method: "POST", path: `${P}/get-nearest-store`, body };
    const [got, want] = await Promise.all([api(req), demo(req)]);
    list(contract.groceryNearbyStore).parse(got);
    // PostGIS measures on the WGS84 spheroid, demo mode on a sphere: same
    // order, distances within 0.5%.
    expect(got.result.map((s: any) => s._id)).toEqual(want.result.map((s: any) => s._id));
    got.result.forEach((s: any, i: number) => {
      const { distance, ...rest } = s;
      const { distance: wantDistance, ...wantRest } = want.result[i];
      expect(rest).toEqual(wantRest);
      expect(Math.abs(distance - wantDistance)).toBeLessThanOrEqual(Math.max(2, wantDistance * 0.005));
    });
  });
});
