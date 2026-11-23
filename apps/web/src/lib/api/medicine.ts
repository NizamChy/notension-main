import { z } from "zod";
import { medicine } from "@notension/shared";
import {
  EXPLORE_MEDICINE_STORE,
  MEDICINE_ITEM_DETAILS,
  MEDICINE_ITEMS_BY_CUSTOMTYPE,
  MEDICINE_ITEMS_BY_SUBTYPE,
  MEDICINE_ORDER_INFO,
  MEDICINE_PLACE_ORDER,
  NEAREST_MEDICINE_STORE,
  SEARCH_MEDICINE_ITEMS,
  SEARCH_MEDICINE_STORE,
} from "@/api-endpoints/api-endpoint";
import { apiGet, apiPost } from "./request";
import type { ItemListQuery, StoreRef } from "./grocery";
import { unavailableExplore, type UnavailableExplore } from "./schemas/groceryExplore";
import { placeOrderResponse } from "./schemas/groceryOrder";

// The medicine API, the same calls and params the old useMedicine made.
// Store refs, list queries and storeStatusOf are shared with grocery.

export type MedicineStore = medicine.MedicineStore;
export type MedicineNearbyStore = z.infer<typeof medicine.medicineNearbyStore>;
export type MedicineItem = medicine.MedicineItem;
export type MedicineExplore = medicine.MedicineExplore;
export type MedicineOrder = medicine.Order;
export type MedicineExploreResult = MedicineExplore | UnavailableExplore["result"];

const exploreResponse = z.union([medicine.ok(medicine.medicineExplore), unavailableExplore]);

export async function getNearestStores(loc: {
  lat: string;
  lng: string;
  districtId: string;
}): Promise<MedicineNearbyStore[]> {
  const res = await apiPost(
    "MEDICINE",
    NEAREST_MEDICINE_STORE,
    {
      shop_longitude: loc.lng,
      shop_latitude: loc.lat,
      max_distance: 1000,
      districtId: loc.districtId,
    },
    medicine.ok(z.array(medicine.medicineNearbyStore)),
  );
  return res.result;
}

export async function searchStores(text: string): Promise<MedicineStore[]> {
  const res = await apiGet(
    "MEDICINE",
    SEARCH_MEDICINE_STORE,
    medicine.ok(z.array(medicine.medicineStore)),
    { search: text },
  );
  return res.result;
}

export async function exploreStore(ref: StoreRef): Promise<MedicineExploreResult> {
  const res = await apiGet("MEDICINE", EXPLORE_MEDICINE_STORE, exploreResponse, {
    storeId: ref.storeId,
    custom_store_id: ref.customStoreId,
  });
  return res.result;
}

export async function getItemPage(
  ref: StoreRef,
  q: ItemListQuery,
  page: number,
): Promise<MedicineItem[]> {
  const base = { merchantId: ref.storeId, custom_store_id: ref.customStoreId, page };
  let path = MEDICINE_ITEMS_BY_SUBTYPE;
  let params: Record<string, unknown>;
  if (q.kind === "search") {
    path = SEARCH_MEDICINE_ITEMS;
    params = { search: q.text, ...base };
  } else if (q.kind === "sub-type") {
    params = { ...base, productSubtype: q.id };
  } else {
    path = MEDICINE_ITEMS_BY_CUSTOMTYPE;
    params = { ...base, customType: q.id };
  }
  const res = await apiGet("MEDICINE", path, medicine.ok(z.array(medicine.medicineItem)), params);
  return res.result;
}

const itemResponse = z.union([
  medicine.ok(medicine.medicineItem),
  z.object({ success: z.literal(false), message: z.string().optional() }).passthrough(),
]);

export async function getItem(ref: StoreRef, productId: string): Promise<MedicineItem | null> {
  const res = await apiGet("MEDICINE", MEDICINE_ITEM_DETAILS, itemResponse, {
    medStoreProductInfo: productId,
    merchantId: ref.storeId,
    custom_store_id: ref.customStoreId,
  });
  return res.success ? res.result : null;
}

export async function placeOrder(body: unknown): Promise<{ success: boolean; message?: string }> {
  return apiPost("MEDICINE", MEDICINE_PLACE_ORDER, body, placeOrderResponse);
}

export async function getOrders(customer: {
  _id: string;
  custom_id?: string;
}): Promise<MedicineOrder[]> {
  const res = await apiGet("MEDICINE", MEDICINE_ORDER_INFO, medicine.ok(z.array(medicine.order)), {
    customerId: customer._id,
    custom_customerId: customer.custom_id,
  });
  return res.result;
}
