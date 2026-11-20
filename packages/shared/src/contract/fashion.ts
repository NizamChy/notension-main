// The fashion & lifestyle API as the web app reads it (legacy field names,
// src/components/FashionLifestyle). The API builds these shapes and tests
// validate every response against them.
import { z } from "zod";

const id = z.string().regex(/^[0-9a-f]{24}$/, "24-char hex id");

export const ok = <T extends z.ZodType>(data: T) =>
  z.object({ success: z.literal(true), message: z.string(), data });

// ------------------------------------------------------------- catalogue

export const fashionType = z.object({
  _id: id,
  type_name: z.string(),
  type_img: z.string().nullable(),
  serial_no: z.number(),
  status: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// `type_info` is a plain id here.
export const fashionCategory = z.object({
  _id: id,
  category_name: z.string(),
  type_info: id,
  banner: z.string().nullable(),
  serial_no: z.number(),
  status: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const fashionSubCategory = z.object({
  _id: id,
  sub_category_name: z.string(),
  type_info: id,
  category_info: z.object({
    _id: id,
    category_name: z.string(),
    type_info: id,
    banner: z.string().nullable(),
  }),
  banner_type_1: z.string().nullable(),
  banner_type_2: z.string().nullable(),
  serial_no: z.number(),
  status: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const fashionBrand = z.object({ _id: id, brand_name: z.string(), status: z.boolean() });
export type FashionBrand = z.infer<typeof fashionBrand>;

export const fashionStore = z.object({
  _id: id,
  custom_merchant_id: z.string(),
  shop_name: z.string(),
  shop_address: z.string(),
  contact_no: z.string().nullable(),
  alternative_contact_no: z.string().nullable(),
  shop_banner_web: z.string().nullable(),
  shop_banner_app: z.string().nullable(),
  shop_logo: z.string().nullable(),
  isShowingMsg: z.boolean(),
  popup_message: z.string(),
  status: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type FashionStore = z.infer<typeof fashionStore>;

// The store as embedded in a product.
export const fashionProductStore = fashionStore.pick({
  _id: true,
  custom_merchant_id: true,
  shop_name: true,
  shop_address: true,
  contact_no: true,
  alternative_contact_no: true,
  shop_banner_web: true,
  shop_banner_app: true,
});

// Variants: `sizes` and `colors` are comma-separated ("S,M,L", "Navy,White";
// sizes is "" for one-size items). `images_by_color` has one photo per colour,
// in the same order, or is empty when the product has no colour photos.
export const fashionProduct = z.object({
  _id: id,
  product_code: z.string(),
  product_title_eng: z.string(),
  product_title_beng: z.string().nullable(),
  type_info: z.object({ _id: id, type_name: z.string() }),
  category_info: z.object({ _id: id, category_name: z.string() }),
  sub_category_info: z.object({ _id: id, sub_category_name: z.string() }),
  brand_info: fashionBrand.nullable(),
  store_info: fashionProductStore,
  web_image: z.string().nullable(),
  app_image: z.string().nullable(),
  images_by_color: z.array(z.string()),
  detail_product_image: z.array(z.string()),
  sizes: z.string(),
  colors: z.string(),
  max_retail_price: z.number(),
  sale_price: z.number(),
  purchase_price: z.number(),
  unit_symbol: z.string().nullable(),
  max_allowed: z.number(),
  stock_qty: z.number(),
  is_popular: z.boolean(),
  new: z.boolean(),
  bestseller: z.boolean(),
  featured: z.boolean(),
  rating: z.number(),
  reviews: z.number(),
  description: z.string(),
  specification: z.string(),
  size_chart: z.string().nullable(),
  status: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type FashionProduct = z.infer<typeof fashionProduct>;

// PUT /api/v1/kids-product/product-info-by-type/:typeId. Every filter is
// optional; empty values ("", null) mean "any".
const anyValue = z.unknown().optional();
export const productFilterInput = z
  .object({
    store_id: anyValue,
    category_info: anyValue,
    sub_category_info: anyValue,
    is_popular: anyValue,
    search_text: anyValue,
  })
  .catch({});
export type ProductFilterInput = z.infer<typeof productFilterInput>;

// The taxonomy a store sells (`_id` is the store/entity link id).
export const storeType = z.object({
  _id: id,
  store_info: id,
  type_info: z.object({ _id: id, type_name: z.string(), type_img: z.string().nullable() }),
});

export const storeCategory = z.object({
  _id: id,
  store_info: id,
  type_info: id,
  category_info: z.object({
    _id: id,
    category_name: z.string(),
    banner: z.string().nullable(),
    type_info: id,
  }),
});

export const storeSubCategory = z.object({
  _id: id,
  store_info: id,
  type_info: id,
  category_info: id,
  sub_category_info: z.object({
    _id: id,
    sub_category_name: z.string(),
    banner_type_1: z.string().nullable(),
    banner_type_2: z.string().nullable(),
  }),
});

// Id of a store/entity link (24 hex chars, stable per pair).
export const linkId = (entityId: string, storeId: string) =>
  `${entityId.slice(0, 8)}${entityId.slice(-8)}${storeId.slice(-8)}`;

// ---------------------------------------------------------------- orders

// What the checkout posts, one order per store. Only the store, the product
// ids with quantity and chosen variant (size, colour or colour photo),
// payment method, note and delivery details are used: prices, totals and the
// customer come from the server.
const text = (max: number) => z.string().trim().max(max);
export const placeOrderInput = z.object({
  merchant_id: z.string().min(1),
  orderItems: z
    .array(
      z
        .object({
          _id: z.string().min(1),
          quantity: z.coerce.number().int().positive().max(1000),
          product_size: text(40).nullish().catch(null),
          product_color: text(40).nullish().catch(null),
          ordered_img: text(300).nullish().catch(null),
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
  _id: z.string(), // the product id
  type_info: z.string().nullable(),
  brand_info: fashionBrand.nullable(),
  product_title_eng: z.string(),
  product_title_beng: z.string().nullable(),
  product_size: z.string().nullable(),
  product_color: z.string().nullable(),
  purchase_price: z.number(), // what the customer paid per unit
  max_retail_price: z.number(),
  sale_price: z.number(),
  unit_symbol: z.string().nullable(),
  max_allowed: z.number(),
  quantity: z.number(),
  delivered_qty: z.number(),
  inc_qty: z.number(),
  ordered_img: z.string().nullable(),
  app_image: z.string().nullable(),
  web_image: z.string().nullable(),
});

export const order = z.object({
  _id: z.string(),
  order_id: z.string(),
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
  shortNote: z.string(),
  paymet_method: z.string(),
  order_status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Order = z.infer<typeof order>;

export const placeOrderResult = z.object({
  success: z.literal(true),
  message: z.string(),
  data: order,
  result: order,
});

export const ordersResult = z.object({
  success: z.literal(true),
  message: z.string(),
  result: z.array(order),
});
