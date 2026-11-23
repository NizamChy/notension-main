// The medicine API as the web app reads it today (legacy field names, see
// apps/web/src/demo/modules/medicine.ts). The API builds these shapes and the
// tests validate every response against them.
import { z } from "zod";
import { order as groceryOrder } from "./grocery";

const id = z.string().regex(/^[0-9a-f]{24}$/, "24-char hex id");
const lessType = z.enum(["Percent", "Flat"]);

export const MEDICINE_CUSTOM_TYPE_IDS = {
  specialOffer: "65128cbd20db0921f13b40b3",
  dealOfTheDay: "64ec724d538280d7999a2d39",
  popularItem: "651284f9330595b483e38d73",
} as const;

// The legacy API wraps the four slider lists in one record with its own id.
export const MEDICINE_SLIDER_ID = "66a600000000000000000064";

export const PAGE_SIZE = 24;

export const medicineStore = z.object({
  _id: id,
  custom_store_id: z.string(),
  shop_name: z.string(),
  shop_address: z.string(),
  contact_no: z.string().nullable(),
  alternative_contact_no: z.string().nullable(),
  district_id: id,
  district_name: z.string(),
  district_area_name: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  location: z.object({ type: z.literal("Point"), coordinates: z.tuple([z.number(), z.number()]) }),
  shop_banner_app: z.string().nullable(),
  shop_banner_web: z.string().nullable(),
  is_active: z.boolean(),
  is_banned: z.boolean(),
  is_closed: z.boolean(),
  show_product_price: z.boolean(),
  delivery_notice: z.string(),
  min_purchage_amount: z.number(),
  min_delivery_charge: z.number(),
  max_delivery_charge: z.number(),
  less: z.number(),
  less_type: lessType,
  maximum_less: z.number(),
  minimum_order_for_less: z.number(),
  merchant_type: z.number(),
  opening_time: z.string().nullable(),
  closing_time: z.string().nullable(),
});
export type MedicineStore = z.infer<typeof medicineStore>;

// `distance` (metres) is left out when the request had no position.
export const medicineNearbyStore = medicineStore.extend({ distance: z.number().optional() });

export const medicineItem = z.object({
  _id: id,
  medStoreProductInfo: id,
  merchantId: id,
  custom_store_id: z.string(),
  item_title_eng: z.string(),
  item_title_beng: z.string().nullable(),
  product_title_beng: z.string().nullable(),
  generic_name: z.string(),
  company_name: z.string(),
  strength: z.string(),
  pack_size: z.string().nullable(),
  unit_symbol: z.string().nullable(),
  max_retail_price: z.number(),
  less: z.number(),
  less_type: lessType,
  sale_price: z.number(),
  purchase_price: z.number(),
  prescription_required: z.boolean(),
  productType: id.nullable(),
  productSubtype: id.nullable(),
  customType: z.array(id),
  app_image: z.string().nullable(),
  web_image: z.string().nullable(),
  max_allowed: z.number(),
  stock_qty: z.number(),
  is_available: z.boolean(),
  is_active: z.boolean(),
});
export type MedicineItem = z.infer<typeof medicineItem>;

const slide = z.object({ _id: id, file_name: z.string() });

export const medicineExplore = z.object({
  storeId: z.string(),
  customstoreId: z.string(),
  ShopDetails: z.array(medicineStore).max(1),
  ProductTypeByShop: z.array(
    z.object({
      _id: id,
      typeInfo: id,
      custom_type_id: z.string(),
      typeName: z.string(),
      statusType: z.enum(["General", "Custom"]),
    }),
  ),
  ProductSubTypeByShop: z.array(
    z.object({
      _id: id,
      typeInfo: id,
      sub_type_name: z.string(),
      subtypeInfo: z.object({ _id: id, sub_type_name: z.string(), banner_type_1: z.string().nullable() }),
    }),
  ),
  DashboardSlider: z.array(
    z.object({
      _id: id,
      first_slider: z.array(slide),
      second_slider: z.array(slide),
      third_slider: z.array(slide),
      fourth_slider: z.array(slide),
    }),
  ),
  specialOfferItem: z.array(medicineItem),
  dealOfTheDay: z.array(medicineItem),
  popularItem: z.array(medicineItem),
});
export type MedicineExplore = z.infer<typeof medicineExplore>;

// Every medicine response carries message "OK" unless it says otherwise.
export const ok = <T extends z.ZodType>(result: T) =>
  z.object({ success: z.literal(true), message: z.string(), result });

// ------------------------------------------------------------------ inputs

const text = z.string().optional().catch(undefined);
const coord = z.union([z.string(), z.number()]).optional().catch(undefined);

// The web app posts shop_latitude/shop_longitude; latitude/longitude work too.
// Query and body are merged, as in the old API.
export const nearbyStoresInput = z.object({
  districtId: z.string().catch(""),
  shop_latitude: coord,
  shop_longitude: coord,
  latitude: coord,
  longitude: coord,
});

// page: like parseInt, anything unreadable is page 1.
const page = z.preprocess((v) => Math.max(1, parseInt(String(v ?? ""), 10) || 1), z.number().int());

export const storeRefInput = z.object({
  merchantId: text,
  storeId: text,
  custom_store_id: text,
  page,
});

// ------------------------------------------------------------------ orders

// Same body as grocery: `orderObj` (JSON string) with the store, item ids and
// quantities; amounts are computed by the API.
export { placeOrderInput, type PlaceOrderInput } from "./grocery";

export const orderItem = z.object({
  _id: z.string(),
  medStoreProductInfo: z.string().nullable(),
  item_title_eng: z.string(),
  item_title_beng: z.string().nullable(),
  pack_size: z.string().nullable(),
  purchase_price: z.number(),
  max_retail_price: z.number(),
  sale_price: z.number(),
  unit_symbol: z.string().nullable(),
  max_allowed: z.number(),
  quantity: z.number(),
  delivered_qty: z.number(),
  inc_qty: z.number(),
  app_image: z.string().nullable(),
});

export const order = groceryOrder.extend({ orderItems: z.array(orderItem) });
export type Order = z.infer<typeof order>;
