// Grocery orders: place one, list mine. Paths and shapes follow the web app
// (GROCERY_PLACE_ORDER, GROCERY_ORDER_INFO). Prices, discount and delivery
// charge are always computed here from the store's current data; the
// amounts the browser sends are ignored.
import { grocery as contract, orderTotals } from "@notension/shared";
import { and, asc, desc, eq, getTableColumns, inArray, sql } from "drizzle-orm";
import { Hono, type Context } from "hono";
import { requireUser, type AuthEnv } from "../../auth/middleware";
import type { Db } from "../../db/client";
import { customers, orderItems, orders, products, storeItems, stores } from "../../db/schema";
import { loadCustomer } from "../customer/customer";
import { toLegacyStore } from "./grocery";

const P = "/client-app-api/v1/grocery";

const fail = (c: Context, status: 400 | 404 | 409, message: string) =>
  c.json({ success: false as const, message }, status);

// The checkout posts FormData with an `orderObj` JSON string; other clients
// may post JSON, with or without the orderObj wrapper.
async function readOrderBody(c: Context): Promise<unknown> {
  const type = c.req.header("content-type") ?? "";
  let body: unknown;
  if (type.includes("multipart/form-data") || type.includes("application/x-www-form-urlencoded")) {
    body = await c.req.parseBody();
  } else {
    body = await c.req.json().catch(() => null);
  }
  const wrapped = (body as { orderObj?: unknown } | null)?.orderObj;
  if (typeof wrapped === "string") {
    try {
      return JSON.parse(wrapped);
    } catch {
      return null;
    }
  }
  return wrapped ?? body;
}

type OrderRow = typeof orders.$inferSelect;
type LineRow = typeof orderItems.$inferSelect;
type StoreInfo = { id: string; code: string; name: string; address: string; phone: string | null; altPhone: string | null };

export const toLegacyOrder = (
  o: OrderRow,
  lines: LineRow[],
  store: StoreInfo,
  customerCode: string,
): contract.Order => ({
  _id: o.id,
  order_id: o.code,
  order_status: o.status,
  customer_id: o.customerId,
  custom_customer_id: customerCode,
  customerInfo: {
    customer_name: o.delivery.name,
    customer_address: o.delivery.address,
    contact_no: o.delivery.phone,
    alternative_contact_no: o.delivery.altPhone,
    latitude: o.delivery.latitude,
    longitude: o.delivery.longitude,
  },
  merchant_id: store.id,
  custom_merchant_id: store.code,
  merchantInfo: {
    shop_name: store.name,
    shop_address: store.address,
    contact_no: store.phone ?? "",
    alternative_contact_no: store.altPhone ?? "",
  },
  order_list_image: [],
  orderItems: lines.map((l) => ({
    _id: l.storeItemId ?? l.id,
    productInfoTable: l.productId,
    product_title_eng: l.titleEn,
    product_title_beng: l.titleBn,
    pack_size: l.packSize,
    purchase_price: l.purchasePrice,
    max_retail_price: l.mrp,
    sale_price: l.salePrice,
    unit_symbol: l.unit,
    max_allowed: l.maxPerOrder,
    quantity: l.quantity,
    delivered_qty: l.deliveredQty,
    inc_qty: 1,
    app_image: l.image,
  })),
  subTotal: o.subtotal,
  less_amount: o.discount,
  vatAmount: o.vat,
  deliveryCharge: o.deliveryCharge,
  totalAmount: o.total,
  paymet_method: o.paymentMethod,
  shortNote: o.note,
  customer_rating: o.rating,
  customer_review: o.review,
  createdAt: o.createdAt.toISOString(),
  updatedAt: o.updatedAt.toISOString(),
});

const { location: _location, ...storeCols } = getTableColumns(stores);

const storeInfoColumns = {
  id: stores.id,
  code: stores.code,
  name: stores.name,
  address: stores.address,
  phone: stores.phone,
  altPhone: stores.altPhone,
};

// Dhaka date for the order code: GRO-20261120-2001.
const dhakaDate = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date())
    .replaceAll("-", "");

export async function listOrders(db: Db, customerId: string) {
  const rows = await db
    .select({ order: orders, store: storeInfoColumns, customerCode: customers.code })
    .from(orders)
    .innerJoin(stores, eq(stores.id, orders.storeId))
    .leftJoin(customers, eq(customers.userId, orders.customerId))
    .where(and(eq(orders.customerId, customerId), eq(orders.module, "grocery")))
    .orderBy(desc(orders.createdAt), desc(orders.code))
    .limit(100);
  if (!rows.length) return [];
  const lines = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, rows.map((r) => r.order.id)))
    .orderBy(asc(orderItems.position));
  return rows.map((r) =>
    toLegacyOrder(
      r.order,
      lines.filter((l) => l.orderId === r.order.id),
      r.store,
      r.customerCode ?? "",
    ),
  );
}

export const groceryOrderRoutes = (db: Db) =>
  new Hono<AuthEnv>()
    .post(`${P}/order`, requireUser, async (c) => {
      const parsed = contract.placeOrderInput.safeParse(await readOrderBody(c));
      if (!parsed.success) {
        const message = parsed.error.issues.find((i) => i.message === "Cart is empty") ? "Cart is empty" : "Invalid order";
        return fail(c, 400, message);
      }
      const input = parsed.data;
      const me = c.get("user")!;

      // The store, with its pricing rules.
      const [store] = await db
        .select({ ...storeCols, districtName: sql<string | null>`null` })
        .from(stores)
        .where(and(eq(stores.id, input.merchant_id), eq(stores.module, "grocery")));
      if (!store || !store.isActive || store.isBanned) return fail(c, 404, "Store not found");
      if (store.isClosed) return fail(c, 409, "This store is closed right now");

      // Same item twice in the cart counts once with the quantities added.
      const wanted = new Map<string, number>();
      for (const line of input.orderItems) wanted.set(line._id, (wanted.get(line._id) ?? 0) + line.quantity);

      const rows = await db
        .select({ item: storeItems, product: products })
        .from(storeItems)
        .innerJoin(products, eq(products.id, storeItems.productId))
        .where(and(eq(storeItems.storeId, store.id), inArray(storeItems.id, [...wanted.keys()])));
      const byId = new Map(rows.map((r) => [r.item.id, r]));

      const lines: (typeof orderItems.$inferInsert)[] = [];
      for (const [itemId, quantity] of wanted) {
        const row = byId.get(itemId);
        if (!row || !row.item.isAvailable) {
          return fail(c, 409, `${row?.product.titleEn ?? "An item"} is not available any more`);
        }
        if (row.item.maxPerOrder > 0 && quantity > row.item.maxPerOrder) {
          return fail(c, 409, `You can order at most ${row.item.maxPerOrder} of ${row.product.titleEn}`);
        }
        lines.push({
          orderId: "", // set below
          storeItemId: row.item.id,
          productId: row.product.id,
          titleEn: row.product.titleEn,
          titleBn: row.product.titleBn,
          packSize: row.product.packSize,
          unit: row.product.unit,
          image: row.product.image,
          mrp: row.item.mrp,
          salePrice: row.item.salePrice,
          purchasePrice: row.item.purchasePrice,
          maxPerOrder: row.item.maxPerOrder,
          quantity,
          position: lines.length,
        });
      }

      const subtotal = Math.round(lines.reduce((t, l) => t + (l.salePrice ?? 0) * l.quantity, 0) * 100) / 100;
      const totals = orderTotals(toLegacyStore(store), subtotal);

      // Delivery details: the profile, overridden by what the checkout sent.
      const profile = await loadCustomer(db, me.id);
      const info = input.customerInfo ?? {};
      const delivery = {
        name: info.customer_name?.trim() || profile?.customer_name || "",
        address: info.customer_address?.trim() || profile?.customer_address || "",
        phone: profile?.contact_no || "",
        altPhone: info.alternative_contact_no?.trim() || profile?.alternative_contact_no || "",
        latitude: info.latitude ?? profile?.location?.coordinates[0] ?? null,
        longitude: info.longitude ?? profile?.location?.coordinates[1] ?? null,
      };
      if (!delivery.address) return fail(c, 400, "Please add your delivery address");

      const saved = await db.transaction(async (tx) => {
        const [{ seq }] = (await tx.execute<{ seq: string }>(sql`select nextval('order_number_seq')::text as seq`))
          .rows as [{ seq: string }];
        const [o] = await tx
          .insert(orders)
          .values({
            code: `GRO-${dhakaDate()}-${seq}`,
            module: "grocery",
            storeId: store.id,
            customerId: me.id,
            subtotal,
            discount: totals.discount,
            vat: 0,
            deliveryCharge: totals.shippingCharge,
            total: totals.grandTotal,
            paymentMethod: input.paymet_method,
            note: input.shortNote ?? "",
            delivery,
          })
          .returning();
        const savedLines = await tx
          .insert(orderItems)
          .values(lines.map((l) => ({ ...l, orderId: o!.id })))
          .returning();
        return { order: o!, lines: savedLines };
      });

      const result = toLegacyOrder(saved.order, saved.lines, store, profile?.custom_id ?? "");
      return c.json({ success: true as const, message: "Order placed successfully", result });
    })

    // `customerId` in the query is ignored: it's always the signed-in user.
    .get(`${P}/order-info`, requireUser, async (c) => {
      const result = await listOrders(db, c.get("user")!.id);
      return c.json({ success: true as const, result });
    });

