// Medicine orders: place one, list mine (MEDICINE_PLACE_ORDER,
// MEDICINE_ORDER_INFO). Works like grocery orders: a session is required, the
// customer comes from the session, and prices, discount and delivery charge
// are computed here from the store's current data.
import { medicine as contract, orderTotals } from "@notension/shared";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono, type Context } from "hono";
import { requireUser, type AuthEnv } from "../../auth/middleware";
import type { Db } from "../../db/client";
import { customers, orderItems, orders, products, storeItems, stores } from "../../db/schema";
import { loadCustomer } from "../customer/customer";
import { toLegacyOrder } from "../store/grocery-orders";
import { findMedicineStore, toMedicineStore } from "./medicine";

const P = "/client-app-api/v1/medicine";

const fail = (c: Context, status: 400 | 404 | 409, message: string) =>
  c.json({ success: false as const, message }, status);

// The checkout posts FormData with an `orderObj` JSON string; JSON bodies,
// with or without the wrapper, work too.
async function readOrderBody(c: Context): Promise<unknown> {
  const type = c.req.header("content-type") ?? "";
  const body: unknown =
    type.includes("multipart/form-data") || type.includes("application/x-www-form-urlencoded")
      ? await c.req.parseBody()
      : await c.req.json().catch(() => null);
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
type StoreInfo = Parameters<typeof toLegacyOrder>[2];

// The grocery order shape, with medicine's item field names.
const toMedicineOrder = (o: OrderRow, lines: LineRow[], store: StoreInfo, customerCode: string): contract.Order => ({
  ...toLegacyOrder(o, lines, store, customerCode),
  orderItems: lines.map((l) => ({
    _id: l.storeItemId ?? l.id,
    medStoreProductInfo: l.productId,
    item_title_eng: l.titleEn,
    item_title_beng: l.titleBn,
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
});

const storeInfoColumns = {
  id: stores.id,
  code: stores.code,
  name: stores.name,
  address: stores.address,
  phone: stores.phone,
  altPhone: stores.altPhone,
};

// Dhaka date for the order code: MED-20261120-2001.
const dhakaDate = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date())
    .replaceAll("-", "");

async function listMedicineOrders(db: Db, customerId: string) {
  const rows = await db
    .select({ order: orders, store: storeInfoColumns, customerCode: customers.code })
    .from(orders)
    .innerJoin(stores, eq(stores.id, orders.storeId))
    .leftJoin(customers, eq(customers.userId, orders.customerId))
    .where(and(eq(orders.customerId, customerId), eq(orders.module, "medicine")))
    .orderBy(desc(orders.createdAt), desc(orders.code))
    .limit(100);
  if (!rows.length) return [];
  const lines = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, rows.map((r) => r.order.id)))
    .orderBy(asc(orderItems.position));
  return rows.map((r) =>
    toMedicineOrder(
      r.order,
      lines.filter((l) => l.orderId === r.order.id),
      r.store,
      r.customerCode ?? "",
    ),
  );
}

export const medicineOrderRoutes = (db: Db) =>
  new Hono<AuthEnv>()
    .post(`${P}/order`, requireUser, async (c) => {
      const parsed = contract.placeOrderInput.safeParse(await readOrderBody(c));
      if (!parsed.success) {
        const message = parsed.error.issues.find((i) => i.message === "Cart is empty") ? "Cart is empty" : "Invalid order";
        return fail(c, 400, message);
      }
      const input = parsed.data;
      const me = c.get("user")!;

      const store = await findMedicineStore(db, { id: input.merchant_id });
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
      const totals = orderTotals(toMedicineStore(store), subtotal);

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
            code: `MED-${dhakaDate()}-${seq}`,
            module: "medicine",
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

      const storeInfo = { id: store.id, code: store.code, name: store.name, address: store.address, phone: store.phone, altPhone: store.altPhone };
      const result = toMedicineOrder(saved.order, saved.lines, storeInfo, profile?.custom_id ?? "");
      return c.json({ success: true as const, message: "Order placed successfully", result });
    })

    // `customerId` in the query is ignored: it's always the signed-in user.
    .get(`${P}/order-info`, requireUser, async (c) => {
      const result = await listMedicineOrders(db, c.get("user")!.id);
      return c.json({ success: true as const, message: "OK", result });
    });
