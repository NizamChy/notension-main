import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { GROCERY_URL } from "@/api-endpoints/env";
import { DEMO_LOCATIONS } from "@/demo/demoLocations";
import { DEMO_GROCERY_STORES, GROCERY_CUSTOM_TYPES } from "@/demo/modules/grocery";
import { resetWarnedEndpoints } from "./validate";
import { queryKeys } from "./queryKeys";
import {
  exploreStore,
  getItem,
  getItemPage,
  getNearestStores,
  getOrders,
  placeOrder,
  searchStores,
  storeStatusOf,
  type ExploreResult,
  type GroceryExplore,
  type StoreRef,
} from "./grocery";

const dhaka = DEMO_LOCATIONS[0];
const demoStore = DEMO_GROCERY_STORES.find(
  (s: { districtId: string }) => s.districtId === dhaka.districtId,
)!;
const ref: StoreRef = { storeId: demoStore._id, customStoreId: demoStore.custom_store_id };

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

describe("grocery API on the demo adapter", () => {
  it("every demo grocery answer matches the contract", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const nearest = await getNearestStores({
      lat: String(dhaka.latitude),
      lng: String(dhaka.longitude),
      districtId: dhaka.districtId,
    });
    expect(nearest.length).toBeGreaterThan(0);
    expect((await searchStores(demoStore.shop_name.slice(0, 4))).length).toBeGreaterThan(0);

    const explore = (await exploreStore(ref)) as GroceryExplore;
    expect(explore.ShopDetails).toHaveLength(1);

    const sub = explore.ProductSubTypeByShop[0].subtypeInfo._id;
    expect((await getItemPage(ref, { kind: "sub-type", id: sub }, 1)).length).toBeGreaterThan(0);
    const custom = await getItemPage(
      ref,
      { kind: "custom-type", id: GROCERY_CUSTOM_TYPES.popularItem },
      1,
    );
    const title = explore.popularItem[0].product_title_eng.slice(0, 4);
    const found = await getItemPage(ref, { kind: "search", text: title }, 1);
    expect(found.length).toBeGreaterThan(0);

    const item = await getItem(ref, (custom[0] ?? explore.popularItem[0]).productInfoTable);
    expect(item).not.toBeNull();

    const placed = await placeOrder({
      orderObj: JSON.stringify({
        merchant_id: ref.storeId,
        orderItems: [{ _id: item!._id, quantity: 1 }],
      }),
    });
    expect(placed.success).toBe(true);

    const orders = await getOrders({ _id: "6650f1000000000000000001", custom_id: "C1" });
    expect(orders.length).toBeGreaterThan(0);

    expect(warn.mock.calls.map((c) => String(c[0]))).toEqual([]);
  });

  it("getItem returns null for an unknown id", async () => {
    expect(await getItem(ref, "6650a0ffffffffffffffffff")).toBeNull();
  });

  it("getItemPage sends today's params", async () => {
    const get = vi.spyOn(getApiClient(GROCERY_URL), "get");
    await getItemPage(ref, { kind: "search", text: "ri" }, 2);
    await getItemPage(ref, { kind: "sub-type", id: "s1" }, 1);
    await getItemPage(ref, { kind: "custom-type", id: "c1" }, 3);
    const keys = get.mock.calls.map((c) =>
      Object.keys((c[1] as { params: object }).params).sort(),
    );
    const base = ["custom_store_id", "groceryStoreId", "page"];
    expect(keys).toEqual([
      [...base, "search"].sort(),
      [...base, "productSubtype"].sort(),
      [...base, "customType"].sort(),
    ]);
  });
});

describe("exploreStore for an unavailable store", () => {
  const answer = (result: object, success = false) => {
    vi.stubEnv("NODE_ENV", "development");
    vi.spyOn(getApiClient(GROCERY_URL), "get").mockResolvedValue({
      data: { success, result },
      headers: {},
    });
  };

  it("resolves for a missing store in strict (live) mode", async () => {
    answer({ ShopDetails: [] });
    const res = await exploreStore(ref);
    expect(storeStatusOf(res)).toBe("missing");
  });

  it("resolves for a closed store with a partial shop record", async () => {
    answer({ ShopDetails: [{ _id: "6650a00100000000000000a1", is_closed: true }] }, true);
    const res = await exploreStore(ref);
    expect(storeStatusOf(res)).toBe("closed");
  });

  it("still throws for a broken answer", async () => {
    answer({ ShopDetails: [{ _id: "x", is_active: true, is_closed: false, is_banned: false }] }, true);
    await expect(exploreStore(ref)).rejects.toThrow();
  });
});

describe("storeStatusOf", () => {
  const explore = (shop: object) => ({ ShopDetails: [shop] }) as unknown as ExploreResult;
  it("maps shop state to a status", () => {
    expect(
      storeStatusOf(explore({ _id: "a", is_closed: true, is_active: true, is_banned: false })),
    ).toBe("closed");
    expect(storeStatusOf(explore({ is_active: false }))).toBe("missing");
    expect(
      storeStatusOf(explore({ _id: "a", is_closed: false, is_active: true, is_banned: false })),
    ).toBeNull();
    expect(storeStatusOf(undefined)).toBeNull();
  });
});

describe("queryKeys.grocery", () => {
  it("builds keys rooted at grocery", () => {
    expect(queryKeys.grocery.store("a", "b")).toEqual(["grocery", "store", "a", "b"]);
  });
});
