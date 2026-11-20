// The food API as the web app reads it today (legacy field names, see
// apps/web/src/demo/modules/food.js). The API builds these shapes and the
// tests validate every response against them.
import { z } from "zod";

const id = z.string().regex(/^[0-9a-f]{24}$/, "24-char hex id");
const lessType = z.enum(["Percent", "Flat"]);

export const ok = <T extends z.ZodType>(result: T) =>
  z.object({ success: z.literal(true), status: z.literal(200), message: z.string(), result });

export const storeCategory = z.object({
  _id: id,
  store_category_name: z.string(),
  banner: z.string().nullable(),
  regularDistance: z.number(),
  serial_no: z.number(),
  is_active: z.boolean(),
  createdAt: z.string(),
});
export type StoreCategory = z.infer<typeof storeCategory>;

const slide = z.object({ _id: id, file_name: z.string() });

export const dashboardSlider = z.object({
  _id: id,
  district_id: id,
  first_slider: z.array(slide),
  second_slider: z.array(slide),
  third_slider: z.array(slide),
  fourth_slider: z.array(slide),
});
export type DashboardSlider = z.infer<typeof dashboardSlider>;

export const exploreModule = z.object({
  shopCategory: z.array(storeCategory),
  DashboardSlider: z.array(dashboardSlider).max(1),
});

export const foodStore = z.object({
  _id: id,
  custom_store_id: z.string(),
  shop_name: z.string(),
  shop_address: z.string(),
  district_area_name: z.string().nullable(),
  contact_no: z.string().nullable(),
  alternative_contact_no: z.string().nullable(),
  delivery_time: z.string(),
  rating: z.number(),
  min_purchage_amount: z.number(),
  max_delivery_charge: z.number(),
  min_delivery_charge: z.number(),
  less: z.number(),
  less_type: lessType,
  maximum_less: z.number(),
  minimum_order_for_less: z.number(),
  delivery_notice: z.string(),
  shop_banner_app: z.string().nullable(),
  shop_banner_web: z.string().nullable(),
  shop_logo: z.string().nullable(),
  district_id: id,
  district_name: z.string(),
  shop_latitude: z.number(),
  shop_longitude: z.number(),
  location: z.object({ type: z.literal("Point"), coordinates: z.tuple([z.number(), z.number()]) }),
  StoreCategory: z.array(id),
  opening_time: z.string().nullable(),
  closing_time: z.string().nullable(),
  is_active: z.boolean(),
  is_banned: z.boolean(),
  is_closed: z.boolean(),
  vat_percent: z.number(),
  createdAt: z.string(),
});
export type FoodStore = z.infer<typeof foodStore>;

export const nearbyStore = foodStore.extend({ distance: z.number().optional() });

// A variation (size) or add-on of a dish.
export const itemOption = z.object({ _id: id, name: z.string(), price: z.number() });
export type ItemOption = z.infer<typeof itemOption>;

export const foodItem = z.object({
  _id: id,
  custom_product_id: z.string(),
  storeId: id,
  custom_store_id: z.string(),
  productCategory: id.nullable(),
  product_title_eng: z.string(),
  product_title_beng: z.string().nullable(),
  pack_size: z.string().nullable(),
  max_retail_price: z.number(),
  sale_price: z.number(),
  less: z.number(),
  less_type: lessType,
  unit_symbol: z.string().nullable(),
  max_allowed: z.number(),
  app_image: z.string().nullable(),
  web_image: z.string().nullable(),
  is_popular: z.boolean(),
  is_available: z.boolean(),
  is_active: z.boolean(),
  createdAt: z.string(),
  // Only present on dishes that have them.
  variations: z.array(itemOption).optional(),
  addons: z.array(itemOption).optional(),
});
export type FoodItem = z.infer<typeof foodItem>;

const menuCategoryInfo = z.object({
  _id: id,
  category_name: z.string(),
  banner_type_1: z.string().nullable(),
  is_active: z.boolean(),
});

export const exploreStore = z.object({
  shopDetails: z.array(foodStore).max(1),
  allProductCategory: z.array(
    z.object({ _id: id, categoryName: z.string(), categoryInfo: menuCategoryInfo, totalProduct: z.number() }),
  ),
  allProduct: z.array(foodItem),
  storeId: z.string(),
  customstoreId: z.string(),
});
export type ExploreStore = z.infer<typeof exploreStore>;

// Request inputs.
const optionalNumber = z.coerce.number().finite().optional().catch(undefined);
const optionalText = z.string().optional().catch(undefined);

export const exploreModuleInput = z.object({ district_id: optionalText });
export const nearbyStoresInput = z.object({
  district_id: optionalText,
  shop_latitude: optionalNumber,
  shop_longitude: optionalNumber,
  max_distance: optionalNumber,
  StoreCategory: optionalText,
});
export const findStoreInput = z.object({ search: optionalText, StoreCategory: optionalText });
export const storeRefInput = z.object({ storeId: optionalText, custom_store_id: optionalText });

// ------------------------------------------------------------------ orders

// What the checkout posts (JSON). Only the store, item ids with quantities
// (and chosen variation / add-ons), payment method, note and delivery details
// are used: the API prices the order itself.
export const placeOrderInput = z.object({
  merchant_id: z.string().min(1),
  orderItems: z
    .array(
      z
        .object({
          _id: z.string().min(1),
          quantity: z.coerce.number().int().positive().max(1000),
          variation_id: z.string().min(1).nullish(),
          addon_ids: z.array(z.string().min(1)).max(50).nullish(),
        })
        .passthrough(),
    )
    .min(1, "Cart is empty")
    .max(200),
  paymet_method: z.string().trim().min(1).max(50).catch("Cash on Delivery"),
  shortNote: z.string().max(500).optional().catch(""),
  customerInfo: z
    .object({
      customer_name: z.string().max(100).optional().catch(undefined),
      customer_address: z.string().max(300).optional().catch(undefined),
      contact_no: z.string().max(20).optional().catch(undefined),
      alternative_contact_no: z.string().max(20).optional().catch(undefined),
      latitude: z.coerce.number().finite().optional().catch(undefined),
      longitude: z.coerce.number().finite().optional().catch(undefined),
    })
    .partial()
    .optional()
    .catch(undefined),
});
export type PlaceOrderInput = z.infer<typeof placeOrderInput>;

export const orderItem = z.object({
  _id: z.string(),
  productCategory: z.string().nullable(),
  product_title_eng: z.string(),
  product_title_beng: z.string().nullable(),
  pack_size: z.string().nullable(),
  max_retail_price: z.number(),
  // Unit price including the chosen variation and add-ons.
  sale_price: z.number(),
  unit_symbol: z.string().nullable(),
  max_allowed: z.number(),
  quantity: z.number(),
  delivered_qty: z.number(),
  inc_qty: z.number(),
  app_image: z.string().nullable(),
  variation: itemOption.optional(),
  addons: z.array(itemOption).optional(),
});

export const order = z.object({
  _id: z.string(),
  order_id: z.string(),
  order_status: z.string(),
  customer_id: z.string(),
  custom_customer_id: z.string(),
  customerInfo: z.object({
    customer_name: z.string(),
    customer_address: z.string(),
    contact_no: z.string(),
    alternative_contact_no: z.string(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  }),
  merchant_id: z.string(),
  custom_merchant_id: z.string(),
  merchantInfo: z.object({
    shop_name: z.string(),
    shop_address: z.string(),
    contact_no: z.string(),
    alternative_contact_no: z.string(),
  }),
  orderItems: z.array(orderItem),
  subTotal: z.number(),
  less_amount: z.number(),
  vatAmount: z.number(),
  deliveryCharge: z.number(),
  totalAmount: z.number(),
  paymet_method: z.string(),
  shortNote: z.string(),
  customer_rating: z.number(),
  customer_review: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Order = z.infer<typeof order>;

export const placeOrderResult = ok(order).extend({ order_id: z.string() });
