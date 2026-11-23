import { z } from "zod";
import { grocery } from "@notension/shared";
import {
  EXPLORE_GROCERY_STORE,
  GROCERY_ITEM_DETAILS,
  GROCERY_ITEMS_BY_CUSTOMTYPE,
  GROCERY_ITEMS_BY_SUBTYPE,
  GROCERY_ORDER_INFO,
  GROCERY_PLACE_ORDER,
  NEAREST_GROCERY_STORE,
  SEARCH_GROCERY_ITEMS,
  SEARCH_GROCERY_STORE,
} from "@/api-endpoints/api-endpoint";
import { apiGet, apiPost } from "./request";
import { exploreResponse, type UnavailableExplore } from "./schemas/groceryExplore";
import { placeOrderResponse } from "./schemas/groceryOrder";

export type GroceryStore = grocery.GroceryStore;
export type GroceryNearbyStore = z.infer<typeof grocery.groceryNearbyStore>;
export type GroceryItem = grocery.GroceryItem;
export type GroceryExplore = grocery.GroceryExplore;
export type Order = grocery.Order;
// A missing, closed, inactive or banned store answers with a partial record.
export type UnavailableStore = UnavailableExplore["result"];
export type ExploreResult = GroceryExplore | UnavailableStore;

export type StoreRef = { storeId: string; customStoreId: string };
export type StoreStatus = "closed" | "missing" | null;
export type ItemListQuery =
  | { kind: "search"; text: string }
  | { kind: "sub-type"; id: string }
  | { kind: "custom-type"; id: string };

// Same rule as the old useGroceryShop.exploreStore.
export function storeStatusOf(explore: ExploreResult | undefined): StoreStatus {
  if (!explore) return null;
  const shop = explore.ShopDetails?.[0] as Partial<GroceryStore> | undefined;
  if (shop?.is_closed || !shop?.is_active || shop?.is_banned) {
    return shop?._id ? "closed" : "missing";
  }
  return null;
}

export async function getNearestStores(loc: {
  lat: string;
  lng: string;
  districtId: string;
}): Promise<GroceryNearbyStore[]> {
  const res = await apiPost(
    "GROCERY",
    NEAREST_GROCERY_STORE,
    {
      shop_longitude: loc.lng,
      shop_latitude: loc.lat,
      max_distance: 1000,
      districtId: loc.districtId,
    },
    grocery.ok(z.array(grocery.groceryNearbyStore)),
  );
  return res.result;
}

export async function searchStores(text: string): Promise<GroceryStore[]> {
  const res = await apiGet(
    "GROCERY",
    SEARCH_GROCERY_STORE,
    grocery.ok(z.array(grocery.groceryStore)),
    { search: text },
  );
  return res.result;
}

export async function exploreStore(ref: StoreRef): Promise<ExploreResult> {
  const res = await apiGet("GROCERY", EXPLORE_GROCERY_STORE, exploreResponse, {
    storeId: ref.storeId,
    custom_store_id: ref.customStoreId,
  });
  return res.result;
}

export async function getItemPage(
  ref: StoreRef,
  q: ItemListQuery,
  page: number,
): Promise<GroceryItem[]> {
  const base = { groceryStoreId: ref.storeId, custom_store_id: ref.customStoreId, page };
  let path = GROCERY_ITEMS_BY_SUBTYPE;
  let params: Record<string, unknown>;
  if (q.kind === "search") {
    path = SEARCH_GROCERY_ITEMS;
    params = { search: q.text, ...base };
  } else if (q.kind === "sub-type") {
    params = { ...base, productSubtype: q.id };
  } else {
    path = GROCERY_ITEMS_BY_CUSTOMTYPE;
    params = { ...base, customType: q.id };
  }
  const res = await apiGet("GROCERY", path, grocery.ok(z.array(grocery.groceryItem)), params);
  return res.result;
}

const itemResponse = z.union([
  grocery.ok(grocery.groceryItem),
  z.object({ success: z.literal(false), message: z.string().optional() }).passthrough(),
]);

export async function getItem(ref: StoreRef, productId: string): Promise<GroceryItem | null> {
  const res = await apiGet("GROCERY", GROCERY_ITEM_DETAILS, itemResponse, {
    productInfoTable: productId,
    groceryStoreId: ref.storeId,
    custom_store_id: ref.customStoreId,
  });
  return res.success ? res.result : null;
}

export async function placeOrder(body: unknown): Promise<{ success: boolean; message?: string }> {
  return apiPost("GROCERY", GROCERY_PLACE_ORDER, body, placeOrderResponse);
}

export async function getOrders(customer: { _id: string; custom_id?: string }): Promise<Order[]> {
  const res = await apiGet("GROCERY", GROCERY_ORDER_INFO, grocery.ok(z.array(grocery.order)), {
    customerId: customer._id,
    custom_customerId: customer.custom_id,
  });
  return res.result;
}
