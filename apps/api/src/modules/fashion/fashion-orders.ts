// Fashion orders: place one (per shop), list mine. Paths and shapes follow
// the web app (CREATE_ORDER, ALL_ORDER_BY_CUSTOMER). The customer is the
// signed-in user; prices and totals are computed here from the shop's
// current prices, and each line's size and colour are checked against the
// product's variants. Customer ids and amounts in the body are ignored.
import { fashion as contract, orderTotals } from "@notension/shared";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono, type Context } from "hono";
import { requireUser, type AuthEnv } from "../../auth/middleware";
import type { Db } from "../../db/client";
import { customers, fashionOrderItems, orderItems, orders, products, storeItems, stores } from "../../db/schema";
import { loadCustomer } from "../customer/customer";
import { loadProducts, toBrand, type ProductRow } from "./fashion";

const P = "/api/v1/customer-order";

const fail = (c: Context, status: 400 | 404 | 409, message: string) =>
  c.json({ success: false as const, message }, status);

type OrderRow = typeof orders.$inferSelect;
type LineRow = { line: typeof orderItems.$inferSelect; variant: typeof fashionOrderItems.$inferSelect | null };
type StoreInfo = { id: string; code: string; name: string; address: string; phone: string | null; altPhone: string | null };

const storeInfoColumns = {
  id: stores.id,
  code: stores.code,
  name: stores.name,
  address: stores.address,
  phone: stores.phone,
  altPhone: stores.altPhone,
};

export const toLegacyOrder = (o: OrderRow, lines: LineRow[], store: StoreInfo, customerCode: string): contract.Order => ({
  _id: o.id,
  order_id: o.code,
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
  orderItems: lines.map(({ line: l, variant: v }) => ({
    _id: l.productId ?? l.id,
    type_info: v?.typeId ?? null,
    brand_info: v?.brand ?? null,
    product_title_eng: l.titleEn,
    product_title_beng: l.titleBn,
    product_size: v?.size ?? null,
    product_color: v?.color ?? null,
    // The legacy field holds the unit price paid, not the shop's cost.
    purchase_price: l.salePrice,
    max_retail_price: l.mrp,
    sale_price: l.salePrice,
    unit_symbol: l.unit,
    max_allowed: l.maxPerOrder,
    quantity: l.quantity,
    delivered_qty: l.deliveredQty,
    inc_qty: 1,
    ordered_img: l.image,
    app_image: l.image,
    web_image: v?.webImage ?? l.image,
  })),
  subTotal: o.subtotal,
  less_amount: o.discount,
  vatAmount: o.vat,
  deliveryCharge: o.deliveryCharge,
  totalAmount: o.total,
  shortNote: o.note,
  paymet_method: o.paymentMethod,
  order_status: o.status,
  createdAt: o.createdAt.toISOString(),
  updatedAt: o.updatedAt.toISOString(),
});

// Dhaka date for the order code: FSN-20261120-2001.
const dhakaDate = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date())
    .replaceAll("-", "");

async function loadLines(db: Db, orderIds: string[]): Promise<(LineRow & { orderId: string })[]> {
  if (!orderIds.length) return [];
  const rows = await db
    .select({ line: orderItems, variant: fashionOrderItems })
    .from(orderItems)
    .leftJoin(fashionOrderItems, eq(fashionOrderItems.orderItemId, orderItems.id))
    .where(inArray(orderItems.orderId, orderIds))
    .orderBy(asc(orderItems.position));
  return rows.map((r) => ({ ...r, orderId: r.line.orderId }));
}

export async function listOrders(db: Db, customerId: string) {
  const rows = await db
    .select({ order: orders, store: storeInfoColumns, customerCode: customers.code })
    .from(orders)
    .innerJoin(stores, eq(stores.id, orders.storeId))
    .leftJoin(customers, eq(customers.userId, orders.customerId))
    .where(and(eq(orders.customerId, customerId), eq(orders.module, "fashion")))
    .orderBy(desc(orders.createdAt), desc(orders.code))
    .limit(100);
  const lines = await loadLines(
    db,
    rows.map((r) => r.order.id),
  );
  return rows.map((r) =>
    toLegacyOrder(
      r.order,
      lines.filter((l) => l.orderId === r.order.id),
      r.store,
      r.customerCode ?? "",
    ),
  );
}

const unique = <T>(values: T[]) => [...new Set(values)];
const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

type Line = { row: ProductRow; size: string | null; color: ProductRow["colors"][number] | null; quantity: number };

// The variant a cart line asks for. Size: required when the product comes in
// sizes, one of them. Colour: by name, else by the colour photo the cart
// shows, else the only colour; none when the product has several colours
// but no colour photos to choose from.
function resolveVariant(
  row: ProductRow,
  input: contract.PlaceOrderInput["orderItems"][number],
): { size: string | null; color: Line["color"] } | string {
  const title = row.product.titleEn;
  const sizes = row.details.sizes;
  let size: string | null = null;
  if (sizes.length) {
    const wanted = input.product_size?.trim();
    if (!wanted) return `Please choose a size for ${title}`;
    size = sizes.find((s) => same(s, wanted)) ?? null;
    if (!size) return `Size ${wanted} is not available for ${title}`;
  }

  let color: Line["color"] = null;
  const colorName = input.product_color?.trim();
  if (colorName) {
    color = row.colors.find((c) => same(c.name, colorName)) ?? null;
    if (!color) return `${colorName} is not available for ${title}`;
  } else if (input.ordered_img) {
    color = row.colors.find((c) => c.image && c.image === input.ordered_img) ?? null;
  }
  if (!color && row.colors.length === 1) color = row.colors[0]!;
  return { size, color };
}

export const fashionOrderRoutes = (db: Db) =>
  new Hono<AuthEnv>()
    .post(`${P}/create`, requireUser, async (c) => {
      const parsed = contract.placeOrderInput.safeParse(await c.req.json().catch(() => null));
      if (!parsed.success) {
        const message = parsed.error.issues.find((i) => i.message === "Cart is empty") ? "Cart is empty" : "Invalid order";
        return fail(c, 400, message);
      }
      const input = parsed.data;
      const me = c.get("user")!;

      const [store] = await db
        .select({
          ...storeInfoColumns,
          isActive: stores.isActive,
          isBanned: stores.isBanned,
          isClosed: stores.isClosed,
          minOrder: stores.minOrder,
          minDeliveryCharge: stores.minDeliveryCharge,
          maxDeliveryCharge: stores.maxDeliveryCharge,
          discount: stores.discount,
          discountType: stores.discountType,
          maxDiscount: stores.maxDiscount,
          minOrderForDiscount: stores.minOrderForDiscount,
        })
        .from(stores)
        .where(and(eq(stores.id, input.merchant_id), eq(stores.module, "fashion")));
      if (!store || !store.isActive || store.isBanned) return fail(c, 404, "Store not found");
      if (store.isClosed) return fail(c, 409, "This store is closed right now");

      const rows = await loadProducts(
        db,
        and(eq(storeItems.storeId, store.id), inArray(products.id, unique(input.orderItems.map((i) => i._id)))),
      );
      const byId = new Map(rows.map((r) => [r.product.id, r]));

      // Same product, size and colour twice counts once with the quantities
      // added; the per-order limit applies to the product across variants.
      const lines = new Map<string, Line>();
      const perProduct = new Map<string, number>();
      for (const item of input.orderItems) {
        const row = byId.get(item._id);
        if (!row || !row.item.isAvailable) {
          return fail(c, 409, `${row?.product.titleEn ?? "An item"} is not available any more`);
        }
        const variant = resolveVariant(row, item);
        if (typeof variant === "string") return fail(c, 400, variant);
        const key = `${row.product.id}|${variant.size ?? ""}|${variant.color?.position ?? ""}`;
        const prev = lines.get(key);
        lines.set(key, { row, ...variant, quantity: (prev?.quantity ?? 0) + item.quantity });
        perProduct.set(row.product.id, (perProduct.get(row.product.id) ?? 0) + item.quantity);
      }
      for (const [productId, quantity] of perProduct) {
        const { item, product } = byId.get(productId)!;
        if (item.maxPerOrder > 0 && quantity > item.maxPerOrder) {
          return fail(c, 409, `You can order at most ${item.maxPerOrder} of ${product.titleEn}`);
        }
        if (quantity > item.stockQty) {
          return fail(c, 409, `Only ${item.stockQty} of ${product.titleEn} left in stock`);
        }
      }

      const subtotal =
        Math.round([...lines.values()].reduce((t, l) => t + l.row.item.salePrice * l.quantity, 0) * 100) / 100;
      const totals = orderTotals(
        {
          min_purchage_amount: store.minOrder,
          min_delivery_charge: store.minDeliveryCharge,
          max_delivery_charge: store.maxDeliveryCharge,
          less: store.discount,
          less_type: store.discountType === "percent" ? "Percent" : "Flat",
          maximum_less: store.maxDiscount,
          minimum_order_for_less: store.minOrderForDiscount,
        },
        subtotal,
      );

      // Delivery details: the profile, overridden by what the checkout sent.
      const profile = await loadCustomer(db, me.id);
      const info = input.customerInfo ?? {};
      const delivery = {
        name: info.customer_name?.trim() || profile?.customer_name || "",
        address: info.customer_address?.trim() || profile?.customer_address || "",
        phone: profile?.contact_no || info.contact_no?.trim() || "",
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
            code: `FSN-${dhakaDate()}-${seq}`,
            module: "fashion",
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
        const ordered = [...lines.values()];
        const savedLines = await tx
          .insert(orderItems)
          .values(
            ordered.map((l, position) => ({
              orderId: o!.id,
              storeItemId: l.row.item.id,
              productId: l.row.product.id,
              titleEn: l.row.product.titleEn,
              titleBn: l.row.product.titleBn,
              unit: l.row.product.unit,
              image: l.color?.image ?? l.row.product.image,
              mrp: l.row.item.mrp,
              salePrice: l.row.item.salePrice,
              purchasePrice: l.row.item.purchasePrice,
              maxPerOrder: l.row.item.maxPerOrder,
              quantity: l.quantity,
              position,
            })),
          )
          .returning();
        const variants = await tx
          .insert(fashionOrderItems)
          .values(
            savedLines.map((line) => {
              const l = ordered[line.position]!;
              return {
                orderItemId: line.id,
                size: l.size,
                color: l.color?.name ?? null,
                typeId: l.row.type.id,
                brand: l.row.brand ? toBrand(l.row.brand) : null,
                webImage: l.row.product.image,
              };
            }),
          )
          .returning();
        return {
          order: o!,
          lines: savedLines
            .sort((a, b) => a.position - b.position)
            .map((line) => ({ line, variant: variants.find((v) => v.orderItemId === line.id) ?? null })),
        };
      });

      const result = toLegacyOrder(saved.order, saved.lines, store, profile?.custom_id ?? "");
      return c.json({ success: true as const, message: "Order placed successfully", data: result, result });
    })

    // `customer_id` / `custom_customer_id` in the body are ignored: it's
    // always the signed-in user's orders.
    .post(`${P}/order-by-customer`, requireUser, async (c) => {
      const result = await listOrders(db, c.get("user")!.id);
      return c.json({ success: true as const, message: "Success", result });
    });
