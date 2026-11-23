import { z } from "zod";
import { fashion } from "@notension/shared";
import {
  ALL_BRAND,
  ALL_CATEGORY,
  ALL_CATEGORY_BY_STORE,
  ALL_ORDER_BY_CUSTOMER,
  ALL_SUB_CATEGORY,
  ALL_SUB_CATEGORY_BY_STORE,
  ALL_TYPE,
  ALL_TYPE_BY_STORE,
  CREATE_ORDER,
  KIDS_PRODUCT_BY_TYPE,
  SINGLE_STORE_INFO,
} from "@/api-endpoints/api-endpoint";
import { apiGet, apiPost, apiPut } from "./request";

// The fashion & lifestyle API: the same calls and bodies the old fetchData
// helpers in components/FashionLifestyle/hooks/fetchData made.

export type FashionType = z.infer<typeof fashion.fashionType>;
export type FashionCategory = z.infer<typeof fashion.fashionCategory>;
export type FashionSubCategory = z.infer<typeof fashion.fashionSubCategory>;
export type FashionBrand = fashion.FashionBrand;
export type FashionStore = fashion.FashionStore;
export type FashionProduct = fashion.FashionProduct;
export type FashionOrder = fashion.Order;
export type StoreType = z.infer<typeof fashion.storeType>;
export type StoreCategory = z.infer<typeof fashion.storeCategory>;
export type StoreSubCategory = z.infer<typeof fashion.storeSubCategory>;

/** Body of the product filter; an empty value (null, "") means "any". */
export type ProductFilter = {
  store_id?: string | null;
  category_info?: string | null;
  sub_category_info?: string | null;
  is_popular?: boolean;
  search_text?: string | null;
};

const list = <T extends z.ZodType>(item: T) => fashion.ok(z.array(item));

export const getTypes = async (): Promise<FashionType[]> =>
  (await apiGet("FASHION", ALL_TYPE, list(fashion.fashionType))).data;

export const getCategories = async (): Promise<FashionCategory[]> =>
  (await apiGet("FASHION", ALL_CATEGORY, list(fashion.fashionCategory))).data;

export const getSubCategories = async (): Promise<FashionSubCategory[]> =>
  (await apiGet("FASHION", ALL_SUB_CATEGORY, list(fashion.fashionSubCategory))).data;

export const getBrands = async (): Promise<FashionBrand[]> =>
  (await apiGet("FASHION", ALL_BRAND, list(fashion.fashionBrand))).data;

/** Products of a type, narrowed by the filter (PUT product-info-by-type). */
export const filterProducts = async (
  typeId: string,
  filter: ProductFilter = {},
): Promise<FashionProduct[]> =>
  (await apiPut("FASHION", `${KIDS_PRODUCT_BY_TYPE}/${typeId}`, filter, list(fashion.fashionProduct)))
    .data;

/** Finds a product by id. There is no product endpoint, so it searches every type. */
export async function findProduct(productId: string): Promise<FashionProduct | null> {
  const types = await getTypes();
  const byType = await Promise.all(types.map((t) => filterProducts(t._id)));
  return byType.flat().find((p) => p._id === productId) ?? null;
}

export const getStore = async (storeId: string): Promise<FashionStore> =>
  (await apiGet("FASHION", `${SINGLE_STORE_INFO}/${storeId}`, fashion.ok(fashion.fashionStore))).data;

export const getStoreTypes = async (storeId: string): Promise<StoreType[]> =>
  (await apiGet("FASHION", `${ALL_TYPE_BY_STORE}/${storeId}`, list(fashion.storeType))).data;

export const getStoreCategories = async (storeId: string): Promise<StoreCategory[]> =>
  (await apiGet("FASHION", `${ALL_CATEGORY_BY_STORE}/${storeId}`, list(fashion.storeCategory))).data;

export const getStoreSubCategories = async (storeId: string): Promise<StoreSubCategory[]> =>
  (await apiGet("FASHION", `${ALL_SUB_CATEGORY_BY_STORE}/${storeId}`, list(fashion.storeSubCategory)))
    .data;

/** Places one store's order (the checkout posts one per store). */
export const placeOrder = async (body: unknown): Promise<FashionOrder> =>
  (await apiPost("FASHION", CREATE_ORDER, body, fashion.placeOrderResult)).result;

export const getOrders = async (customer: {
  customerId: string;
  customId: string;
}): Promise<FashionOrder[]> =>
  (
    await apiPost(
      "FASHION",
      ALL_ORDER_BY_CUSTOMER,
      { customer_id: customer.customerId, custom_customer_id: customer.customId },
      fashion.ordersResult,
    )
  ).result;
