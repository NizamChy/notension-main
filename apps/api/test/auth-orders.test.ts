// Phone sign-in, roles and grocery orders, end to end through the HTTP app
// on an in-memory database.
import { customer as customerContract, grocery as contract } from "@notension/shared";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Hono } from "hono";
import { createAuth } from "../src/auth/auth";
import { requireRole, sessionLoader, type AuthEnv } from "../src/auth/middleware";
import { createDb, type DbHandle } from "../src/db/client";
import { storeItems, user, userRole } from "../src/db/schema";
import { seedDemo } from "../src/seed/demo";
import { client, testApp } from "./helpers";

const STORE = "6650a00100000000000000a1";
const PHONE = "01711111111";

let handle: DbHandle;
let app: ReturnType<typeof testApp>;
let items: (typeof storeItems.$inferSelect)[];

beforeAll(async () => {
  handle = await createDb({});
  await handle.migrate();
  await seedDemo(handle.db);
  app = testApp(handle.db);
  items = await handle.db.select().from(storeItems).where(eq(storeItems.storeId, STORE)).limit(3);
});
afterAll(() => handle?.close());

async function signIn(phone = PHONE) {
  const c = client(app);
  const sent = await c.request("POST", "/api/v1/customer/send-otp", { contact_no: phone });
  expect(sent.status).toBe(200);
  const verified = await c.request("POST", "/api/v1/customer/verify-otp", { contact_no: phone, otp: sent.body.demo_otp });
  expect(verified.status).toBe(200);
  return { c, verified };
}

describe("phone sign-in", () => {
  it("rejects invalid numbers", async () => {
    const res = await client(app).request("POST", "/api/v1/customer/send-otp", { contact_no: "12345" });
    expect(res.status).toBe(400);
  });

  it("returns the code when no SMS provider is set", async () => {
    const res = await client(app).request("POST", "/api/v1/customer/send-otp", { contact_no: "+8801722222222" });
    expect(customerContract.sendOtpResult.parse(res.body).otp_delivery).toBe("response");
    expect(res.body.demo_otp).toMatch(/^\d{6}$/);
  });

  it("rejects a wrong code", async () => {
    const c = client(app);
    await c.request("POST", "/api/v1/customer/send-otp", { contact_no: "01733333333" });
    const res = await c.request("POST", "/api/v1/customer/verify-otp", { contact_no: "01733333333", otp: "000000" });
    expect(res.status).toBe(400);
    expect(c.jar.size).toBe(0);
  });

  it("creates the account as a customer and sets a session", async () => {
    const { c, verified } = await signIn();
    const me = customerContract.customer.parse(verified.body.result);
    expect(verified.body.is_new).toBe(true);
    expect(me.contact_no).toBe(PHONE);
    expect(me.custom_id).toMatch(/^CUS\d{7}$/);
    expect(me.roles).toEqual(["customer"]);
    expect(me.email).toBe("");

    const again = await c.request("GET", "/api/v1/customer/me");
    expect(again.body.result._id).toBe(me._id);
  });

  it("saves the profile (with the app's swapped coordinates)", async () => {
    const { c } = await signIn();
    const res = await c.request("POST", "/api/v1/customer/register", {
      customer_name: "Rahim",
      customer_address: "Road 11, Banani",
      longitude: 23.79, // latitude, as the app sends it
      latitude: 90.4,
      district_id: "64f032f6c6635d0242c01e03",
      district_name_by_location: "Dhaka",
    });
    expect(res.status).toBe(200);
    expect(res.body.result).toMatchObject({
      customer_name: "Rahim",
      customer_address: "Road 11, Banani",
      location: { type: "Point", coordinates: [23.79, 90.4] },
    });
    const again = await signIn();
    expect(again.verified.body.is_new).toBe(false);
  });

  it("needs a session for me/register", async () => {
    expect((await client(app).request("GET", "/api/v1/customer/me")).status).toBe(401);
  });

  it("logs out", async () => {
    const { c } = await signIn();
    await c.request("POST", "/api/v1/customer/logout");
    expect((await c.request("GET", "/api/v1/customer/me")).status).toBe(401);
  });

  it("demo login works without a code and names the account", async () => {
    const c = client(app);
    const res = await c.request("POST", "/api/v1/customer/demo-login");
    expect(res.status).toBe(200);
    expect(res.body.result.customer_name).toBe("Demo User");
    expect((await c.request("GET", "/api/v1/customer/me")).body.result.contact_no).toBe("01700000000");
  });

  it("never echoes a code for staff accounts", async () => {
    const { verified } = await signIn("01744444444");
    await handle.db.insert(userRole).values({ userId: verified.body.result._id, role: "admin" });
    const res = await client(app).request("POST", "/api/v1/customer/send-otp", { contact_no: "01744444444" });
    expect(res.status).toBe(403);
    expect(res.body.demo_otp).toBeUndefined();
  });

  it("banned users can't sign in", async () => {
    const { verified } = await signIn("01755555555");
    await handle.db.update(user).set({ banned: true }).where(eq(user.id, verified.body.result._id));
    const c = client(app);
    const sent = await c.request("POST", "/api/v1/customer/send-otp", { contact_no: "01755555555" });
    const res = await c.request("POST", "/api/v1/customer/verify-otp", { contact_no: "01755555555", otp: sent.body.demo_otp });
    expect(res.status).toBe(403);
    expect(c.jar.size).toBe(0);
  });
});

describe("sms delivery", () => {
  it("sends the code by SMS and does not echo it", async () => {
    const sent: string[] = [];
    const sms = async (_phone: string, message: string) => void sent.push(message);
    const c = client(testApp(handle.db, { sms }));
    const res = await c.request("POST", "/api/v1/customer/send-otp", { contact_no: "01766666666" });
    expect(res.body.otp_delivery).toBe("sms");
    expect(res.body.demo_otp).toBeUndefined();
    const code = sent.at(-1)!.match(/\d{6}/)![0];
    const verified = await c.request("POST", "/api/v1/customer/verify-otp", { contact_no: "01766666666", otp: code });
    expect(verified.body.result.roles).toEqual(["customer"]);
  });
});

describe("requireRole", () => {
  const roleApp = () => {
    const auth = createAuth(handle.db, {
      secret: "test-secret-test-secret-test-secret-1234",
      baseURL: "http://localhost:4000",
      trustedOrigins: [],
      sms: null,
    });
    return new Hono<AuthEnv>()
      .use(sessionLoader(auth))
      .get("/admin", requireRole(handle.db, ["admin"]), (c) => c.text("ok"))
      .get("/store/:id", requireRole(handle.db, ["merchant_manager"], { store: (c) => c.req.param("id") }), (c) =>
        c.text("ok"),
      );
  };

  it("checks global and store-scoped roles; super_admin passes all", async () => {
    const { c, verified } = await signIn("01788888888");
    const id = verified.body.result._id;
    const r = roleApp();
    const get = async (path: string) =>
      (await r.request(path, { headers: { Cookie: [...c.jar].map(([k, v]) => `${k}=${v}`).join("; ") } })).status;

    expect((await r.request("/admin")).status).toBe(401);
    expect(await get("/admin")).toBe(403);

    await handle.db.insert(userRole).values({ userId: id, role: "merchant_manager", storeId: STORE });
    expect(await get(`/store/${STORE}`)).toBe(200);
    expect(await get("/store/6650a00100000000000000a2")).toBe(403);

    await handle.db.insert(userRole).values({ userId: id, role: "super_admin" });
    expect(await get("/admin")).toBe(200);
    expect(await get("/store/6650a00100000000000000a2")).toBe(200);
  });

  it("store roles need a store and global roles must not have one", async () => {
    const [u] = await handle.db.select({ id: user.id }).from(user).limit(1);
    await expect(handle.db.insert(userRole).values({ userId: u!.id, role: "merchant_owner" })).rejects.toThrow();
    await expect(handle.db.insert(userRole).values({ userId: u!.id, role: "admin", storeId: STORE })).rejects.toThrow();
  });
});

describe("grocery orders", () => {
  const orderObj = (lines: { _id: string; quantity: number }[], extra: object = {}) => ({
    merchant_id: STORE,
    orderItems: lines.map((l) => ({ ...l, sale_price: 1 })), // browser prices are ignored
    paymet_method: "Cash on Delivery",
    shortNote: "Call first",
    customerInfo: { customer_name: "Rahim", customer_address: "Road 11, Banani", latitude: 23.79, longitude: 90.4 },
    subTotal: 1,
    totalAmount: 1,
    ...extra,
  });

  it("needs a session", async () => {
    const res = await client(app).request("POST", "/client-app-api/v1/grocery/order", { orderObj: "{}" });
    expect(res.status).toBe(401);
  });

  it("prices the order on the server and lists it", async () => {
    const { c } = await signIn("01799999999");
    const [a, b] = items;
    const form = new FormData();
    form.append("orderObj", JSON.stringify(orderObj([{ _id: a!.id, quantity: 2 }, { _id: b!.id, quantity: 1 }])));
    const res = await c.request("POST", "/client-app-api/v1/grocery/order", form);
    expect(res.status).toBe(200);
    const order = contract.order.parse(res.body.result);

    const subtotal = a!.salePrice * 2 + b!.salePrice;
    expect(order.subTotal).toBeCloseTo(subtotal, 2);
    expect(order.totalAmount).toBeCloseTo(subtotal + order.deliveryCharge - order.less_amount, 2);
    expect(order.order_id).toMatch(/^GRO-\d{8}-\d{4,}$/);
    expect(order.order_status).toBe("Pending");
    expect(order.orderItems.map((l) => [l._id, l.quantity])).toEqual([
      [a!.id, 2],
      [b!.id, 1],
    ]);
    expect(order.customerInfo.contact_no).toBe("01799999999");

    const list = await c.request("GET", "/client-app-api/v1/grocery/order-info?customerId=someone-else");
    expect(list.body.result.map((o: { _id: string }) => o._id)).toEqual([order._id]);
  });

  it("accepts plain JSON and adds up repeated items", async () => {
    const { c } = await signIn("01799999999");
    const res = await c.request(
      "POST",
      "/client-app-api/v1/grocery/order",
      orderObj([
        { _id: items[0]!.id, quantity: 1 },
        { _id: items[0]!.id, quantity: 1 },
      ]),
    );
    expect(res.status).toBe(200);
    expect(res.body.result.orderItems).toHaveLength(1);
    expect(res.body.result.orderItems[0].quantity).toBe(2);
  });

  it("rejects unknown, unavailable and over-limit items", async () => {
    const { c } = await signIn("01799999999");
    const post = (lines: { _id: string; quantity: number }[]) =>
      c.request("POST", "/client-app-api/v1/grocery/order", { orderObj: JSON.stringify(orderObj(lines)) });

    expect((await post([])).body.message).toBe("Cart is empty");
    expect((await post([{ _id: "nope", quantity: 1 }])).status).toBe(409);

    await handle.db.update(storeItems).set({ maxPerOrder: 2 }).where(eq(storeItems.id, items[2]!.id));
    expect((await post([{ _id: items[2]!.id, quantity: 3 }])).status).toBe(409);

    await handle.db.update(storeItems).set({ isAvailable: false }).where(eq(storeItems.id, items[2]!.id));
    expect((await post([{ _id: items[2]!.id, quantity: 1 }])).status).toBe(409);
  });
});
