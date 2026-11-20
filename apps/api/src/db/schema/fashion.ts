// Fashion & lifestyle: what the shared catalogue tables don't cover.
//
// Fashion shops are rows in `store` (module "fashion") and their products are
// `product` + `store_item` rows (one store per product), so orders reuse
// `order` / `order_item`. On top of that fashion has:
// - a three-level taxonomy (type > category > subcategory) with images, and
//   brands;
// - per-product details (codes, flags, HTML description, size chart) and its
//   variants: the sizes it comes in and its colours, each colour with its own
//   photo when the product has colour photos;
// - the size and colour chosen for each ordered line.
import { sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { objectId } from "../ids";
import { orderItems } from "./commerce";
import { products, stores } from "./catalog";

const id = () => text("id").primaryKey().$defaultFn(objectId);
const ts = (name: string) => timestamp(name, { withTimezone: true }).notNull().defaultNow();

// The shop's logo and last update; everything else is in `store`
// (popup message = delivery_notice, status = is_active).
export const fashionStores = pgTable("fashion_store", {
  storeId: text("store_id")
    .primaryKey()
    .references(() => stores.id, { onDelete: "cascade" }),
  logo: text("logo"),
  updatedAt: ts("updated_at"),
});

export const fashionTypes = pgTable("fashion_type", {
  id: id(),
  name: text("name").notNull(),
  image: text("image"),
  position: integer("position").notNull().default(0), // serial_no
  isActive: boolean("is_active").notNull().default(true),
  createdAt: ts("created_at"),
  updatedAt: ts("updated_at"),
});

export const fashionCategories = pgTable(
  "fashion_category",
  {
    id: id(),
    typeId: text("type_id")
      .notNull()
      .references(() => fashionTypes.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    banner: text("banner"),
    position: integer("position").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [index("fashion_category_type_idx").on(t.typeId)],
);

export const fashionSubCategories = pgTable(
  "fashion_sub_category",
  {
    id: id(),
    categoryId: text("category_id")
      .notNull()
      .references(() => fashionCategories.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    banner1: text("banner_1"), // banner_type_1
    banner2: text("banner_2"),
    position: integer("position").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [index("fashion_sub_category_category_idx").on(t.categoryId)],
);

export const fashionBrands = pgTable("fashion_brand", {
  id: id(),
  name: text("name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  position: integer("position").notNull().default(0),
});

// Fashion details of a `product` (title, MRP, main image and unit are there;
// price, stock and per-order limit are on its `store_item`).
export const fashionProducts = pgTable(
  "fashion_product",
  {
    productId: text("product_id")
      .primaryKey()
      .references(() => products.id, { onDelete: "cascade" }),
    code: text("code").notNull().unique(), // FL-1001
    typeId: text("type_id")
      .notNull()
      .references(() => fashionTypes.id),
    categoryId: text("category_id")
      .notNull()
      .references(() => fashionCategories.id),
    subCategoryId: text("sub_category_id")
      .notNull()
      .references(() => fashionSubCategories.id),
    brandId: text("brand_id").references(() => fashionBrands.id),
    appImage: text("app_image"),
    detailImages: text("detail_images").array().notNull().default(sql`'{}'::text[]`),
    // The sizes it comes in, in display order ("S", "M", "40", "50 ml"); empty
    // for one-size items.
    sizes: text("sizes").array().notNull().default(sql`'{}'::text[]`),
    description: text("description").notNull().default(""),
    specification: text("specification").notNull().default(""),
    sizeChart: text("size_chart"),
    isPopular: boolean("is_popular").notNull().default(false),
    isNew: boolean("is_new").notNull().default(false),
    isBestseller: boolean("is_bestseller").notNull().default(false),
    isFeatured: boolean("is_featured").notNull().default(false),
    rating: doublePrecision("rating").notNull().default(0),
    reviews: integer("reviews").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    position: integer("position").notNull().default(0),
    createdAt: ts("created_at"),
    updatedAt: ts("updated_at"),
  },
  (t) => [
    index("fashion_product_type_idx").on(t.typeId, t.position),
    index("fashion_product_category_idx").on(t.categoryId),
    index("fashion_product_sub_category_idx").on(t.subCategoryId),
  ],
);

// A product's colours, in display order. `image` is that colour's photo;
// products without colour photos have it null for every colour.
export const fashionProductColors = pgTable(
  "fashion_product_color",
  {
    productId: text("product_id")
      .notNull()
      .references(() => fashionProducts.productId, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    name: text("name").notNull(),
    image: text("image"),
  },
  (t) => [primaryKey({ columns: [t.productId, t.position] })],
);

export type FashionBrandInfo = { _id: string; brand_name: string; status: boolean };

// The variant of an ordered line and the product details the order history
// shows, as they were when ordered.
export const fashionOrderItems = pgTable("fashion_order_item", {
  orderItemId: text("order_item_id")
    .primaryKey()
    .references(() => orderItems.id, { onDelete: "cascade" }),
  size: text("size"),
  color: text("color"),
  typeId: text("type_id"),
  brand: jsonb("brand").$type<FashionBrandInfo | null>(),
  webImage: text("web_image"),
});
