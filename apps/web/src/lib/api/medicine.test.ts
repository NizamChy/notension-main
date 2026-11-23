import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { MEDICINE_URL } from "@/api-endpoints/env";
import { DEMO_LOCATIONS } from "@/demo/demoLocations";
import { DEMO_MEDICINE_STORES, MEDICINE_CUSTOM_TYPES } from "@/demo/modules/medicine";
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
  type MedicineExplore,
} from "./medicine";
import { storeStatusOf, type StoreRef } from "./grocery";

const dhaka = DEMO_LOCATIONS[0];
type DemoStore = { _id: string; custom_store_id: string; shop_name: string; district_id: string; is_closed: boolean };
const stores = DEMO_MEDICINE_STORES as DemoStore[];
const demoStore = stores.find((s) => s.district_id === dhaka.districtId && !s.is_closed)!;
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

describe("medicine API on the demo adapter", () => {
  it("every demo medicine answer matches the contract", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const nearest = await getNearestStores({
      lat: String(dhaka.latitude),
      lng: String(dhaka.longitude),
      districtId: dhaka.districtId,
    });
    expect(nearest.length).toBeGreaterThan(0);
    expect((await searchStores(demoStore.shop_name.slice(0, 4))).length).toBeGreaterThan(0);

    const explore = (await exploreStore(ref)) as MedicineExplore;
    expect(explore.ShopDetails).toHaveLength(1);
    expect(storeStatusOf(explore)).toBeNull();

    const sub = explore.ProductSubTypeByShop[0].subtypeInfo._id;
    expect((await getItemPage(ref, { kind: "sub-type", id: sub }, 1)).length).toBeGreaterThan(0);
    const custom = await getItemPage(
      ref,
      { kind: "custom-type", id: MEDICINE_CUSTOM_TYPES.popularItem },
      1,
    );
    const title = explore.popularItem[0].item_title_eng.slice(0, 4);
    expect((await getItemPage(ref, { kind: "search", text: title }, 1)).length).toBeGreaterThan(0);

    const listed = custom[0] ?? explore.popularItem[0];
    const item = await getItem(ref, listed._id);
    expect(item?._id).toBe(listed._id);

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
    expect(await getItem(ref, "66a1ffffffffffffffffffff")).toBeNull();
  });

  it("getItemPage sends today's params", async () => {
    const get = vi.spyOn(getApiClient(MEDICINE_URL), "get");
    await getItemPage(ref, { kind: "search", text: "na" }, 2);
    await getItemPage(ref, { kind: "sub-type", id: "s1" }, 1);
    await getItemPage(ref, { kind: "custom-type", id: "c1" }, 3);
    const keys = get.mock.calls.map((c) =>
      Object.keys((c[1] as { params: object }).params).sort(),
    );
    const base = ["custom_store_id", "merchantId", "page"];
    expect(keys).toEqual([
      [...base, "search"].sort(),
      [...base, "productSubtype"].sort(),
      [...base, "customType"].sort(),
    ]);
  });

  it("gives closed for a closed demo pharmacy", async () => {
    const closed = stores.find((s) => s.is_closed);
    if (!closed) return; // no closed demo pharmacy
    const res = await exploreStore({ storeId: closed._id, customStoreId: closed.custom_store_id });
    expect(storeStatusOf(res)).toBe("closed");
  });

  it("has medicine query keys", () => {
    expect(queryKeys.medicine.store("a", "b")).toEqual(["medicine", "store", "a", "b"]);
  });
});
