// Health care reads must answer exactly like the web app's demo mode. Each
// case sends the same request to both and compares the bodies; responses are
// also checked against the shared contract.
import { healthCare as contract } from "@notension/shared";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { DEMO_ROUTES } from "@/demo/routes";
import { createApp } from "../src/app";
import { createDb, type DbHandle } from "../src/db/client";
import { seedDemo } from "../src/seed/demo";
import { hasHealthCareData, seedHealthCare } from "../src/seed/healthCare";
import { testApp } from "./helpers";

const DHAKA = "64f032f6c6635d0242c01e03";
const CTG = "64f03388fdd8ffc6aa95bdb9";
const OTHER = "64f0000000000000000000ff";
const oid = (kind: string, n: number) => `6650${kind}${String(n).padStart(18, "0")}`;
const DEPT = (n: number) => oid("de", n);
const CENTER = (n: number) => oid("ce", n);
const DOCTOR = (n: number) => oid("d0", n);

let handle: DbHandle;
let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  handle = await createDb({});
  await handle.migrate();
  await seedDemo(handle.db);
  expect(await hasHealthCareData(handle.db)).toBe(false);
  await seedHealthCare(handle.db);
  expect(await hasHealthCareData(handle.db)).toBe(true);
  app = testApp(handle.db);
});
afterAll(() => handle?.close());

type Req = { method: "GET" | "POST"; path: string; query?: Record<string, string>; body?: unknown };

// Through the routes index: the module files import each other in a cycle.
const demoRoutes = (DEMO_ROUTES as any[]).filter((r) => r.service === "HEALTH_CARE");

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

const P = "/client-app-api/v1/health-care";
const list = <T extends z.ZodType>(s: T) => contract.ok(z.array(s));
const get = (path: string, query: Record<string, string> = {}): Req => ({ method: "GET", path: `${P}/${path}`, query });
const post = (path: string, body: unknown): Req => ({ method: "POST", path: `${P}/${path}`, body });

const cases: [string, Req, z.ZodType?][] = [
  ["medical services home", get("explore-medical-service-provider"), contract.ok(contract.exploreServiceProvider)],
  ["service providers", get("get-medical-service-provider", { district_id: DHAKA }), list(contract.serviceProvider)],
  ["service providers by type", get("get-medical-service-provider", { district_id: CTG, serviceType: "Ambulance" })],
  ["service providers, other type", get("get-medical-service-provider", { district_id: DHAKA, serviceType: "Nurse" })],
  ["ambulances", get("get-ambulance-service-provider", { district_id: DHAKA }), list(contract.serviceProvider)],
  ["ambulances (districtId)", get("get-ambulance-service-provider", { districtId: CTG })],
  ["ambulances, other district", get("get-ambulance-service-provider", { district_id: OTHER })],

  ["find doctor home, Dhaka", get("explore-find-doctors", { district_id: DHAKA }), contract.ok(contract.exploreFindDoctor)],
  ["find doctor home, Chittagong", get("explore-find-doctors", { district_id: CTG })],
  ["find doctor home, other district", get("explore-find-doctors", { district_id: OTHER }), contract.ok(contract.exploreFindDoctor)],
  ["find doctor home, no district", get("explore-find-doctors")],

  ["doctors by dept", post("get-doctors-by-dept", { districtId: DHAKA, deptId: DEPT(1), page: 1 }), list(contract.chamber)],
  ["doctors by dept, Chittagong", post("get-doctors-by-dept", { districtId: CTG, deptId: DEPT(8), page: 1 })],
  ["doctors by dept, page 2", post("get-doctors-by-dept", { districtId: DHAKA, deptId: DEPT(1), page: 2 })],
  ["doctors by dept, none", post("get-doctors-by-dept", { districtId: DHAKA, deptId: DEPT(13), page: 1 })],
  ["doctors by dept, other district", post("get-doctors-by-dept", { districtId: OTHER, deptId: DEPT(1), page: 1 })],
  ["doctors by center", post("get-doctors-by-center", { centerId: CENTER(1), page: 1 }), list(contract.chamber)],
  ["doctors by center and dept", post("get-doctors-by-center", { centerId: CENTER(3), deptId: DEPT(10), page: 1 })],
  ["doctors by center, page 2", post("get-doctors-by-center", { centerId: CENTER(1), page: 2 })],
  ["doctors by unknown center", post("get-doctors-by-center", { centerId: "nope", page: 1 })],
  ["doctor profile", get("get-doctor-profile", { doctorId: DOCTOR(1) }), list(contract.chamber)],
  ["doctor profile, Chittagong", get("get-doctor-profile", { doctorId: DOCTOR(16) })],
  ["doctor profile, unknown", get("get-doctor-profile", { doctorId: "nope" })],

  ["hospitals by district", post("get-consultation-certer", { districtId: DHAKA, centerType: "Hospital", page: 1 }), contract.ok(contract.centersByDistrict)],
  ["consultation centers by district", post("get-consultation-certer", { districtId: DHAKA, centerType: "Consultation Center", page: 1 })],
  ["diagnostic, Chittagong", post("get-consultation-certer", { districtId: CTG, centerType: "Diagnostic Centre", page: 1 })],
  ["dental by district", post("get-consultation-certer", { districtId: DHAKA, centerType: "Deltal Care Centre", page: 1 })],
  ["centers page 2", post("get-consultation-certer", { districtId: DHAKA, centerType: "Hospital", page: 2 })],
  ["centers, other district", post("get-consultation-certer", { districtId: OTHER, centerType: "Hospital", page: 1 })],
  ["search centers", post("search-consultation-certer", { search: "gulshan" }), list(contract.center)],
  ["search centers by type", post("search-consultation-certer", { centerType: "Hospital", search: "eye" })],
  ["search centers by address", post("search-consultation-certer", { search: "Chattogram" })],
  ["search too short", post("search-consultation-certer", { search: "g" })],
  ["explore center", get("explore-consultation-certer", { CenterID: CENTER(1), centerType: "Hospital" }), contract.ok(contract.exploreCenter)],
  ["explore consultation center", get("explore-consultation-certer", { CenterID: CENTER(8) })],
  ["explore center without doctors", get("explore-consultation-certer", { CenterID: CENTER(7) })],
  ["explore unknown center", get("explore-consultation-certer", { CenterID: "000000000000000000000000" }), contract.ok(contract.exploreCenter)],
];

// PostGIS measures on the WGS84 spheroid, demo mode on a sphere: same order,
// distances within 0.5%.
const sameWithDistances = (got: any, want: any) => {
  expect(got.result.map((s: any) => s._id)).toEqual(want.result.map((s: any) => s._id));
  got.result.forEach((s: any, i: number) => {
    const { distance, ...rest } = s;
    const { distance: wantDistance, ...wantRest } = want.result[i];
    expect(rest).toEqual(wantRest);
    expect(Math.abs(distance - wantDistance)).toBeLessThanOrEqual(Math.max(2, wantDistance * 0.005));
  });
};

describe("health care API matches demo mode", () => {
  it.each(cases)("%s", async (_name, req, schema) => {
    const [got, want] = await Promise.all([api(req), demo(req)]);
    expect(got).toEqual(want);
    if (schema) schema.parse(got);
  });

  it.each([
    ["Dhaka, with position", { districtId: DHAKA, latitude: 23.7925, longitude: 90.4078 }],
    ["Dhaka, string position", { districtId: DHAKA, latitude: "23.87", longitude: "90.39" }],
    ["Chittagong, with position", { districtId: CTG, latitude: 22.3264, longitude: 91.8123 }],
    ["Dhaka, no position", { districtId: DHAKA }],
    ["Dhaka, zero position", { districtId: DHAKA, latitude: 0, longitude: 0 }],
    ["other district", { districtId: OTHER, latitude: 24, longitude: 90 }],
  ])("nearest doctors: %s", async (_name, body) => {
    const req = post("get-nearest-doctors", body);
    const [got, want] = await Promise.all([api(req), demo(req)]);
    list(contract.nearbyChamber).parse(got);
    sameWithDistances(got, want);
  });

  it.each([
    ["Dhaka hospitals", { districtId: DHAKA, centerType: "Hospital", latitude: 23.7925, longitude: 90.4078 }],
    ["Dhaka consultation centers", { districtId: DHAKA, centerType: "Consultation Center", latitude: 23.75, longitude: 90.38 }],
    ["Dhaka, no type, no position", { districtId: DHAKA }],
    ["Chittagong eye care", { districtId: CTG, centerType: "Eye Care Centre", latitude: 22.3264, longitude: 91.8123 }],
    ["other district", { districtId: OTHER, centerType: "Hospital" }],
  ])("nearest centers: %s", async (_name, body) => {
    const req = post("get-nearest-consultation-certer", body);
    const [got, want] = await Promise.all([api(req), demo(req)]);
    list(contract.nearbyCenter).parse(got);
    sameWithDistances(got, want);
  });
});
