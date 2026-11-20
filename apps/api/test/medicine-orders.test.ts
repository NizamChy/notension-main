// Medicine orders through the HTTP app on an in-memory database: session
// required, server-side prices, the legacy response shape.
import { medicine as contract, orderTotals } from "@notension/shared";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDb, type DbHandle } from "../src/db/client";
import { storeItems, stores } from "../src/db/schema";
import { seedDemo } from "../src/seed/demo";
import { seedMedicine } from "../src/seed/medicine";
import { client, testApp } from "./helpers";

const STORE = "66a100000000000000000001";
const CLOSED_STORE = "66a100000000000000000005";
const PHONE = "01712121212";
const ORDER = "/client-app-api/v1/medicine/order";
const ORDER_INFO = "/client-app-api/v1/medicine/order-info";

let handle: DbHandle;
let app: ReturnType<typeof testApp>;
let items: (typeof storeItems.$inferSelect)[];

beforeAll(async () => {
  handle = await createDb({});
  await handle.migrate();
  await seedDemo(handle.db); // grocery too, as in production
  await seedMedicine(handle.db);
  app = testApp(handle.db);
  items = await handle.db.select().from(storeItems).where(eq(storeItems.storeId, STORE)).orderBy(storeItems.position).limit(4);
});
afterAll(() => handle?.close());

async function signIn(phone = PHONE) {
  const c = client(app);
  const sent = await c.request("POST", "/api/v1/customer/send-otp", { contact_no: phone });
  const verified = await c.request("POST", "/api/v1/customer/verify-otp", { contact_no: phone, otp: sent.body.demo_otp });
  expect(verified.status).toBe(200);
  return c;
}

const orderObj = (lines: { _id: string; quantity: number }[], extra: object = {}) => ({
  customer_id: "someone-else", // ignored: the session decides
  merchant_id: STORE,
  orderItems: lines.map((l) => ({ ...l, sale_price: 1 })), // browser prices are ignored
  order_list_image: [],
  paymet_method: "Cash on Delivery",
  shortNote: "Ring the bell",
  customerInfo: { customer_name: "Karim", customer_address: "House 12, Gulshan-1", latitude: 23.79, longitude: 90.41 },
  subTotal: 1,
  totalAmount: 1,
  ...extra,
});

const asForm = (obj: object) => {
  const form = new FormData();
  form.append("orderObj", JSON.stringify(obj));
  return form;
};

describe("medicine orders", () => {
  it("need a session", async () => {
    const anon = client(app);
    expect((await anon.request("POST", ORDER, asForm(orderObj([{ _id: items[0]!.id, quantity: 1 }])))).status).toBe(401);
    expect((await anon.request("GET", `${ORDER_INFO}?customerId=x`)).status).toBe(401);
  });

  it("prices the order on the server and lists it for the signed-in user only", async () => {
    const c = await signIn();
    const [a, b] = items;
    const res = await c.request("POST", ORDER, asForm(orderObj([{ _id: a!.id, quantity: 2 }, { _id: b!.id, quantity: 1 }])));
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Order placed successfully");
    const order = contract.order.parse(res.body.result);

    const subtotal = a!.salePrice * 2 + b!.salePrice;
    const [store] = await handle.db.select().from(stores).where(eq(stores.id, STORE));
    const totals = orderTotals(
      {
        min_purchage_amount: store!.minOrder,
        min_delivery_charge: store!.minDeliveryCharge,
        max_delivery_charge: store!.maxDeliveryCharge,
        less: store!.discount,
        less_type: "Percent",
        maximum_less: store!.maxDiscount,
        minimum_order_for_less: store!.minOrderForDiscount,
      },
      subtotal,
    );
    expect(order.subTotal).toBeCloseTo(subtotal, 2);
    expect(order.deliveryCharge).toBe(totals.shippingCharge);
    expect(order.less_amount).toBe(totals.discount);
    expect(order.totalAmount).toBeCloseTo(totals.grandTotal, 2);
    expect(order.order_id).toMatch(/^MED-\d{8}-\d{4,}$/);
    expect(order.order_status).toBe("Pending");
    expect(order.custom_merchant_id).toBe("MS100101");
    expect(order.merchantInfo.shop_name).toBe("Gulshan Care Pharmacy");
    expect(order.customerInfo.contact_no).toBe(PHONE);
    expect(order.orderItems.map((l) => [l._id, l.medStoreProductInfo, l.quantity])).toEqual([
      [a!.id, a!.productId, 2],
      [b!.id, b!.productId, 1],
    ]);
    expect(order.orderItems[0]!.item_title_eng).toBe("Napa 500mg");

    const mine = await c.request("GET", `${ORDER_INFO}?customerId=someone-else`);
    expect(mine.status).toBe(200);
    expect(mine.body.message).toBe("OK");
    expect(mine.body.result.map((o: { _id: string }) => o._id)).toEqual([order._id]);
    contract.order.array().parse(mine.body.result);
    expect((await c.request("GET", "/client-app-api/v1/grocery/order-info")).body.result).toEqual([]);

    const other = await signIn("01734343434");
    expect((await other.request("GET", ORDER_INFO)).body.result).toEqual([]);
  });

  it("accepts plain JSON and adds up repeated items", async () => {
    const c = await signIn();
    const res = await c.request(
      "POST",
      ORDER,
      orderObj([
        { _id: items[0]!.id, quantity: 1 },
        { _id: items[0]!.id, quantity: 2 },
      ]),
    );
    expect(res.status).toBe(200);
    expect(res.body.result.orderItems).toHaveLength(1);
    expect(res.body.result.orderItems[0].quantity).toBe(3);
  });

  it("rejects bad input", async () => {
    const c = await signIn();
    const post = (body: unknown) => c.request("POST", ORDER, body);

    expect((await post({ orderObj: "not json" })).status).toBe(400);
    const empty = await post(asForm(orderObj([])));
    expect(empty.status).toBe(400);
    expect(empty.body.message).toBe("Cart is empty");
    expect((await post(orderObj([{ _id: items[0]!.id, quantity: 0 }]))).status).toBe(400);
    expect((await post(orderObj([{ _id: items[0]!.id, quantity: 1 }], { merchant_id: "" }))).status).toBe(400);
    expect((await post(orderObj([{ _id: items[0]!.id, quantity: 1 }], { merchant_id: "66a1000000000000000000ff" }))).status).toBe(404);
  });

  it("rejects items from another store, unknown, unavailable and over-limit items", async () => {
    const c = await signIn();
    const post = (lines: { _id: string; quantity: number }[], extra: object = {}) =>
      c.request("POST", ORDER, asForm(orderObj(lines, extra)));

    expect((await post([{ _id: "nope", quantity: 1 }])).status).toBe(409);
    // A Banani store item ordered from the Gulshan store.
    expect((await post([{ _id: "66a502000000000000000001", quantity: 1 }])).status).toBe(409);

    await handle.db.update(storeItems).set({ maxPerOrder: 2 }).where(eq(storeItems.id, items[3]!.id));
    expect((await post([{ _id: items[3]!.id, quantity: 3 }])).status).toBe(409);

    await handle.db.update(storeItems).set({ isAvailable: false }).where(eq(storeItems.id, items[3]!.id));
    expect((await post([{ _id: items[3]!.id, quantity: 1 }])).status).toBe(409);
  });

  it("refuses orders to a closed store", async () => {
    const c = await signIn();
    const res = await c.request(
      "POST",
      ORDER,
      asForm(orderObj([{ _id: "66a505000000000000000001", quantity: 1 }], { merchant_id: CLOSED_STORE })),
    );
    expect(res.status).toBe(409);
  });

  it("needs a delivery address", async () => {
    const c = await signIn("01756565656"); // no profile yet
    const res = await c.request(
      "POST",
      ORDER,
      asForm(orderObj([{ _id: items[0]!.id, quantity: 1 }], { customerInfo: {} })),
    );
    expect(res.status).toBe(400);
  });
});
