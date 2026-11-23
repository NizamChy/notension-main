import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { FOOD_URL } from "@/api-endpoints/env";
import { DEMO_LOCATIONS } from "@/demo/demoLocations";
import { DEMO_FOOD_ITEMS, DEMO_FOOD_STORES } from "@/demo/modules/food";
import { resetWarnedEndpoints } from "./validate";
import { queryKeys } from "./queryKeys";
import {
  exploreModule,
  exploreStore,
  foodStoreStatusOf,
  getNearestStores,
  getOrders,
  placeOrder,
  searchStores,
  type FoodExplore,
} from "./food";

const dhaka = DEMO_LOCATIONS[0];
type DemoStore = {
  _id: string;
  custom_store_id: string;
  shop_name: string;
  district_id: string;
  is_closed: boolean;
};
const stores = DEMO_FOOD_STORES as DemoStore[];
const open = stores.find((s) => s.district_id === dhaka.districtId && !s.is_closed)!;
const closed = stores.find((s) => s.is_closed)!;
const ref = { storeId: open._id, customStoreId: open.custom_store_id };

beforeEach(() => {
  const store = new Map([["notension-sample-data", "on"]]);
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    },
  });
  resetWarnedEndpoints();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("food API on the demo adapter", () => {
  it("every demo food answer matches the contract", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const mod = await exploreModule(dhaka.districtId);
    expect(mod.shopCategory.length).toBeGreaterThan(0);
    const category = mod.shopCategory[0];

    const loc = { lat: String(dhaka.latitude), lng: String(dhaka.longitude), districtId: dhaka.districtId };
    expect((await getNearestStores(category, loc)).length).toBeGreaterThan(0);
    await searchStores(open.shop_name.slice(0, 4), category._id);

    const explore = (await exploreStore(ref)) as FoodExplore;
    expect(explore.shopDetails).toHaveLength(1);
    expect(foodStoreStatusOf(explore)).toBeNull();
    expect(explore.allProduct.length).toBeGreaterThan(0);

    const dish = (DEMO_FOOD_ITEMS as { _id: string; storeId: string }[]).find(
      (i) => i.storeId === open._id,
    )!;
    const placed = await placeOrder({
      merchant_id: open._id,
      orderItems: [{ _id: dish._id, quantity: 1 }],
      customerInfo: { customer_name: "Test" },
    });
    expect(placed.success).toBe(true);

    await getOrders({ _id: "6650f1000000000000000001", custom_id: "C1" });

    expect(warn.mock.calls.map((c) => String(c[0]))).toEqual([]);
  });

  it('gives "closed" for a closed restaurant and "missing" for an unknown one', async () => {
    const res = await exploreStore({ storeId: closed._id, customStoreId: closed.custom_store_id });
    expect(foodStoreStatusOf(res)).toBe("closed");
    const missing = await exploreStore({ storeId: "20ffffffffffffffffffffff", customStoreId: "X" });
    expect(foodStoreStatusOf(missing)).toBe("missing");
  });

  it("sends today's nearest-store params", async () => {
    const post = vi
      .spyOn(getApiClient(FOOD_URL), "post")
      .mockResolvedValue({ data: { success: true, status: 200, message: "OK", result: [] }, headers: {} });
    await getNearestStores({ _id: "c1", regularDistance: 3000 }, { lat: "1", lng: "2", districtId: "d" });
    expect(post.mock.calls[0][1]).toEqual({
      shop_longitude: "2",
      shop_latitude: "1",
      max_distance: 3000,
      StoreCategory: "c1",
      district_id: "d",
    });
  });

  it("has food query keys", () => {
    expect(queryKeys.food.store("a", "b")).toEqual(["food", "store", "a", "b"]);
  });
});
