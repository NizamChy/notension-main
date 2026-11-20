// The medicine API must answer exactly like the web app's demo mode. Each case
// sends the same request to both and compares the bodies; API responses are
// also checked against the shared contract.
import { medicine as contract } from "@notension/shared";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { DEMO_ROUTES } from "@/demo/routes";
import { createDb, type DbHandle } from "../src/db/client";
import { hasMedicineData, seedMedicine } from "../src/seed/medicine";
import { testApp } from "./helpers";

const DHAKA = "64f032f6c6635d0242c01e03";
const CTG = "64f03388fdd8ffc6aa95bdb9";
const STORE = "66a100000000000000000001"; // stocks every product
const STORE_CODE = "MS100102";
const SMALL_STORE = "66a100000000000000000005";
const SUB_PAIN = "66a300000000000000000001";
const PRODUCT_NAPA = "66a400000000000000000001";
const { specialOffer, popularItem, dealOfTheDay } = contract.MEDICINE_CUSTOM_TYPE_IDS;

let handle: DbHandle;
let app: ReturnType<typeof testApp>;

beforeAll(async () => {
  handle = await createDb({});
  await handle.migrate();
  expect(await hasMedicineData(handle.db)).toBe(false);
  await seedMedicine(handle.db);
  app = testApp(handle.db);
});
afterAll(() => handle?.close());

type Req = { method: "GET" | "POST"; path: string; query?: Record<string, string>; body?: unknown };

const demoRoutes = (DEMO_ROUTES as any[]).filter((r) => r.service === "MEDICINE");

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

const P = "/client-app-api/v1/medicine";
const list = <T extends z.ZodType>(s: T) => contract.ok(z.array(s));
const items = list(contract.medicineItem);

const cases: [string, Req, z.ZodType?][] = [
  ["explore by id", { method: "GET", path: `${P}/explore-store`, query: { storeId: STORE } }, contract.ok(contract.medicineExplore)],
  ["explore by code", { method: "GET", path: `${P}/explore-store`, query: { custom_store_id: STORE_CODE } }, contract.ok(contract.medicineExplore)],
  ["explore closed small store", { method: "GET", path: `${P}/explore-store`, query: { storeId: SMALL_STORE } }],
  ["explore missing", { method: "GET", path: `${P}/explore-store`, query: { storeId: "000000000000000000000000" } }, contract.ok(contract.medicineExplore)],
  ["find store by name", { method: "GET", path: `${P}/find-store`, query: { search: "pharma" } }, list(contract.medicineStore)],
  ["find store by area", { method: "GET", path: `${P}/find-store`, query: { search: "agrabad" } }],
  ["find store by district", { method: "GET", path: `${P}/find-store`, query: { search: "Dhaka" } }],
  ["find store one letter", { method: "GET", path: `${P}/find-store`, query: { search: "g" } }],
  ["find store empty", { method: "GET", path: `${P}/find-store`, query: { search: " " } }],
  ["find store bangla district", { method: "GET", path: `${P}/find-store`, query: { search: "ঢাকা" } }],
  ["search items by title", { method: "GET", path: `${P}/search-items`, query: { merchantId: STORE, search: "napa" } }, items],
  ["search items by generic", { method: "GET", path: `${P}/search-items`, query: { merchantId: STORE, search: "paracetamol" } }],
  ["search items by company", { method: "GET", path: `${P}/search-items`, query: { merchantId: STORE, search: "square", page: "2" } }],
  ["search items bangla", { method: "GET", path: `${P}/search-items`, query: { merchantId: STORE, search: "নাপা" } }],
  ["search items by code", { method: "GET", path: `${P}/search-items`, query: { custom_store_id: STORE_CODE, search: "a" } }],
  ["search items no text", { method: "GET", path: `${P}/search-items`, query: { merchantId: STORE } }],
  ["items by subtype", { method: "GET", path: `${P}/items-by-subtype`, query: { merchantId: STORE, productSubtype: SUB_PAIN } }, items],
  ["items by subtype, no subtype", { method: "GET", path: `${P}/items-by-subtype`, query: { merchantId: STORE } }],
  ["custom type", { method: "GET", path: `${P}/items-by-customType`, query: { merchantId: STORE, customType: popularItem, page: "1" } }, items],
  ["custom type by code", { method: "GET", path: `${P}/items-by-customType`, query: { custom_store_id: STORE_CODE, customType: specialOffer } }],
  ["custom type deal", { method: "GET", path: `${P}/items-by-customType`, query: { merchantId: SMALL_STORE, customType: dealOfTheDay } }],
  ["custom type page 2", { method: "GET", path: `${P}/items-by-customType`, query: { merchantId: STORE, customType: popularItem, page: "2" } }],
  ["custom type bad page", { method: "GET", path: `${P}/items-by-customType`, query: { merchantId: STORE, customType: popularItem, page: "x" } }],
  ["item details by product", { method: "GET", path: `${P}/item-details`, query: { merchantId: STORE, medStoreProductInfo: PRODUCT_NAPA } }, contract.ok(contract.medicineItem)],
  ["item details by item id", { method: "GET", path: `${P}/item-details`, query: { merchantId: STORE, medStoreProductInfo: "66a501000000000000000005" } }],
  ["item details not stocked", { method: "GET", path: `${P}/item-details`, query: { custom_store_id: STORE_CODE, medStoreProductInfo: "66a400000000000000000004" } }],
  ["item details missing", { method: "GET", path: `${P}/item-details`, query: { merchantId: STORE, medStoreProductInfo: "nope" } }],
  ["unknown store items", { method: "GET", path: `${P}/items-by-subtype`, query: { merchantId: "x", productSubtype: SUB_PAIN } }],
];

describe("medicine API matches demo mode", () => {
  it.each(cases)("%s", async (_name, req, schema) => {
    const [got, want] = await Promise.all([api(req), demo(req)]);
    expect(got).toEqual(want);
    if (schema) schema.parse(got);
  });

  it("pages items 24 at a time", async () => {
    const page = (n: number) =>
      api({ method: "GET", path: `${P}/search-items`, query: { merchantId: STORE, search: "a", page: String(n) } });
    const [p1, p2, p3] = await Promise.all([page(1), page(2), page(3)]);
    expect(p1.result).toHaveLength(24);
    const ids = [...p1.result, ...p2.result, ...p3.result].map((i: any) => i._id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  const nearestCases: [string, Record<string, unknown>][] = [
    ["Dhaka, with position", { districtId: DHAKA, shop_latitude: 23.7925, shop_longitude: 90.4078, max_distance: 5 }],
    ["Chittagong, with position", { districtId: CTG, shop_latitude: 22.3264, shop_longitude: 91.8123 }],
    ["Dhaka, latitude/longitude names", { districtId: DHAKA, latitude: "23.78", longitude: "90.40" }],
    ["Dhaka, no position", { districtId: DHAKA }],
    ["other district", { districtId: "64f0000000000000000000ff", shop_latitude: 24, shop_longitude: 90 }],
    ["no district", {}],
  ];
  for (const path of [`${P}/get-nearest-store`, "/api/v1/medicine/public/nearest-store"]) {
    it.each(nearestCases)(`nearest stores (${path}): %s`, async (_name, body) => {
      const req: Req = { method: "POST", path, body };
      const [got, want] = await Promise.all([api(req), demo(req)]);
      list(contract.medicineNearbyStore).parse(got);
      expect(got.message).toBe(want.message);
      // PostGIS measures on the WGS84 spheroid, demo mode on a sphere.
      expect(got.result.map((s: any) => s._id)).toEqual(want.result.map((s: any) => s._id));
      got.result.forEach((s: any, i: number) => {
        const { distance, ...rest } = s;
        const { distance: wantDistance, ...wantRest } = want.result[i];
        expect(rest).toEqual(wantRest);
        if (wantDistance === undefined) expect(distance).toBeUndefined();
        else expect(Math.abs(distance - wantDistance)).toBeLessThanOrEqual(Math.max(2, wantDistance * 0.005));
      });
    });
  }

  it("reads the position from the query too", async () => {
    const req: Req = { method: "POST", path: `${P}/get-nearest-store`, query: { districtId: CTG, shop_latitude: "22.33", shop_longitude: "91.81" } };
    const [got, want] = await Promise.all([api(req), demo(req)]);
    expect(got.result.map((s: any) => s._id)).toEqual(want.result.map((s: any) => s._id));
    expect(got.result[0].distance).toBeTypeOf("number");
  });

  it("reports the data as seeded", async () => {
    expect(await hasMedicineData(handle.db)).toBe(true);
  });
});
