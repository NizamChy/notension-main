// Food orders: place one, list mine (FOOD_PLACE_ORDER, FOOD_ORDER_INFO).
// Dish prices, variations, add-ons, discount, VAT and delivery charge are
// always computed here from the store's current data; the amounts the
// browser sends are ignored.
import { food as contract, orderTotals } from "@notension/shared";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono, type Context } from "hono";
import { requireUser, type AuthEnv } from "../../auth/middleware";
import type { Db } from "../../db/client";
import {
  customers,
  foodItemOptions,
  foodItems,
  foodOrderItemOptions,
  foodStores,
  orderItems,
  orders,
  products,
  storeItems,
  stores,
} from "../../db/schema";
import { loadCustomer } from "../customer/customer";
import { ok, P, storeColumns, toFoodStore } from "./food";

const fail = (c: Context, status: 400 | 404 | 409, message: string) =>
  c.json({ success: false as const, message }, status);

const round2 = (n: number) => Math.round(n * 100) / 100;

type OrderRow = typeof orders.$inferSelect;
type LineRow = typeof orderItems.$inferSelect & { productCategory: string | null };
type LineOptionRow = typeof foodOrderItemOptions.$inferSelect;
type StoreInfo = { id: string; code: string; name: string; address: string; phone: string | null; altPhone: string | null };

const toOption = (o: LineOptionRow): contract.ItemOption => ({ _id: o.optionId ?? o.id, name: o.name, price: o.price });

export const toFoodOrder = (
  o: OrderRow,
  lines: LineRow[],
  lineOptions: LineOptionRow[],
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
  orderItems: lines.map((l) => {
    const mine = lineOptions.filter((x) => x.orderItemId === l.id);
    const variation = mine.find((x) => x.kind === "variation");
    const addons = mine.filter((x) => x.kind === "addon");
    return {
      _id: l.storeItemId ?? l.id,
      productCategory: l.productCategory,
      product_title_eng: l.titleEn,
      product_title_beng: l.titleBn,
      pack_size: l.packSize,
      max_retail_price: l.mrp,
      sale_price: l.salePrice,
      unit_symbol: l.unit,
      max_allowed: l.maxPerOrder,
      quantity: l.quantity,
      delivered_qty: l.deliveredQty,
      inc_qty: 1,
      app_image: l.image,
      ...(variation && { variation: toOption(variation) }),
      ...(addons.length && { addons: addons.map(toOption) }),
    };
  }),
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

const storeInfoColumns = {
  id: stores.id,
  code: stores.code,
  name: stores.name,
  address: stores.address,
  phone: stores.phone,
  altPhone: stores.altPhone,
};

// Dhaka date for the order code: FOOD-20261120-2001.
const dhakaDate = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date())
    .replaceAll("-", "");

async function loadLines(db: Db, orderIds: string[]) {
  if (!orderIds.length) return { lines: [], options: [] };
  const lines = await db
    .select({ line: orderItems, productCategory: foodItems.categoryId })
    .from(orderItems)
    .leftJoin(foodItems, eq(foodItems.storeItemId, orderItems.storeItemId))
    .where(inArray(orderItems.orderId, orderIds))
    .orderBy(asc(orderItems.position));
  const options = lines.length
    ? await db
        .select()
        .from(foodOrderItemOptions)
        .where(
          inArray(
            foodOrderItemOptions.orderItemId,
            lines.map((l) => l.line.id),
          ),
        )
        .orderBy(asc(foodOrderItemOptions.position))
    : [];
  return { lines: lines.map((l) => ({ ...l.line, productCategory: l.productCategory })), options };
}

export async function listFoodOrders(db: Db, customerId: string) {
  const rows = await db
    .select({ order: orders, store: storeInfoColumns, customerCode: customers.code })
    .from(orders)
    .innerJoin(stores, eq(stores.id, orders.storeId))
    .leftJoin(customers, eq(customers.userId, orders.customerId))
    .where(and(eq(orders.customerId, customerId), eq(orders.module, "food")))
    .orderBy(desc(orders.createdAt), desc(orders.code))
    .limit(100);
  const { lines, options } = await loadLines(
    db,
    rows.map((r) => r.order.id),
  );
  return rows.map((r) =>
    toFoodOrder(
      r.order,
      lines.filter((l) => l.orderId === r.order.id),
      options,
      r.store,
      r.customerCode ?? "",
    ),
  );
}

export const foodOrderRoutes = (db: Db) =>
  new Hono<AuthEnv>()
    .post(`${P}/order`, requireUser, async (c) => {
      const parsed = contract.placeOrderInput.safeParse(await c.req.json().catch(() => null));
      if (!parsed.success) {
        const empty = parsed.error.issues.some((i) => i.message === "Cart is empty");
        return fail(c, 400, empty ? "Cart is empty" : "Invalid order");
      }
      const input = parsed.data;
      const me = c.get("user")!;

      const [store] = await db
        .select({ ...storeColumns, districtName: sql<string | null>`null` })
        .from(stores)
        .innerJoin(foodStores, eq(foodStores.storeId, stores.id))
        .where(and(eq(stores.id, input.merchant_id), eq(stores.module, "food")));
      if (!store || !store.isActive || store.isBanned) return fail(c, 404, "Store not found");
      if (store.isClosed) return fail(c, 409, "This store is closed right now");

      // Same dish with the same choices twice counts once, quantities added.
      type Wanted = { itemId: string; variationId: string | null; addonIds: string[]; quantity: number };
      const wanted = new Map<string, Wanted>();
      for (const line of input.orderItems) {
        const addonIds = [...new Set(line.addon_ids ?? [])].sort();
        const variationId = line.variation_id ?? null;
        const key = JSON.stringify([line._id, variationId, addonIds]);
        const prev = wanted.get(key);
        if (prev) prev.quantity += line.quantity;
        else wanted.set(key, { itemId: line._id, variationId, addonIds, quantity: line.quantity });
      }
      const itemIds = [...new Set([...wanted.values()].map((w) => w.itemId))];

      const [rows, options] = await Promise.all([
        db
          .select({ item: storeItems, product: products, food: foodItems })
          .from(storeItems)
          .innerJoin(products, eq(products.id, storeItems.productId))
          .innerJoin(foodItems, eq(foodItems.storeItemId, storeItems.id))
          .where(and(eq(storeItems.storeId, store.id), inArray(storeItems.id, itemIds))),
        db
          .select()
          .from(foodItemOptions)
          .where(and(inArray(foodItemOptions.storeItemId, itemIds), eq(foodItemOptions.isAvailable, true)))
          .orderBy(asc(foodItemOptions.position)),
      ]);
      const byId = new Map(rows.map((r) => [r.item.id, r]));

      // The per-order limit counts a dish across all its variations.
      const perItem = new Map<string, number>();
      for (const w of wanted.values()) perItem.set(w.itemId, (perItem.get(w.itemId) ?? 0) + w.quantity);

      type Line = typeof orderItems.$inferInsert & { chosen: (typeof foodItemOptions.$inferSelect)[] };
      const lines: Line[] = [];
      for (const w of wanted.values()) {
        const row = byId.get(w.itemId);
        if (!row || !row.item.isAvailable || !row.food.isActive) {
          return fail(c, 409, `${row?.product.titleEn ?? "An item"} is not available any more`);
        }
        const title = row.product.titleEn;
        const max = row.item.maxPerOrder;
        if (max > 0 && perItem.get(w.itemId)! > max) {
          return fail(c, 409, `You can order at most ${max} of ${title}`);
        }

        const mine = options.filter((o) => o.storeItemId === row.item.id);
        const variations = mine.filter((o) => o.kind === "variation");
        const variation = w.variationId ? variations.find((o) => o.id === w.variationId) : undefined;
        if (variations.length && !variation) {
          return fail(c, 409, w.variationId ? `That option of ${title} is not available any more` : `Please choose an option for ${title}`);
        }
        if (!variations.length && w.variationId) return fail(c, 409, `That option of ${title} is not available any more`);
        const addons = w.addonIds.map((id) => mine.find((o) => o.kind === "addon" && o.id === id));
        if (addons.some((a) => !a)) return fail(c, 409, `An add-on of ${title} is not available any more`);
        const chosenAddons = addons as (typeof foodItemOptions.$inferSelect)[];

        // A variation's price replaces the dish price; add-ons add theirs.
        const addonTotal = chosenAddons.reduce((t, a) => t + a.price, 0);
        const unit = round2((variation ? variation.price : row.item.salePrice) + addonTotal);
        const mrp = round2((variation ? variation.price : row.item.mrp) + addonTotal);

        lines.push({
          orderId: "", // set below
          storeItemId: row.item.id,
          productId: row.product.id,
          titleEn: title,
          titleBn: row.product.titleBn,
          packSize: row.product.packSize,
          unit: row.product.unit,
          image: row.product.image,
          mrp,
          salePrice: unit,
          purchasePrice: row.item.purchasePrice,
          maxPerOrder: max,
          quantity: w.quantity,
          position: lines.length,
          chosen: [...(variation ? [variation] : []), ...chosenAddons],
        });
      }

      const subtotal = round2(lines.reduce((t, l) => t + (l.salePrice ?? 0) * l.quantity, 0));
      const totals = orderTotals(toFoodStore(store), subtotal);
      const vat = round2((subtotal * store.vatPercent) / 100);

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
            code: `FOOD-${dhakaDate()}-${seq}`,
            module: "food",
            storeId: store.id,
            customerId: me.id,
            subtotal,
            discount: totals.discount,
            vat,
            deliveryCharge: totals.shippingCharge,
            total: round2(totals.grandTotal + vat),
            paymentMethod: input.paymet_method,
            note: input.shortNote ?? "",
            delivery,
          })
          .returning();
        const savedLines = await tx
          .insert(orderItems)
          .values(lines.map(({ chosen: _chosen, ...l }) => ({ ...l, orderId: o!.id })))
          .returning();
        const optionRows = savedLines.flatMap((sl, i) =>
          lines[i]!.chosen.map((opt, position) => ({
            orderItemId: sl.id,
            optionId: opt.id,
            kind: opt.kind,
            name: opt.name,
            price: opt.price,
            position,
          })),
        );
        const savedOptions = optionRows.length
          ? await tx.insert(foodOrderItemOptions).values(optionRows).returning()
          : [];
        return { order: o!, lines: savedLines, options: savedOptions };
      });

      const categoryOf = new Map(rows.map((r) => [r.item.id, r.food.categoryId]));
      const result = toFoodOrder(
        saved.order,
        saved.lines.map((l) => ({ ...l, productCategory: categoryOf.get(l.storeItemId ?? "") ?? null })),
        saved.options,
        store,
        profile?.custom_id ?? "",
      );
      return c.json({ ...ok(result), message: "Order placed successfully", order_id: result.order_id });
    })

    // `customerId` in the query is ignored: it's always the signed-in user.
    .get(`${P}/order-info`, requireUser, async (c) => c.json(ok(await listFoodOrders(db, c.get("user")!.id))));
