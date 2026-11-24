// Real admin API answers checked against the shared contract
// (packages/shared/src/contract/admin.ts) that the web panel validates with.
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { z } from "zod";
import { admin as contract, DEMO_PASSWORD } from "@notension/shared";
import { createDb, type DbHandle } from "../src/db/client";
import { APPOINTMENT_STATUSES, MODULES, ORDER_STATUSES, ROLES, STORE_ROLES, storeItems } from "../src/db/schema";
import { seedAll } from "../src/seed/all";
import { client, testApp } from "./helpers";

const A = "/api/v1/admin";
const STORE = "6650a00100000000000000a1";
const PHONES = { super: "01700000001", owner: "01700000006", staff: "01700000011", rider: "01700000012", doctor: "01700000013", provider: "01700000014" };

type Client = ReturnType<typeof client>;
let handle: DbHandle;
let app: ReturnType<typeof testApp>;
const as = {} as Record<keyof typeof PHONES, Client>;
let orderId: string;

beforeAll(async () => {
  handle = await createDb({});
  await handle.migrate();
  await seedAll(handle.db, { superAdminPhones: [], webUrl: "http://localhost:3000", log: () => {} });
  app = testApp(handle.db);
  for (const [key, phone] of Object.entries(PHONES) as [keyof typeof PHONES, string][]) {
    const c = client(app);
    const res = await c.request("POST", `${A}/login`, { phone, password: DEMO_PASSWORD });
    expect(res.status, key).toBe(200);
    expect(contract.envelope(contract.me).safeParse(res.body).success).toBe(true);
    as[key] = c;
  }
  // One order at the demo grocery store, assigned to the demo rider.
  const cust = client(app);
  const sent = await cust.request("POST", "/api/v1/customer/send-otp", { contact_no: "01899999999" });
  await cust.request("POST", "/api/v1/customer/verify-otp", { contact_no: "01899999999", otp: sent.body.demo_otp });
  const [item] = await handle.db.select().from(storeItems).where(eq(storeItems.storeId, STORE)).limit(1);
  const order = await cust.request("POST", "/client-app-api/v1/grocery/order", {
    orderObj: JSON.stringify({
      merchant_id: STORE,
      orderItems: [{ _id: item!.id, quantity: 1, sale_price: 1 }],
      paymet_method: "Cash on Delivery",
      customerInfo: { customer_name: "Karim", customer_address: "Road 2, Dhanmondi", latitude: 23.74, longitude: 90.37 },
      subTotal: 1,
      totalAmount: 1,
    }),
  });
  expect(order.status).toBe(200);
  const list = await as.super.request("GET", `${A}/orders`);
  orderId = list.body.result[0].id;
  const riders = await as.super.request("GET", `${A}/riders`);
  const riderId = riders.body.result.find((r: { phone: string }) => r.phone === PHONES.rider).id;
  expect((await as.super.request("PATCH", `${A}/orders/${orderId}/rider`, { riderId })).status).toBe(200);
});
afterAll(() => handle?.close());

async function check(c: Client, path: string, schema: z.ZodType) {
  const res = await c.request("GET", `${A}${path}`);
  expect(res.status, path).toBe(200);
  const parsed = contract.envelope(schema).safeParse(res.body);
  expect(parsed.success ? [] : parsed.error.issues, path).toEqual([]);
  return res.body;
}

describe("admin contract", () => {
  it("keeps the enums in step with the database", () => {
    expect([...contract.MODULES]).toEqual([...MODULES]);
    expect([...contract.ORDER_STATUSES]).toEqual([...ORDER_STATUSES]);
    expect([...contract.ROLES]).toEqual([...ROLES]);
    expect([...contract.STORE_ROLES]).toEqual([...STORE_ROLES]);
    expect([...contract.APPOINTMENT_STATUSES]).toEqual([...APPOINTMENT_STATUSES]);
  });

  it("matches the super admin's views", async () => {
    await check(as.super, "/me", contract.me);
    await check(as.super, "/stats", contract.stats);
    await check(as.super, "/districts", contract.district.array());
    const stores = await check(as.super, "/stores", contract.store.array());
    expect(stores.result.length).toBeGreaterThan(0);
    await check(as.super, `/stores/${STORE}`, contract.storeDetail);
    const items = await check(as.super, `/stores/${STORE}/items`, contract.storeItem.array());
    expect(items.result.length).toBeGreaterThan(0);
    for (const m of contract.MODULES) {
      const products = await check(as.super, `/products?module=${m}`, contract.product.array());
      expect(products.result.length).toBeGreaterThan(0);
      await check(as.super, `/product-types?module=${m}`, contract.productType.array());
    }
    await check(as.super, "/orders", contract.orderSummary.array());
    const detail = await check(as.super, `/orders/${orderId}`, contract.orderDetail);
    expect(detail.result.rider).not.toBeNull();
    await check(as.super, "/users", contract.adminUser.array());
    await check(as.super, "/riders", contract.rider.array());
    const docs = await check(as.super, "/doctors", contract.linkedDoctor.array());
    expect(docs.result.length).toBeGreaterThan(0);
    await check(as.super, "/care-providers", contract.linkedProvider.array());
  });

  it("matches the merchant, rider, doctor and provider panels", async () => {
    await check(as.owner, "/stats", contract.stats);
    await check(as.owner, "/stores", contract.store.array());
    await check(as.staff, `/stores/${STORE}/items`, contract.storeItem.array());
    const rides = await check(as.rider, "/rider/orders?view=active", contract.riderOrder.array());
    expect(rides.result.length).toBe(1);
    await check(as.rider, "/rider/orders?view=done", contract.riderOrder.array());
    const doc = await check(as.doctor, "/doctor/profile", contract.doctorProfile);
    expect(doc.result.chambers.length).toBeGreaterThan(0);
    await check(as.doctor, "/doctor/appointments", contract.appointment.array());
    const listings = await check(as.provider, "/provider/listings", contract.providerListing.array());
    expect(listings.result.length).toBeGreaterThan(0);
  });

  it("matches the write answers", async () => {
    const created = await as.super.request("POST", `${A}/stores`, {
      module: "grocery",
      name: "Contract Store",
      address: "Road 1",
      districtId: (await as.super.request("GET", `${A}/districts`)).body.result[0].id,
      latitude: 23.7,
      longitude: 90.4,
      ownerPhone: "01822222222",
    });
    expect(contract.envelope(contract.createdStore).parse(created.body).result.setupLink).toBeTruthy();
    const role = await as.super.request("POST", `${A}/roles`, { phone: "01833333333", role: "rider" });
    contract.envelope(contract.setupLinkResult).parse(role.body);
    const saved = await as.owner.request("PATCH", `${A}/stores/${STORE}`, { opensAt: "9:00", minOrder: "50" });
    expect(saved.status).toBe(200);
    contract.messageResponse.parse(saved.body);
    // The shared schema's message reaches the client unchanged.
    const bad = await as.owner.request("PATCH", `${A}/stores/${STORE}`, { opensAt: "25:00" });
    expect(bad.body.message).toBe("Use a time like 09:00 AM or 21:30");
  });
});
