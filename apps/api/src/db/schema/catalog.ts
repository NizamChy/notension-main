// Places, stores and what they sell.
//
// One schema serves every store-based module (grocery, medicine, food,
// fashion): `module` says which one a row belongs to. Module-specific product
// fields (a medicine's generic name and strength, ...) live in `attrs`.
import { sql } from "drizzle-orm";
import {
  boolean,
  customType,
  doublePrecision,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { objectId } from "../ids";

const id = () => text("id").primaryKey().$defaultFn(objectId);
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
// Money as numeric(12,2); read back as a JS number.
const money = (name: string) =>
  numeric(name, { precision: 12, scale: 2, mode: "number" }).notNull().default(0);

export const MODULES = ["grocery", "medicine", "food", "fashion"] as const;
export type Module = (typeof MODULES)[number];
export const moduleEnum = pgEnum("module", MODULES);

export const discountTypeEnum = pgEnum("discount_type", ["percent", "flat"]);

// PostGIS point (WGS84, SRID 4326) computed from latitude/longitude. Plain
// `geography`: drizzle-kit would quote a parameterised type name. Only queried
// through SQL (distance, bounding box), never read back directly.
const geographyPoint = customType<{ data: string; driverData: string }>({
  dataType: () => "geography",
});

export const districts = pgTable("district", {
  id: id(),
  name: text("name").notNull(),
  nameBn: text("name_bn"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

export const stores = pgTable(
  "store",
  {
    id: id(),
    module: moduleEnum("module").notNull(),
    code: text("code").notNull().unique(), // custom_store_id, e.g. GS260001
    name: text("name").notNull(),
    address: text("address").notNull().default(""),
    phone: text("phone"),
    altPhone: text("alt_phone"),
    districtId: text("district_id").notNull().references(() => districts.id),
    areaName: text("area_name"),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    location: geographyPoint("location").generatedAlwaysAs(
      sql`ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography`,
    ),
    bannerApp: text("banner_app"),
    bannerWeb: text("banner_web"),
    isActive: boolean("is_active").notNull().default(true),
    isBanned: boolean("is_banned").notNull().default(false),
    isClosed: boolean("is_closed").notNull().default(false),
    showPrice: boolean("show_price").notNull().default(true),
    deliveryNotice: text("delivery_notice").notNull().default(""),
    // Pricing rules, see orderTotals in @notension/shared.
    minOrder: money("min_order"),
    minDeliveryCharge: money("min_delivery_charge"),
    maxDeliveryCharge: money("max_delivery_charge"),
    discount: money("discount"),
    discountType: discountTypeEnum("discount_type").notNull().default("percent"),
    maxDiscount: money("max_discount"),
    minOrderForDiscount: money("min_order_for_discount"),
    merchantType: integer("merchant_type").notNull().default(0),
    opensAt: text("opens_at"), // "08:00 AM", as the apps show it
    closesAt: text("closes_at"),
    createdAt: createdAt(),
  },
  (t) => [
    index("store_module_district_idx").on(t.module, t.districtId),
    index("store_location_idx").using("gist", t.location),
  ],
);

// "General" types are the catalogue tree (Rice & Grains); "Custom" types are
// promotional lists (Special Offer, Deal of the Day) that items opt into.
export const productTypes = pgTable("product_type", {
  id: id(),
  module: moduleEnum("module").notNull(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  kind: text("kind", { enum: ["General", "Custom"] }).notNull().default("General"),
  position: integer("position").notNull().default(0),
});

export const productSubtypes = pgTable("product_subtype", {
  id: id(),
  typeId: text("type_id").notNull().references(() => productTypes.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  name: text("name").notNull(),
  banner: text("banner"),
  position: integer("position").notNull().default(0),
});

// The master catalogue entry a store lists (legacy name: productInfoTable).
export const products = pgTable(
  "product",
  {
    id: id(),
    module: moduleEnum("module").notNull(),
    slug: text("slug").notNull(),
    titleEn: text("title_en").notNull(),
    titleBn: text("title_bn"),
    packSize: text("pack_size"),
    unit: text("unit"),
    mrp: money("mrp"),
    image: text("image"),
    typeId: text("type_id").references(() => productTypes.id),
    subtypeId: text("subtype_id").references(() => productSubtypes.id),
    attrs: jsonb("attrs").$type<Record<string, unknown>>().notNull().default({}),
  },
  (t) => [unique("product_module_slug").on(t.module, t.slug)],
);

// A product as one store sells it: its own price, stock and limits.
export const storeItems = pgTable(
  "store_item",
  {
    id: id(),
    storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
    productId: text("product_id").notNull().references(() => products.id),
    salePrice: money("sale_price"),
    purchasePrice: money("purchase_price"),
    mrp: money("mrp"),
    discount: money("discount"),
    discountType: discountTypeEnum("discount_type").notNull().default("percent"),
    maxPerOrder: integer("max_per_order").notNull().default(0), // 0 = no limit
    stockQty: integer("stock_qty").notNull().default(0),
    isAvailable: boolean("is_available").notNull().default(true),
    customTypeIds: text("custom_type_ids").array().notNull().default(sql`'{}'::text[]`),
    position: integer("position").notNull().default(0),
  },
  (t) => [
    unique("store_item_store_product").on(t.storeId, t.productId),
    index("store_item_custom_types_idx").using("gin", t.customTypeIds),
  ],
);

export const sliders = pgTable("slider", {
  id: id(),
  module: moduleEnum("module").notNull(),
  slot: text("slot", { enum: ["first_slider", "second_slider", "third_slider", "fourth_slider"] }).notNull(),
  fileName: text("file_name").notNull(),
  position: integer("position").notNull().default(0),
});
