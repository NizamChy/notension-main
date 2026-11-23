// Fashion reads must answer exactly like the web app's demo mode: each case
// sends the same request to both and compares status and body; API responses
// are also checked against the shared contract.
import { fashion as contract } from "@notension/shared";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { DEMO_ROUTES } from "@/demo/routes";
import { fashionProducts, fashionStores, fashionTypes } from "@/demo/modules/fashion/data";
import { createApp } from "../src/app";
import { createDb, type DbHandle } from "../src/db/client";
import { seedDemo } from "../src/seed/demo";
import { hasFashionData, seedFashion } from "../src/seed/fashion";
import { testApp } from "./helpers";

const MEN = "6880c239098c458993b32675";
const KIDS = "6880c24c098c458993b32679";
const BEAUTY = "6880c255098c458993b3267b";
const STORE = fashionStores[0]!._id; // Dhaka Fashion House
const KIDS_STORE = fashionStores[2]!._id;
const MISSING = "000000000000000000000000";

let handle: DbHandle;
let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  handle = await createDb({}); // in-memory PGlite + PostGIS
  await handle.migrate();
  await seedDemo(handle.db);
  expect(await hasFashionData(handle.db)).toBe(false);
  await seedFashion(handle.db);
  app = testApp(handle.db);
});
afterAll(() => handle?.close());

type Req = { method: "GET" | "PUT"; path: string; body?: unknown };

const demoRoutes = (DEMO_ROUTES as any[]).filter((r) => r.service === "FASHION");

const match = (pattern: string, path: string) => {
  const a = pattern.split("/");
  const b = path.split("/");
  if (a.length !== b.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < a.length; i += 1) {
    if (a[i]!.startsWith(":")) params[a[i]!.slice(1)] = decodeURIComponent(b[i]!);
    else if (a[i] !== b[i]) return null;
  }
  return params;
};

// { status, body } as demo mode would answer (demoResponse carries a status).
const demo = (req: Req) => {
  for (const route of demoRoutes) {
    const params = route.method === req.method && match(route.path, req.path);
    if (!params) continue;
    const out = route.handler({ query: {}, body: req.body, params });
    const symbol = Object.getOwnPropertySymbols(out)[0];
    return symbol
      ? { status: out[symbol] as number, body: JSON.parse(JSON.stringify(out.body)) }
      : { status: 200, body: JSON.parse(JSON.stringify(out)) };
  }
  throw new Error(`no demo route ${req.method} ${req.path}`);
};

const api = async (req: Req) => {
  const res = await app.request(req.path, {
    method: req.method,
    headers: req.body !== undefined ? { "content-type": "application/json" } : {},
    body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
  });
  return { status: res.status, body: await res.json() };
};

const P = "/api/v1";
const byType = (typeId: string, body?: unknown): Req => ({
  method: "PUT",
  path: `${P}/kids-product/product-info-by-type/${typeId}`,
  body,
});
const list = <T extends z.ZodType>(s: T) => contract.ok(z.array(s));
const products = list(contract.fashionProduct);

const sampleKids = fashionProducts.find((p: any) => p.type_info._id === KIDS && p.is_popular)!;

const cases: [string, Req, z.ZodType?][] = [
  ["all types", { method: "GET", path: `${P}/type/all-type` }, list(contract.fashionType)],
  ["all brands", { method: "GET", path: `${P}/brand/all-brand` }, list(contract.fashionBrand)],
  ["all categories", { method: "GET", path: `${P}/category/all-category` }, list(contract.fashionCategory)],
  ["all subcategories", { method: "GET", path: `${P}/sub-category/all-subcategory` }, list(contract.fashionSubCategory)],
  ["men products", { method: "GET", path: `${P}/men-product/product-info` }, products],
  ["women products", { method: "GET", path: `${P}/women-product/product-info` }, products],
  ["kids products", { method: "GET", path: `${P}/kids-product/product-info` }, products],
  ["by type, no body", byType(MEN), products],
  ["by type, empty body", byType(BEAUTY, {})],
  ["by type + category", byType(KIDS, { category_info: sampleKids.category_info._id }), products],
  [
    "by type + subcategory",
    byType(KIDS, { category_info: sampleKids.category_info._id, sub_category_info: sampleKids.sub_category_info._id }),
  ],
  ["by type, null filters", byType(KIDS, { category_info: null, sub_category_info: null })],
  ["popular (boolean)", byType(MEN, { is_popular: true })],
  ["popular (string)", byType(KIDS, { is_popular: "true" })],
  ["popular false", byType(MEN, { is_popular: false })],
  ["search title", byType(MEN, { search_text: "panjabi" })],
  ["search caps + spaces", byType(MEN, { search_text: "  SHIRT " })],
  ["search brand", byType(BEAUTY, { search_text: "glow" })],
  ["search blank", byType(MEN, { search_text: "   " })],
  ["search nothing", byType(MEN, { search_text: "zzzz" })],
  ["store", byType(MEN, { store_id: STORE })],
  ["store + popular", byType(KIDS, { store_id: KIDS_STORE, is_popular: true })],
  ["store as number", byType(MEN, { store_id: 1 })],
  ["unknown type", byType(MISSING, {})],
  ["single store", { method: "GET", path: `${P}/store-info/single-store/${STORE}` }, contract.ok(contract.fashionStore)],
  ["single store with popup", { method: "GET", path: `${P}/store-info/single-store/${fashionStores[1]!._id}` }],
  ["single store missing", { method: "GET", path: `${P}/store-info/single-store/${MISSING}` }],
  ["unknown store types", { method: "GET", path: `${P}/type/all-type-by-store/${MISSING}` }],
  ["unknown store categories", { method: "GET", path: `${P}/category/all-category-by-store/${MISSING}` }],
  ["unknown store subcategories", { method: "GET", path: `${P}/sub-category/all-subcat-by-store/${MISSING}` }],
];

// Every type, and the taxonomy of every store.
for (const t of fashionTypes as any[]) cases.push([`all of type ${t.type_name}`, byType(t._id), products]);
for (const s of fashionStores as any[]) {
  cases.push(
    [`types of ${s.shop_name}`, { method: "GET", path: `${P}/type/all-type-by-store/${s._id}` }, list(contract.storeType)],
    [
      `categories of ${s.shop_name}`,
      { method: "GET", path: `${P}/category/all-category-by-store/${s._id}` },
      list(contract.storeCategory),
    ],
    [
      `subcategories of ${s.shop_name}`,
      { method: "GET", path: `${P}/sub-category/all-subcat-by-store/${s._id}` },
      list(contract.storeSubCategory),
    ],
  );
}

describe("fashion API matches demo mode", () => {
  it.each(cases)("%s", async (_name, req, schema) => {
    const [got, want] = await Promise.all([api(req), demo(req)]);
    expect(got).toEqual(want);
    if (schema) schema.parse(got.body);
  });

  it("returns every demo product, with its variants", async () => {
    const all = await Promise.all((fashionTypes as any[]).map((t) => api(byType(t._id))));
    const got = all.flatMap((r) => r.body.data);
    expect(got).toHaveLength(fashionProducts.length);
    const withPhotos = got.find((p: any) => p.images_by_color.length > 1);
    expect(withPhotos.images_by_color).toHaveLength(withPhotos.colors.split(",").length);
  });
});
