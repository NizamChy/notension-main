import { z } from "zod";
import { food } from "@notension/shared";
import {
  EXPLORE_FOOD_MODULE,
  EXPLORE_FOOD_STORE,
  FOOD_ORDER_INFO,
  FOOD_PLACE_ORDER,
  NEAREST_FOOD_STORE,
  SEARCH_FOOD_STORE,
} from "@/api-endpoints/api-endpoint";
import { apiGet, apiPost } from "./request";
import type { StoreRef, StoreStatus } from "./grocery";
import { placeOrderResponse } from "./schemas/groceryOrder";

// The food API, the same calls and params the old useFood / useOrderFood made.

export type StoreCategory = food.StoreCategory;
export type FoodStore = food.FoodStore;
export type FoodNearbyStore = z.infer<typeof food.nearbyStore>;
export type FoodItem = food.FoodItem;
export type FoodExplore = food.ExploreStore;
export type FoodOrder = food.Order;
export type FoodModule = z.infer<typeof food.exploreModule>;

// Web-only: what explore-store answers for a missing, closed, inactive or
// banned restaurant. Food names the shop list `shopDetails` (lowercase), so
// the grocery schema does not fit; the shared contract stays strict.
const unavailableExplore = z
  .object({
    success: z.boolean(),
    result: z.object({ shopDetails: z.array(z.object({}).passthrough()) }).passthrough(),
  })
  .passthrough()
  .refine(({ result }) => {
    const shop = result.shopDetails[0] as
      | { is_closed?: boolean; is_active?: boolean; is_banned?: boolean }
      | undefined;
    return !shop || shop.is_closed === true || shop.is_active === false || shop.is_banned === true;
  }, "not a missing or unavailable restaurant");

export type FoodExploreResult = FoodExplore | z.infer<typeof unavailableExplore>["result"];

const exploreResponse = z.union([food.ok(food.exploreStore), unavailableExplore]);

// Same rule as the old useFood.exploreStore.
export function foodStoreStatusOf(explore: FoodExploreResult | undefined): StoreStatus {
  if (!explore) return null;
  const shop = explore.shopDetails?.[0] as
    | { _id?: string; is_closed?: boolean; is_active?: boolean; is_banned?: boolean }
    | undefined;
  if (shop?.is_closed || !shop?.is_active || shop?.is_banned) {
    return shop?._id ? "closed" : "missing";
  }
  return null;
}

export async function exploreModule(districtId: string): Promise<FoodModule> {
  const res = await apiGet("FOOD", EXPLORE_FOOD_MODULE, food.ok(food.exploreModule), {
    district_id: districtId,
  });
  return res.result;
}

export async function getNearestStores(
  category: { _id: string; regularDistance?: number },
  loc: { lat: string; lng: string; districtId: string },
): Promise<FoodNearbyStore[]> {
  const res = await apiPost(
    "FOOD",
    NEAREST_FOOD_STORE,
    {
      shop_longitude: loc.lng,
      shop_latitude: loc.lat,
      max_distance: category.regularDistance,
      StoreCategory: category._id,
      district_id: loc.districtId,
    },
    food.ok(z.array(food.nearbyStore)),
  );
  return res.result;
}

export async function searchStores(text: string, categoryId: string): Promise<FoodStore[]> {
  const res = await apiGet("FOOD", SEARCH_FOOD_STORE, food.ok(z.array(food.foodStore)), {
    search: text,
    StoreCategory: categoryId,
  });
  return res.result;
}

export async function exploreStore(ref: StoreRef): Promise<FoodExploreResult> {
  const res = await apiGet("FOOD", EXPLORE_FOOD_STORE, exploreResponse, {
    storeId: ref.storeId,
    custom_store_id: ref.customStoreId,
  });
  return res.result;
}

export async function placeOrder(body: unknown): Promise<{ success: boolean; message?: string }> {
  return apiPost("FOOD", FOOD_PLACE_ORDER, body, placeOrderResponse);
}

export async function getOrders(customer: { _id: string; custom_id?: string }): Promise<FoodOrder[]> {
  const res = await apiGet("FOOD", FOOD_ORDER_INFO, food.ok(z.array(food.order)), {
    customerId: customer._id,
    custom_customerId: customer.custom_id,
  });
  return res.result;
}
