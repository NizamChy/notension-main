// All Care: the API must answer like the web app's demo mode (see
// grocery.parity.test.ts). Every API response is also checked against the
// shared contract.
import { allCare as contract } from "@notension/shared";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DEMO_ROUTES } from "@/demo/routes";
import { careProviders } from "../src/db/schema";
import { createDb, type DbHandle } from "../src/db/client";
import { hasAllCareData, seedAllCare } from "../src/seed/allcare";
import { testApp } from "./helpers";

const DHAKA = "64f032f6c6635d0242c01e03";
const CTG = "64f03388fdd8ffc6aa95bdb9";
const ELECTRICIAN = "6a2c10000000000000000005";
const PLUMBER = "6a2c10000000000000000006";
const COACHING = "6a2c10000000000000000013";

let handle: DbHandle;
let app: ReturnType<typeof testApp>;

beforeAll(async () => {
  handle = await createDb({});
  await handle.migrate();
  expect(await hasAllCareData(handle.db)).toBe(false);
  await seedAllCare(handle.db);
  app = testApp(handle.db);
});
afterAll(() => handle?.close());

type Req = { method: "GET" | "POST"; path: string; query?: Record<string, string>; body?: unknown };

const demoRoutes = (DEMO_ROUTES as any[]).filter((r) => r.service === "ALL_CARE");

// Demo handlers answer errors with demoResponse(status, body): { [symbol]: status, body }.
const demo = (req: Req) => {
  const route = demoRoutes.find((r) => r.method === req.method && r.path === req.path);
  if (!route) throw new Error(`no demo route ${req.method} ${req.path}`);
  const out = route.handler({ query: req.query ?? {}, body: req.body, params: {} });
  const isDemoResponse = Object.getOwnPropertySymbols(out ?? {}).length > 0;
  return JSON.parse(JSON.stringify(isDemoResponse ? out.body : out));
};

const api = async (req: Req, status = 200) => {
  const url = `${req.path}?${new URLSearchParams(req.query ?? {})}`;
  const res = await app.request(url, {
    method: req.method,
    headers: req.body ? { "content-type": "application/json" } : {},
    body: req.body ? JSON.stringify(req.body) : undefined,
  });
  expect(res.status).toBe(status);
  return res.json();
};

const P = "/client-app-api/v1/all-care";

describe("all care API matches demo mode", () => {
  it("seeds once", async () => {
    expect(await hasAllCareData(handle.db)).toBe(true);
  });

  it.each([
    ["Dhaka", DHAKA],
    ["Chittagong", CTG],
    ["unknown district", "64f0000000000000000000ff"],
  ])("services: %s", async (_name, districtId) => {
    const req: Req = { method: "GET", path: `${P}/explore-all-service`, query: { district_id: districtId } };
    const [got, want] = await Promise.all([api(req), demo(req)]);
    expect(got).toEqual(want);
    contract.exploreServicesResult.parse(got);
  });

  it("services without a district", async () => {
    const req: Req = { method: "GET", path: `${P}/explore-all-service` };
    expect(await api(req)).toEqual(demo(req));
  });

  // Without a position there is no distance: bodies must be identical.
  it.each([
    ["Dhaka electrician", { district_id: DHAKA, service_id: ELECTRICIAN, page: 1 }],
    ["Dhaka coaching, page as string", { district_id: DHAKA, service_id: COACHING, page: "1" }],
    ["Chittagong plumber, empty position", { district_id: CTG, service_id: PLUMBER, latitude: "", longitude: "" }],
    ["page 2 is empty", { district_id: DHAKA, service_id: ELECTRICIAN, page: 2 }],
    ["wrong district", { district_id: CTG, service_id: "6a2c10000000000000000017" }],
  ])("providers: %s", async (_name, body) => {
    const req: Req = { method: "POST", path: `${P}/explore-care-provider`, body };
    const [got, want] = await Promise.all([api(req), demo(req)]);
    expect(got).toEqual(want);
    contract.exploreProvidersResult.parse(got);
  });

  // With a position, PostGIS measures on its sphere (mean radius 6371008.8 m)
  // and demo mode on 6371000 m: same lists, distances within a metre or two.
  it.each([
    ["Gulshan, electrician", { district_id: DHAKA, service_id: ELECTRICIAN, latitude: 23.7925, longitude: 90.4078 }],
    ["Dhanmondi, coaching", { district_id: DHAKA, service_id: COACHING, latitude: "23.7461", longitude: "90.3742" }],
    ["Agrabad, plumber", { district_id: CTG, service_id: PLUMBER, latitude: 22.3264, longitude: 91.8123 }],
    ["far away, nothing near", { district_id: DHAKA, service_id: ELECTRICIAN, latitude: 24.9, longitude: 91.9 }],
  ])("providers by distance: %s", async (_name, body) => {
    const req: Req = { method: "POST", path: `${P}/explore-care-provider`, body };
    const [got, want] = await Promise.all([api(req), demo(req)]);
    contract.exploreProvidersResult.parse(got);
    const strip = (list: any[]) => list.map(({ distance: _d, ...rest }) => rest);
    for (const key of ["careProviderByDistrict", "nearestCareProvider"] as const) {
      expect(strip(got.result[key])).toEqual(strip(want.result[key]));
      got.result[key].forEach((p: any, i: number) => {
        expect(Math.abs(p.distance - want.result[key][i].distance)).toBeLessThanOrEqual(2);
      });
    }
    expect(got.result.totalCareProvider).toBe(want.result.totalCareProvider);
    expect(got.message).toBe(want.message);
  });

  it("requires service_id", async () => {
    const req: Req = { method: "POST", path: `${P}/explore-care-provider`, body: { district_id: DHAKA } };
    expect(await api(req, 400)).toEqual(demo(req));
  });

  it("hides inactive providers", async () => {
    const { eq } = await import("drizzle-orm");
    await handle.db.update(careProviders).set({ status: "inactive" }).where(eq(careProviders.id, "6a2c40000000000000000001"));
    const res = await api({
      method: "POST",
      path: `${P}/explore-care-provider`,
      body: { district_id: DHAKA, service_id: ELECTRICIAN },
    });
    expect(res.result.careProviderByDistrict.map((p: any) => p._id)).not.toContain("6a2c40000000000000000001");
    await handle.db.update(careProviders).set({ status: "active" }).where(eq(careProviders.id, "6a2c40000000000000000001"));
  });
});
