// Customers and orders.
import { sql } from "drizzle-orm";
import {
  doublePrecision,
  index,
  integer,
  jsonb,
  numeric,
  pgSequence,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { objectId } from "../ids";
import { user } from "./auth";
import { moduleEnum, products, storeItems, stores } from "./catalog";

const id = () => text("id").primaryKey().$defaultFn(objectId);
const money = (name: string) =>
  numeric(name, { precision: 12, scale: 2, mode: "number" }).notNull().default(0);

// Running numbers behind CUS0000001 and GRO-20261120-2001.
export const customerNumberSeq = pgSequence("customer_number_seq", { startWith: 1 });
export const orderNumberSeq = pgSequence("order_number_seq", { startWith: 2001 });

// The shopping profile of a signed-in user (one per user).
export const customers = pgTable("customer", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  code: text("code")
    .notNull()
    .unique()
    .default(sql`('CUS' || lpad(nextval('customer_number_seq')::text, 7, '0'))`),
  address: text("address").notNull().default(""),
  altPhone: text("alt_phone").notNull().default(""),
  districtId: text("district_id"),
  districtName: text("district_name").notNull().default(""),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

export const ORDER_STATUSES = ["Pending", "Accepted", "Processing", "On the way", "Delivered", "Cancelled"] as const;

export type DeliveryInfo = {
  name: string;
  address: string;
  phone: string;
  altPhone: string;
  latitude: number | null;
  longitude: number | null;
};

export const orders = pgTable(
  "order",
  {
    id: id(),
    code: text("code").notNull().unique(), // GRO-20261120-2001
    module: moduleEnum("module").notNull(),
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id),
    customerId: text("customer_id")
      .notNull()
      .references(() => user.id),
    status: text("status", { enum: ORDER_STATUSES }).notNull().default("Pending"),
    // All amounts are computed by the API from the store's current prices.
    subtotal: money("subtotal"),
    discount: money("discount"),
    vat: money("vat"),
    deliveryCharge: money("delivery_charge"),
    total: money("total"),
    paymentMethod: text("payment_method").notNull(),
    note: text("note").notNull().default(""),
    delivery: jsonb("delivery").$type<DeliveryInfo>().notNull(),
    rating: integer("rating").notNull().default(0),
    review: text("review").notNull().default(""),
    // The delivery rider (a user with the `rider` role), once assigned.
    riderId: text("rider_id").references(() => user.id, { onDelete: "set null" }),
    assignedAt: timestamp("assigned_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("order_customer_idx").on(t.customerId, t.createdAt),
    index("order_store_idx").on(t.storeId, t.createdAt),
    index("order_rider_idx").on(t.riderId, t.createdAt),
  ],
);

// Each line keeps a copy of the product as sold, so later catalogue edits
// don't rewrite order history.
export const orderItems = pgTable(
  "order_item",
  {
    id: id(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    storeItemId: text("store_item_id").references(() => storeItems.id, { onDelete: "set null" }),
    productId: text("product_id").references(() => products.id, { onDelete: "set null" }),
    titleEn: text("title_en").notNull(),
    titleBn: text("title_bn"),
    packSize: text("pack_size"),
    unit: text("unit"),
    image: text("image"),
    mrp: money("mrp"),
    salePrice: money("sale_price"),
    purchasePrice: money("purchase_price"),
    maxPerOrder: integer("max_per_order").notNull().default(0),
    quantity: integer("quantity").notNull(),
    deliveredQty: integer("delivered_qty").notNull().default(0),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("order_item_order_idx").on(t.orderId)],
);

// Values the API generates once and keeps, e.g. the session signing secret
// when BETTER_AUTH_SECRET isn't set.
export const appSecrets = pgTable("app_secret", {
  name: text("name").primaryKey(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
