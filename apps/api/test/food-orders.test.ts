// Food orders end to end through the HTTP app on an in-memory database:
// session required, server-side pricing (variations and add-ons included),
// bad input.
import { food as contract } from "@notension/shared";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDb, type DbHandle } from "../src/db/client";
import { foodItemOptions } from "../src/db/schema";
import { seedFood } from "../src/seed/food";
import { client, testApp } from "./helpers";

const P = "/client-app-api/v1/food";
const KACCHI = "66f00d200000000000000001"; // 10% off from 500 (max 100); delivery 30 from 800, else 60
const PIZZA = "66f00d200000000000000003"; // FS-1003
const SEABREEZE = "66f00d200000000000000007"; // closed
const ITEM_KACCHI = "66f00d400000000000000001"; // 380
const ITEM_BORHANI = "66f00d400000000000000006"; // 80
const ITEM_MARGHERITA = "66f00d400000000000000012"; // Napoli Slice, 590
const VAR_SMALL = "66f00d700000000000000001";
const VAR_LARGE = "66f00d700000000000000002";
const ADD_CHEESE = "66f00d710000000000000001";
const ADD_OLIVES = "66f00d710000000000000002";

let handle: DbHandle;
let app: ReturnType<typeof testApp>;

beforeAll(async () => {
  handle = await createDb({});
  await handle.migrate();
  await seedFood(handle.db);
  app = testApp(handle.db);
  // A pizza with sizes and toppings.
  await handle.db.insert(foodItemOptions).values([
    { id: VAR_SMALL, storeItemId: ITEM_MARGHERITA, kind: "variation", name: '8"', price: 450, position: 0 },
    { id: VAR_LARGE, storeItemId: ITEM_MARGHERITA, kind: "variation", name: '12"', price: 790, position: 1 },
    { id: ADD_CHEESE, storeItemId: ITEM_MARGHERITA, kind: "addon", name: "Extra cheese", price: 60, position: 0 },
    { id: ADD_OLIVES, storeItemId: ITEM_MARGHERITA, kind: "addon", name: "Olives", price: 40.5, position: 1 },
  ]);
});
afterAll(() => handle?.close());

async function signIn(phone: string) {
  const c = client(app);
  const sent = await c.request("POST", "/api/v1/customer/send-otp", { contact_no: phone });
  expect(sent.status).toBe(200);
  const verified = await c.request("POST", "/api/v1/customer/verify-otp", { contact_no: phone, otp: sent.body.demo_otp });
  expect(verified.status).toBe(200);
  return c;
}

type Line = { _id: string; quantity: number; variation_id?: string; addon_ids?: string[] };

// What the checkout posts (CheckoutSection.jsx); browser amounts are ignored.
const orderObj = (merchant: string, lines: Line[], extra: object = {}) => ({
  customer_id: "someone-else",
  customerInfo: { customer_name: "Rahim", customer_address: "Road 11, Banani", latitude: 23.79, longitude: 90.4 },
  merchant_id: merchant,
  merchantInfo: { shop_name: "Fake" },
  orderItems: lines.map((l) => ({ ...l, sale_price: 1, product_title_eng: "x" })),
  subTotal: 1,
  less_amount: 0,
  vatAmount: 0,
  deliveryCharge: 0,
  totalAmount: 1,
  paymet_method: "bKash",
  shortNote: "Extra spicy",
  ...extra,
});

describe("food orders", () => {
  it("need a session", async () => {
    const anon = client(app);
    expect((await anon.request("POST", `${P}/order`, orderObj(KACCHI, [{ _id: ITEM_KACCHI, quantity: 1 }]))).status).toBe(401);
    expect((await anon.request("GET", `${P}/order-info?customerId=x`)).status).toBe(401);
  });

  it("prices the order on the server and lists it", async () => {
    const c = await signIn("01790000001");
    const res = await c.request(
      "POST",
      `${P}/order`,
      orderObj(KACCHI, [
        { _id: ITEM_KACCHI, quantity: 2 },
        { _id: ITEM_BORHANI, quantity: 2 },
      ]),
    );
    expect(res.status).toBe(200);
    const body = contract.placeOrderResult.parse(res.body);
    const order = body.result;
    // 2 x 380 + 2 x 80 = 920: 10% off capped at 100 -> 92; delivery 30 (>= 800).
    expect(order.subTotal).toBe(920);
    expect(order.less_amount).toBe(92);
    expect(order.deliveryCharge).toBe(30);
    expect(order.vatAmount).toBe(0);
    expect(order.totalAmount).toBe(858);
    expect(body.order_id).toBe(order.order_id);
    expect(order.order_id).toMatch(/^FOOD-\d{8}-\d{4,}$/);
    expect(order.order_status).toBe("Pending");
    expect(order.paymet_method).toBe("bKash");
    expect(order.shortNote).toBe("Extra spicy");
    expect(order.merchantInfo.shop_name).toBe("Kacchi Ghor");
    expect(order.customer_id).not.toBe("someone-else");
    expect(order.customerInfo.contact_no).toBe("01790000001");
    expect(order.orderItems.map((l) => [l._id, l.quantity, l.sale_price, l.productCategory])).toEqual([
      [ITEM_KACCHI, 2, 380, "66f00d300000000000000001"],
      [ITEM_BORHANI, 2, 80, "66f00d30000000000000000e"],
    ]);

    const list = await c.request("GET", `${P}/order-info?customerId=someone-else`);
    expect(list.status).toBe(200);
    const orders = contract.ok(contract.order.array()).parse(list.body).result;
    expect(orders).toEqual([order]);

    // Another customer sees none of it.
    const other = await signIn("01790000002");
    expect((await other.request("GET", `${P}/order-info`)).body.result).toEqual([]);
  });

  it("small orders pay the higher delivery charge and get no discount", async () => {
    const c = await signIn("01790000001");
    const res = await c.request("POST", `${P}/order`, orderObj(KACCHI, [{ _id: ITEM_BORHANI, quantity: 1 }]));
    expect(res.status).toBe(200);
    expect(res.body.result).toMatchObject({ subTotal: 80, less_amount: 0, deliveryCharge: 60, totalAmount: 140 });
  });

  it("shows variations and add-ons on the menu", async () => {
    const res = await client(app).request("GET", `${P}/explore-store?storeId=${PIZZA}`);
    const pizza = contract.ok(contract.exploreStore).parse(res.body).result.allProduct.find((i) => i._id === ITEM_MARGHERITA)!;
    expect(pizza.variations).toEqual([
      { _id: VAR_SMALL, name: '8"', price: 450 },
      { _id: VAR_LARGE, name: '12"', price: 790 },
    ]);
    expect(pizza.addons?.map((a) => a._id)).toEqual([ADD_CHEESE, ADD_OLIVES]);
    const plain = res.body.result.allProduct.find((i: { _id: string }) => i._id !== ITEM_MARGHERITA);
    expect(plain).not.toHaveProperty("variations");
  });

  it("prices variations and add-ons, merging identical lines", async () => {
    const c = await signIn("01790000003");
    const res = await c.request(
      "POST",
      `${P}/order`,
      orderObj(PIZZA, [
        { _id: ITEM_MARGHERITA, quantity: 1, variation_id: VAR_LARGE, addon_ids: [ADD_OLIVES, ADD_CHEESE] },
        { _id: ITEM_MARGHERITA, quantity: 1, variation_id: VAR_LARGE, addon_ids: [ADD_CHEESE, ADD_OLIVES, ADD_CHEESE] },
        { _id: ITEM_MARGHERITA, quantity: 1, variation_id: VAR_SMALL },
      ]),
    );
    expect(res.status).toBe(200);
    const order = contract.order.parse(res.body.result);
    expect(order.orderItems).toHaveLength(2);
    const [large, small] = order.orderItems;
    // 790 + 60 + 40.5
    expect(large).toMatchObject({ quantity: 2, sale_price: 890.5, variation: { _id: VAR_LARGE, name: '12"', price: 790 } });
    expect(large!.addons?.map((a) => a._id).sort()).toEqual([ADD_CHEESE, ADD_OLIVES].sort());
    expect(small).toMatchObject({ quantity: 1, sale_price: 450, variation: { _id: VAR_SMALL } });
    expect(small).not.toHaveProperty("addons");
    // 2 x 890.5 + 450 = 2231; flat 100 off from 1200; delivery 40 (>= 1000).
    expect(order.subTotal).toBe(2231);
    expect(order.less_amount).toBe(100);
    expect(order.deliveryCharge).toBe(40);
    expect(order.totalAmount).toBe(2171);

    const list = await c.request("GET", `${P}/order-info`);
    expect(list.body.result[0].orderItems).toEqual(order.orderItems);
  });

  it("rejects bad input", async () => {
    const c = await signIn("01790000004");
    const post = (body: unknown) => c.request("POST", `${P}/order`, body);
    const pizza = (line: Omit<Line, "_id" | "quantity">, quantity = 1) =>
      post(orderObj(PIZZA, [{ _id: ITEM_MARGHERITA, quantity, ...line }]));

    const empty = await post(orderObj(KACCHI, []));
    expect([empty.status, empty.body.message]).toEqual([400, "Cart is empty"]);
    expect((await post({ orderItems: [{ _id: ITEM_KACCHI, quantity: 1 }] })).status).toBe(400);
    expect((await post(orderObj(KACCHI, [{ _id: ITEM_KACCHI, quantity: 0 }]))).status).toBe(400);
    expect((await post(orderObj(KACCHI, [{ _id: ITEM_KACCHI, quantity: 1.5 }]))).status).toBe(400);
    expect((await post("not json")).status).toBe(400);

    expect((await post(orderObj("000000000000000000000000", [{ _id: ITEM_KACCHI, quantity: 1 }]))).status).toBe(404);
    expect((await post(orderObj(SEABREEZE, [{ _id: "66f00d40000000000000002c", quantity: 1 }]))).status).toBe(409);
    // A dish from another store.
    expect((await post(orderObj(KACCHI, [{ _id: ITEM_MARGHERITA, quantity: 1, variation_id: VAR_SMALL }]))).status).toBe(409);
    expect((await post(orderObj(KACCHI, [{ _id: "nope", quantity: 1 }]))).status).toBe(409);
    // max_allowed is 10, counted across sizes.
    expect((await post(orderObj(KACCHI, [{ _id: ITEM_KACCHI, quantity: 11 }]))).status).toBe(409);
    const split = await post(
      orderObj(PIZZA, [
        { _id: ITEM_MARGHERITA, quantity: 6, variation_id: VAR_SMALL },
        { _id: ITEM_MARGHERITA, quantity: 5, variation_id: VAR_LARGE },
      ]),
    );
    expect(split.status).toBe(409);

    const noSize = await pizza({});
    expect([noSize.status, noSize.body.message]).toEqual([409, "Please choose an option for Margherita Pizza"]);
    expect((await pizza({ variation_id: ADD_CHEESE })).status).toBe(409); // an add-on is not a size
    expect((await pizza({ variation_id: VAR_SMALL, addon_ids: [VAR_LARGE] })).status).toBe(409);
    expect((await post(orderObj(KACCHI, [{ _id: ITEM_KACCHI, quantity: 1, variation_id: VAR_SMALL }]))).status).toBe(409);

    // No address anywhere: the profile has none either.
    const noAddress = await post(orderObj(KACCHI, [{ _id: ITEM_KACCHI, quantity: 1 }], { customerInfo: {} }));
    expect([noAddress.status, noAddress.body.message]).toEqual([400, "Please add your delivery address"]);

    expect((await c.request("GET", `${P}/order-info`)).body.result).toEqual([]);
  });
});
