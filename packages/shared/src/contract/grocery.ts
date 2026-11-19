// The grocery API as the web app reads it today (legacy field names). The API
// builds these shapes and tests validate every response against them, so a
// change to the contract shows up as a type error on both sides.
import { z } from "zod";

const id = z.string().regex(/^[0-9a-f]{24}$/, "24-char hex id");
const lessType = z.enum(["Percent", "Flat"]);

export const GROCERY_CUSTOM_TYPE_IDS = {
  specialOffer: "64f5a306baa57a4707524d6e",
  dealOfTheDay: "6525306cf79d9e77f12a2a63",
  popularItem: "64f5b63a256e0838327efaef",
} as const;

export const PAGE_SIZE = 24;

export const groceryStore = z.object({
  _id: id,
  custom_store_id: z.string(),
  shop_name: z.string(),
  shop_address: z.string(),
  contact_no: z.string().nullable(),
  alternative_contact_no: z.string().nullable(),
  districtId: id,
  district_name: z.string(),
  district_area_name: z.string().nullable(),
  shop_latitude: z.number(),
  shop_longitude: z.number(),
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
export type GroceryStore = z.infer<typeof groceryStore>;

export const groceryNearbyStore = groceryStore.extend({ distance: z.number() });

export const groceryItem = z.object({
  _id: id,
  productInfoTable: id,
  groceryStoreId: id,
  custom_store_id: z.string(),
  slug: z.string(),
  product_title_eng: z.string(),
  product_title_beng: z.string().nullable(),
  pack_size: z.string().nullable(),
  unit_symbol: z.string().nullable(),
  max_retail_price: z.number(),
  sale_price: z.number(),
  purchase_price: z.number(),
  productType: id.nullable(),
  productSubtype: id.nullable(),
  customType: z.array(id),
  app_image: z.string().nullable(),
  is_available: z.boolean(),
  stock_qty: z.number(),
  less: z.number(),
  less_type: lessType,
  max_allowed: z.number(),
});
export type GroceryItem = z.infer<typeof groceryItem>;

const slide = z.object({ _id: id, file_name: z.string() });

export const groceryExplore = z.object({
  storeId: id,
  customstoreId: z.string(),
  ShopDetails: z.array(groceryStore).length(1),
  ProductTypeByShop: z.array(
    z.object({
      _id: z.string(),
      storeInfo: id,
      typeInfo: id,
      custom_type_id: z.string(),
      typeName: z.string(),
      statusType: z.enum(["General", "Custom"]),
    }),
  ),
  ProductSubTypeByShop: z.array(
    z.object({
      _id: z.string(),
      storeInfo: id,
      typeInfo: id,
      sub_type_name: z.string(),
      subtypeInfo: z.object({
        _id: id,
        sub_type_name: z.string(),
        custom_sub_type_id: z.string(),
        banner_type_1: z.string().nullable(),
      }),
    }),
  ),
  DashboardSlider: z.array(
    z.object({
      first_slider: z.array(slide),
      second_slider: z.array(slide),
      third_slider: z.array(slide),
      fourth_slider: z.array(slide),
    }),
  ),
  specialOfferItem: z.array(groceryItem),
  dealOfTheDay: z.array(groceryItem),
  popularItem: z.array(groceryItem),
});
export type GroceryExplore = z.infer<typeof groceryExplore>;

// Request inputs.
export const nearbyStoresInput = z.object({
  districtId: z.string().default(""),
  shop_latitude: z.coerce.number().optional(),
  shop_longitude: z.coerce.number().optional(),
});
export const storeRefInput = z.object({
  groceryStoreId: z.string().optional(),
  storeId: z.string().optional(),
  custom_store_id: z.string().optional(),
  page: z.coerce.number().int().catch(1).default(1),
});

export const ok = <T extends z.ZodType>(result: T) =>
  z.object({ success: z.literal(true), result, message: z.string().optional() });
