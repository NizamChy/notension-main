import { describe, expect, it } from "vitest";
import { EXPLORE_GROCERY_STORE, EXPLORE_MEDICINE_STORE } from "@/api-endpoints/api-endpoint";
import { DEMO_ROUTES } from "@/demo/routes";
import { DEMO_GROCERY_STORES } from "@/demo/modules/grocery/data";
import { DEMO_MEDICINE_STORES } from "@/demo/modules/medicine/data";
import dashboardReducer, { handleDashboardReducer } from "@/redux/dashboardReducer";
import itemsByStoreReducer, { handleItemsByStoreReducer } from "@/redux/items-by-shop";
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
  it("toStoreData matches the old reducers", () => {
    for (const s of stores.filter((x) => !x.is_closed)) {
      const data = explore(s);
      const dashboard = dashboardReducer(
        undefined,
        handleDashboardReducer({ type: "EXPLORE_STORE", data }),
      );
      const items = itemsByStoreReducer(
        undefined,
        handleItemsByStoreReducer({ type: "EXPLORE_STORE_ITEMS", data }),
      );

      const got = toStoreData(data);
      expect(got.store).toEqual(dashboard.visitedGroceryStore);
      expect(got.typeInfo).toEqual(dashboard.typeInfo);
      expect(got.typeInfoByShop).toEqual(dashboard.typeInfoByShop);
      expect(got.subtypeInfoByShop).toEqual(dashboard.subtypeInfoByShop);
      expect(got.slider).toEqual(dashboard.DashboardSlider);
      expect(got.showProductPrice).toBe(dashboard.showProductPrice);
      expect(got.specialOfferItem).toEqual(items.specialOfferItem);
      expect(got.dealOfTheDay).toEqual(items.dealOfTheDay);
      expect(got.popularItem).toEqual(items.popularItem);
      expect(got.storeRef).toEqual({
        merchantId: items.merchantId,
        customstore_id: items.customstore_id,
      });
      // The mapping really ran: a General type carries its sub-types.
      expect(got.typeInfo.some((t) => t.subtype.length > 0)).toBe(true);
    }
  });

  it("defaults showProductPrice to true when the shop leaves it out", () => {
    const data = explore(stores.find((x) => !x.is_closed)!) as {
      ShopDetails: Record<string, unknown>[];
    };
    const { show_product_price: _omit, ...shop } = data.ShopDetails[0];
    const without = { ...data, ShopDetails: [shop] } as unknown as ExploreResult;
    expect(toStoreData(without).showProductPrice).toBe(true);
  });

  it("matches the old medicine reducers (EXPLORE_MED_STORE)", () => {
    const route = (DEMO_ROUTES as { service: string; path: string; handler: Handler }[]).find(
      (r) => r.service === "MEDICINE" && r.path === EXPLORE_MEDICINE_STORE,
    )!;
    for (const s of DEMO_MEDICINE_STORES as DemoStore[]) {
      const data = route.handler({
        query: { storeId: s._id, custom_store_id: s.custom_store_id },
      }).result;
      // The old explore filled Redux only for an open pharmacy.
      if (storeStatusOf(data) !== null) continue;
      const dashboard = dashboardReducer(
        undefined,
        handleDashboardReducer({ type: "EXPLORE_MED_STORE", data }),
      );
      const items = itemsByStoreReducer(
        undefined,
        handleItemsByStoreReducer({ type: "EXPLORE_STORE_ITEMS", data }),
      );
      const got = toStoreData(data);
      expect(got.store).toEqual(dashboard.visitedMedicineStore);
      expect(got.typeInfo).toEqual(dashboard.typeInfo);
      expect(got.slider).toEqual(dashboard.DashboardSlider);
      expect(got.popularItem).toEqual(items.popularItem);
      expect(got.storeRef).toEqual({
        merchantId: items.merchantId,
        customstore_id: items.customstore_id,
      });
    }
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
