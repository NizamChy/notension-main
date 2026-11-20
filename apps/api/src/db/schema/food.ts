// Food: what restaurants need on top of the shared store / product / order
// tables. A food store is a `store` row (module "food") plus a `food_store`
// row; a dish is a `product` + `store_item` plus a `food_item` row.
import { sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { objectId } from "../ids";
import { districts, storeItems, stores } from "./catalog";
import { orderItems } from "./commerce";

const id = () => text("id").primaryKey().$defaultFn(objectId);
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const money = (name: string) =>
  numeric(name, { precision: 12, scale: 2, mode: "number" }).notNull().default(0);

// Restaurant categories on the food landing page (Biryani, Pizza, ...).
export const foodStoreCategories = pgTable("food_store_category", {
  id: id(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  banner: text("banner"),
  // How far (metres) the nearest-store search looks for this category.
  regularDistance: integer("regular_distance").notNull().default(10000),
  position: integer("position").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: createdAt(),
});

// Restaurant-only store fields.
export const foodStores = pgTable(
  "food_store",
  {
    storeId: text("store_id")
      .primaryKey()
      .references(() => stores.id, { onDelete: "cascade" }),
    logo: text("logo"),
    rating: doublePrecision("rating").notNull().default(0),
    deliveryTime: text("delivery_time").notNull().default(""), // "30-40 min"
    vatPercent: money("vat_percent"),
    categoryIds: text("category_ids").array().notNull().default(sql`'{}'::text[]`),
  },
  (t) => [index("food_store_categories_idx").using("gin", t.categoryIds)],
);

// Menu sections inside a restaurant (Biryani & Rice, Drinks & Shakes, ...).
export const foodMenuCategories = pgTable("food_menu_category", {
  id: id(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  banner: text("banner"),
  position: integer("position").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

// Dish-only fields of a store item.
export const foodItems = pgTable(
  "food_item",
  {
    storeItemId: text("store_item_id")
      .primaryKey()
      .references(() => storeItems.id, { onDelete: "cascade" }),
    code: text("code").notNull().unique(), // custom_product_id, FI-0001
    categoryId: text("category_id").references(() => foodMenuCategories.id),
    isPopular: boolean("is_popular").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: createdAt(),
  },
  (t) => [index("food_item_category_idx").on(t.categoryId)],
);

// Choices on a dish. A dish with variations (Regular / Large) must be ordered
// with exactly one of them, whose price replaces the dish price; add-ons
// (extra cheese) are optional and each adds its price.
export const foodOptionKindEnum = pgEnum("food_option_kind", ["variation", "addon"]);

export const foodItemOptions = pgTable(
  "food_item_option",
  {
    id: id(),
    storeItemId: text("store_item_id")
      .notNull()
      .references(() => storeItems.id, { onDelete: "cascade" }),
    kind: foodOptionKindEnum("kind").notNull(),
    name: text("name").notNull(),
    price: money("price"),
    isAvailable: boolean("is_available").notNull().default(true),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("food_item_option_item_idx").on(t.storeItemId)],
);

// The options chosen on an order line, copied as sold.
export const foodOrderItemOptions = pgTable(
  "food_order_item_option",
  {
    id: id(),
    orderItemId: text("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "cascade" }),
    optionId: text("option_id").references(() => foodItemOptions.id, { onDelete: "set null" }),
    kind: foodOptionKindEnum("kind").notNull(),
    name: text("name").notNull(),
    price: money("price"),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("food_order_item_option_line_idx").on(t.orderItemId)],
);

// Landing page sliders, one set per district.
export const foodSliderSets = pgTable("food_slider_set", {
  id: id(),
  districtId: text("district_id")
    .notNull()
    .unique()
    .references(() => districts.id, { onDelete: "cascade" }),
});

export const foodSlides = pgTable(
  "food_slide",
  {
    id: id(),
    setId: text("set_id")
      .notNull()
      .references(() => foodSliderSets.id, { onDelete: "cascade" }),
    slot: text("slot", { enum: ["first_slider", "second_slider", "third_slider", "fourth_slider"] }).notNull(),
    fileName: text("file_name").notNull(),
    position: integer("position").notNull().default(0),
  },
  (t) => [unique("food_slide_set_slot_position").on(t.setId, t.slot, t.position)],
);
