// Fashion orders through the HTTP app on an in-memory database: session
// required, server-side prices, variant (size / colour) checks.
import { fashion as contract } from "@notension/shared";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fashionProducts } from "@/demo/modules/fashion/data";
import { createDb, type DbHandle } from "../src/db/client";
import { seedFashion } from "../src/seed/fashion";
import { client, testApp } from "./helpers";

const P = "/api/v1/customer-order";
const byTitle = (title: string): any => fashionProducts.find((p: any) => p.product_title_eng === title);

// Sizes 38-46, colours White / Navy / Maroon with photos.
const PANJABI = byTitle("Embroidered Cotton Panjabi");
// One size, one colour (Grey), another shop.
const JHUMKA = byTitle("Oxidised Jhumka & Necklace Set");

let handle: DbHandle;
let app: ReturnType<typeof testApp>;

beforeAll(async () => {
  handle = await createDb({});
  await handle.migrate();
  await seedFashion(handle.db); // fashion on its own, without grocery data
  app = testApp(handle.db);
});
afterAll(() => handle?.close());

async function signIn(phone: string) {
  const c = client(app);
  const sent = await c.request("POST", "/api/v1/customer/send-otp", { contact_no: phone });
  const verified = await c.request("POST", "/api/v1/customer/verify-otp", { contact_no: phone, otp: sent.body.demo_otp });
  expect(verified.status).toBe(200);
  return { c, me: verified.body.result };
}

// The checkout's body, with the amounts it computes in the browser.
const orderBody = (store: any, items: any[], extra: Record<string, unknown> = {}) => ({
  customer_id: "someone-else",
  custom_customer_id: "CUS9999999",
  customerInfo: {
    customer_name: "Rahim",
    customer_address: "Road 11, Banani",
    contact_no: "01700000000",
    alternative_contact_no: "01700000000",
  },
  merchant_id: store._id,
  custom_merchant_id: store.custom_merchant_id,
  merchantInfo: { shop_name: "x", shop_address: "x", contact_no: "x", alternative_contact_no: "x" },
  orderItems: items.map((i) => ({
    _id: i.product._id,
    type_info: i.product.type_info._id,
    brand_info: i.product.brand_info,
    product_title_eng: i.product.product_title_eng,
    product_size: i.size ?? null,
    product_color: i.color ?? "",
    purchase_price: 1,
    max_retail_price: 1,
    sale_price: 1, // tampered: ignored
    unit_symbol: "pcs",
    max_allowed: 99,
    quantity: i.quantity,
    delivered_qty: 0,
    inc_qty: 1,
    ordered_img: i.image ?? i.product.web_image,
  })),
  subTotal: 1,
  less_amount: 0,
  vatAmount: 0,
  deliveryCharge: 0,
  totalAmount: 1,
  shortNote: "",
  paymet_method: "Cash on Delivery",
  ...extra,
});

describe("fashion orders", () => {
  it("need a session", async () => {
    const c = client(app);
    const placed = await c.request("POST", `${P}/create`, orderBody(PANJABI.store_info, [{ product: PANJABI, size: "40", quantity: 1 }]));
    expect(placed.status).toBe(401);
    const mine = await c.request("POST", `${P}/order-by-customer`, { customer_id: "x", custom_customer_id: "y" });
    expect(mine.status).toBe(401);
  });

  it("prices the order on the server and keeps each line's variant", async () => {
    const { c, me } = await signIn("01755555555");
    const maroonPhoto = PANJABI.images_by_color[2];
    const res = await c.request(
      "POST",
      `${P}/create`,
      orderBody(PANJABI.store_info, [
        { product: PANJABI, size: "40", color: "Navy", quantity: 1, image: PANJABI.images_by_color[1] },
        { product: PANJABI, size: "40", color: "navy", quantity: 1 }, // same variant: merged
        { product: PANJABI, size: "42", quantity: 1, image: maroonPhoto }, // colour from its photo
      ]),
    );
    expect(res.status).toBe(200);
    const { result, data } = contract.placeOrderResult.parse(res.body);
    expect(data).toEqual(result);
    expect(result.customer_id).toBe(me._id);
    expect(result.custom_customer_id).toBe(me.custom_id);
    expect(result.order_id).toMatch(/^FSN-\d{8}-\d+$/);
    expect(result.order_status).toBe("Pending");
    expect(result.merchant_id).toBe(PANJABI.store_info._id);
    expect(result.merchantInfo.shop_name).toBe(PANJABI.store_info.shop_name);
    expect(result.customerInfo.customer_address).toBe("Road 11, Banani");
    expect(result.subTotal).toBe(PANJABI.sale_price * 3);
    expect(result.deliveryCharge).toBe(0);
    expect(result.less_amount).toBe(0);
    expect(result.totalAmount).toBe(PANJABI.sale_price * 3);
    expect(result.orderItems.map((l) => [l.product_size, l.product_color, l.quantity, l.ordered_img])).toEqual([
      ["40", "Navy", 2, PANJABI.images_by_color[1]],
      ["42", "Maroon", 1, maroonPhoto],
    ]);
    const line = result.orderItems[0]!;
    expect(line._id).toBe(PANJABI._id);
    expect(line.sale_price).toBe(PANJABI.sale_price);
    expect(line.max_retail_price).toBe(PANJABI.max_retail_price);
    expect(line.brand_info).toEqual(PANJABI.brand_info);
    expect(line.type_info).toBe(PANJABI.type_info._id);
    expect(line.web_image).toBe(PANJABI.web_image);

    // My orders: this one; the ids in the body don't matter.
    const mine = await c.request("POST", `${P}/order-by-customer`, { customer_id: "x", custom_customer_id: "y" });
    expect(mine.status).toBe(200);
    expect(contract.ordersResult.parse(mine.body).result).toEqual([result]);

    // Nobody else sees it.
    const other = await signIn("01766666666");
    const theirs = await other.c.request("POST", `${P}/order-by-customer`, {});
    expect(theirs.body.result).toEqual([]);
  });

  it("fills in the only colour of a one-colour, one-size product", async () => {
    const { c } = await signIn("01755555555");
    const res = await c.request("POST", `${P}/create`, orderBody(JHUMKA.store_info, [{ product: JHUMKA, quantity: 2 }]));
    expect(res.status).toBe(200);
    const [line] = res.body.result.orderItems;
    expect(line.product_size).toBe(null);
    expect(line.product_color).toBe("Grey");
    expect(res.body.result.totalAmount).toBe(JHUMKA.sale_price * 2);
  });

  it.each([
    ["an empty cart", () => orderBody(PANJABI.store_info, []), 400, "Cart is empty"],
    ["a zero quantity", () => orderBody(PANJABI.store_info, [{ product: PANJABI, size: "40", quantity: 0 }]), 400, "Invalid order"],
    ["no store", () => ({ ...orderBody(PANJABI.store_info, [{ product: PANJABI, size: "40", quantity: 1 }]), merchant_id: undefined }), 400, "Invalid order"],
    ["a missing size", () => orderBody(PANJABI.store_info, [{ product: PANJABI, quantity: 1 }]), 400, /choose a size/],
    ["an unknown size", () => orderBody(PANJABI.store_info, [{ product: PANJABI, size: "XS", quantity: 1 }]), 400, /Size XS is not available/],
    ["an unknown colour", () => orderBody(PANJABI.store_info, [{ product: PANJABI, size: "40", color: "Green", quantity: 1 }]), 400, /Green is not available/],
    ["another shop's product", () => orderBody(JHUMKA.store_info, [{ product: PANJABI, size: "40", quantity: 1 }]), 409, /not available any more/],
    ["an unknown shop", () => orderBody({ _id: "000000000000000000000000" }, [{ product: PANJABI, size: "40", quantity: 1 }]), 404, "Store not found"],
    [
      "more than the per-order limit across sizes",
      () =>
        orderBody(PANJABI.store_info, [
          { product: PANJABI, size: "40", quantity: PANJABI.max_allowed },
          { product: PANJABI, size: "42", quantity: 1 },
        ]),
      409,
      /at most/,
    ],
    [
      "no delivery address",
      () => orderBody(PANJABI.store_info, [{ product: PANJABI, size: "40", quantity: 1 }], { customerInfo: { customer_address: "  " } }),
      400,
      /delivery address/,
    ],
  ] as const)("rejects %s", async (_name, body, status, message) => {
    const { c } = await signIn("01777777777");
    const res = await c.request("POST", `${P}/create`, body());
    expect(res.status).toBe(status);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(message);
    const mine = await c.request("POST", `${P}/order-by-customer`, {});
    expect(mine.body.result).toEqual([]);
  });

  it("rejects a body that isn't JSON", async () => {
    const { c } = await signIn("01777777777");
    const res = await c.request("POST", `${P}/create`, undefined, { headers: { "Content-Type": "text/plain" } });
    expect(res.status).toBe(400);
  });
});
