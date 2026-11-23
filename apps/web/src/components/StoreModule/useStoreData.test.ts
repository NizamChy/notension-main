import { describe, expect, it } from "vitest";
import { EXPLORE_GROCERY_STORE, EXPLORE_MEDICINE_STORE } from "@/api-endpoints/api-endpoint";
import { DEMO_ROUTES } from "@/demo/routes";
import { DEMO_GROCERY_STORES } from "@/demo/modules/grocery/data";
import { DEMO_MEDICINE_STORES } from "@/demo/modules/medicine/data";
import { storeStatusOf, type ExploreResult } from "@/lib/api/grocery";
import { toStoreData } from "./useStoreData";

type DemoStore = { _id: string; custom_store_id: string; is_closed: boolean };
type Handler = (req: { query: Record<string, string> }) => { result: ExploreResult };

const explore = (s: DemoStore): ExploreResult => {
  const route = (DEMO_ROUTES as { service: string; path: string; handler: Handler }[]).find(
    (r) => r.service === "GROCERY" && r.path === EXPLORE_GROCERY_STORE,
  )!;
  return route.handler({ query: { storeId: s._id, custom_store_id: s.custom_store_id } }).result;
};

const stores = DEMO_GROCERY_STORES as DemoStore[];

describe("toStoreData", () => {
  it("defaults showProductPrice to true when the shop leaves it out", () => {
    const data = explore(stores.find((x) => !x.is_closed)!) as {
      ShopDetails: Record<string, unknown>[];
    };
    const { show_product_price: _omit, ...shop } = data.ShopDetails[0];
    const without = { ...data, ShopDetails: [shop] } as unknown as ExploreResult;
    expect(toStoreData(without).showProductPrice).toBe(true);
  });

  it("gives empty data for no store or a closed store", () => {
    const closed = explore(stores.find((x) => x.is_closed)!);
    for (const value of [undefined, closed]) {
      const got = toStoreData(value);
      expect(got.store).toEqual({});
      expect(got.typeInfo).toEqual([]);
      expect(got.popularItem).toEqual([]);
      expect(got.showProductPrice).toBe(true);
      expect(got.storeRef).toEqual({ merchantId: "", customstore_id: "" });
    }
  });
});
