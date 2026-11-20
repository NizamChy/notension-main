// Staff sign-in (setup link + password) and the admin/merchant panel API.
import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDb, type DbHandle } from "../src/db/client";
import { storeItems, user, userRole } from "../src/db/schema";
import { seedDemo } from "../src/seed/demo";
import { bootstrapSuperAdmins } from "../src/seed/bootstrap-admins";
import { client, testApp } from "./helpers";

const STORE = "6650a00100000000000000a1";
const OTHER_STORE = "6650a00100000000000000a2";
const SUPER = "01811111111";
const PW = "correct horse battery";

let handle: DbHandle;
let app: ReturnType<typeof testApp>;

beforeAll(async () => {
  handle = await createDb({});
  await handle.migrate();
  await seedDemo(handle.db);
  app = testApp(handle.db);
});
afterAll(() => handle?.close());

const tokenOf = (link: string) => new URL(link).searchParams.get("token")!;

async function setUp(link: string, password = PW) {
  const c = client(app);
  const res = await c.request("POST", "/api/v1/admin/setup", { token: tokenOf(link), password });
  return { c, res };
}

async function login(phone: string, password = PW) {
  const c = client(app);
  const res = await c.request("POST", "/api/v1/admin/login", { phone, password });
  return { c, res };
}

async function customerOrder() {
  const c = client(app);
  const sent = await c.request("POST", "/api/v1/customer/send-otp", { contact_no: "01899999999" });
  await c.request("POST", "/api/v1/customer/verify-otp", { contact_no: "01899999999", otp: sent.body.demo_otp });
  const [item] = await handle.db.select().from(storeItems).where(eq(storeItems.storeId, STORE)).limit(1);
  const res = await c.request("POST", "/client-app-api/v1/grocery/order", {
    orderObj: JSON.stringify({
      merchant_id: STORE,
      orderItems: [{ _id: item!.id, quantity: 1, sale_price: 1 }],
      paymet_method: "Cash on Delivery",
      customerInfo: { customer_name: "Karim", customer_address: "Road 2, Dhanmondi", latitude: 23.74, longitude: 90.37 },
      subTotal: 1,
      totalAmount: 1,
    }),
  });
  return res;
}

describe("super admin bootstrap", () => {
  it("creates the account, grants super_admin and prints a setup link once", async () => {
    const lines: string[] = [];
    const links = await bootstrapSuperAdmins(handle.db, `+880${SUPER.slice(1)}, 01700000000, junk`, "http://web.test", (l) =>
      lines.push(l),
    );
    expect(Object.keys(links)).toEqual([SUPER]); // demo phone and junk ignored
    expect(links[SUPER]).toMatch(/^http:\/\/web\.test\/admin\/setup\?token=[0-9a-f]{24}\.[\w-]+$/);
    expect(lines.join("\n")).toContain(links[SUPER]);

    // A second run replaces the link (the old one stops working).
    const again = await bootstrapSuperAdmins(handle.db, SUPER, "http://web.test", () => {});
    expect((await setUp(links[SUPER]!)).res.status).toBe(400);

    const { c, res } = await setUp(again[SUPER]!, "short");
    expect(res.status).toBe(400);
    const ok = await setUp(again[SUPER]!);
    expect(ok.res.status).toBe(200);
    expect(ok.res.body.result.roles.map((r: { role: string }) => r.role)).toEqual(["super_admin"]);
    expect((await ok.c.request("GET", "/api/v1/admin/me")).status).toBe(200);
    // Used once only.
    expect((await setUp(again[SUPER]!)).res.status).toBe(400);
    void c;

    // With a password set, later deploys print nothing.
    expect(await bootstrapSuperAdmins(handle.db, SUPER, "http://web.test", () => {})).toEqual({});
  });

  it("staff can't get an OTP sign-in", async () => {
    const res = await client(app).request("POST", "/api/v1/customer/send-otp", { contact_no: SUPER });
    expect(res.status).toBe(403);
  });
});

describe("staff login", () => {
  it("accepts the right password only", async () => {
    expect((await login(SUPER, "wrong password")).res.status).toBe(401);
    expect((await login("01800000001")).res.status).toBe(401);
    const { c, res } = await login(SUPER);
    expect(res.status).toBe(200);
    await c.request("POST", "/api/v1/admin/logout");
    expect((await c.request("GET", "/api/v1/admin/me")).status).toBe(401);
  });

  it("customers are not staff", async () => {
    const c = client(app);
    const sent = await c.request("POST", "/api/v1/customer/send-otp", { contact_no: "01822222222" });
    await c.request("POST", "/api/v1/customer/verify-otp", { contact_no: "01822222222", otp: sent.body.demo_otp });
    expect((await c.request("GET", "/api/v1/admin/me")).status).toBe(403);
    expect((await c.request("GET", "/api/v1/admin/orders")).status).toBe(403);
  });

  it("changes the password", async () => {
    const { c } = await login(SUPER);
    expect((await c.request("POST", "/api/v1/admin/password", { current: "nope", next: "another long one" })).status).toBe(400);
    expect((await c.request("POST", "/api/v1/admin/password", { current: PW, next: "another long one" })).status).toBe(200);
    expect((await c.request("GET", "/api/v1/admin/me")).status).toBe(200); // re-signed in
    expect((await login(SUPER)).res.status).toBe(401);
    await c.request("POST", "/api/v1/admin/password", { current: "another long one", next: PW });
  });
});

describe("roles and merchant scope", () => {
  let ownerLink = "";

  it("super admin adds a store owner and gets a setup link", async () => {
    const { c } = await login(SUPER);
    const bad = await c.request("POST", "/api/v1/admin/roles", { phone: "01833333333", role: "merchant_owner" });
    expect(bad.status).toBe(400); // store needed
    const res = await c.request("POST", "/api/v1/admin/roles", {
      phone: "01833333333",
      name: "Owner One",
      role: "merchant_owner",
      storeId: STORE,
    });
    expect(res.status).toBe(200);
    ownerLink = res.body.result.setupLink;
    expect(ownerLink).toContain("/admin/setup?token=");
    expect((await setUp(ownerLink)).res.status).toBe(200);
  });

  it("merchant sees only their store's orders and can move them forward", async () => {
    const placed = await customerOrder();
    expect(placed.status).toBe(200);

    const { c } = await login("01833333333");
    const list = await c.request("GET", "/api/v1/admin/orders");
    expect(list.status).toBe(200);
    expect(list.body.result.length).toBeGreaterThan(0);
    expect(list.body.result.every((o: { storeId: string }) => o.storeId === STORE)).toBe(true);

    const stores = await c.request("GET", "/api/v1/admin/stores");
    expect(stores.body.result.map((s: { id: string }) => s.id)).toEqual([STORE]);
    expect((await c.request("GET", `/api/v1/admin/stores/${OTHER_STORE}`)).status).toBe(403);
    expect((await c.request("GET", `/api/v1/admin/stores/${OTHER_STORE}/items`)).status).toBe(403);

    const id = list.body.result[0].id;
    const detail = await c.request("GET", `/api/v1/admin/orders/${id}`);
    expect(detail.body.result.items.length).toBeGreaterThan(0);
    expect(detail.body.result.nextStatuses).toEqual(["Accepted", "Cancelled"]);
    expect((await c.request("PATCH", `/api/v1/admin/orders/${id}/status`, { status: "Delivered" })).status).toBe(409);
    expect((await c.request("PATCH", `/api/v1/admin/orders/${id}/status`, { status: "Accepted" })).status).toBe(200);
  });

  it("merchant edits own store and items, not admin-only fields", async () => {
    const { c } = await login("01833333333");
    expect((await c.request("PATCH", `/api/v1/admin/stores/${STORE}`, { isClosed: true })).status).toBe(200);
    expect((await c.request("PATCH", `/api/v1/admin/stores/${STORE}`, { isBanned: false })).status).toBe(400);
    expect((await c.request("PATCH", `/api/v1/admin/stores/${OTHER_STORE}`, { isClosed: true })).status).toBe(403);

    const items = await c.request("GET", `/api/v1/admin/stores/${STORE}/items`);
    const item = items.body.result[0];
    expect((await c.request("PATCH", `/api/v1/admin/items/${item.id}`, { salePrice: 99, stockQty: 5 })).status).toBe(200);
    const [row] = await handle.db.select().from(storeItems).where(eq(storeItems.id, item.id));
    expect(row).toMatchObject({ salePrice: 99, stockQty: 5 });
    await c.request("PATCH", `/api/v1/admin/stores/${STORE}`, { isClosed: false });
  });

  it("owner adds staff to their store only; staff can only change stock", async () => {
    const { c } = await login("01833333333");
    expect(
      (await c.request("POST", "/api/v1/admin/roles", { phone: "01844444444", role: "merchant_staff", storeId: OTHER_STORE })).status,
    ).toBe(403);
    expect((await c.request("POST", "/api/v1/admin/roles", { phone: "01844444444", role: "admin" })).status).toBe(403);
    const res = await c.request("POST", "/api/v1/admin/roles", { phone: "01844444444", role: "merchant_staff", storeId: STORE });
    expect(res.status).toBe(200);
    await setUp(res.body.result.setupLink);

    const staff = (await login("01844444444")).c;
    const [item] = await handle.db.select().from(storeItems).where(eq(storeItems.storeId, STORE)).limit(1);
    expect((await staff.request("PATCH", `/api/v1/admin/items/${item!.id}`, { isAvailable: false })).status).toBe(200);
    expect((await staff.request("PATCH", `/api/v1/admin/items/${item!.id}`, { salePrice: 1 })).status).toBe(400);
    expect((await staff.request("PATCH", `/api/v1/admin/stores/${STORE}`, { isClosed: true })).status).toBe(403);
    expect((await staff.request("GET", "/api/v1/admin/users")).status).toBe(403);
  });

  it("admins can't grant platform roles; the last super admin stays", async () => {
    const su = (await login(SUPER)).c;
    const res = await su.request("POST", "/api/v1/admin/roles", { phone: "01855555555", role: "admin" });
    await setUp(res.body.result.setupLink);
    const admin = (await login("01855555555")).c;
    expect((await admin.request("POST", "/api/v1/admin/roles", { phone: "01866666666", role: "admin" })).status).toBe(403);
    expect((await admin.request("GET", "/api/v1/admin/users?q=0183")).body.result.length).toBeGreaterThan(0);

    const [superRole] = await handle.db
      .select({ id: userRole.id })
      .from(userRole)
      .innerJoin(user, eq(user.id, userRole.userId))
      .where(and(eq(user.phoneNumber, SUPER), eq(userRole.role, "super_admin")));
    expect((await admin.request("DELETE", `/api/v1/admin/roles/${superRole!.id}`)).status).toBe(403);
    const stats = await su.request("GET", "/api/v1/admin/stats");
    expect(stats.body.result.users).toBeGreaterThan(0);
  });
});
