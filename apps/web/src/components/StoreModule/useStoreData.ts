import { useMemo } from "react";
import { useSelector } from "react-redux";
import { storeStatusOf, type ExploreResult, type GroceryExplore } from "@/lib/api/grocery";
import { useGroceryStore } from "@/hooks/grocery/useGroceryStore";

type ProductType = GroceryExplore["ProductTypeByShop"][number];
type ProductSubType = GroceryExplore["ProductSubTypeByShop"][number];

export type TypeInfo = {
  id: string;
  custom_type_id: string;
  name: string;
  image: string;
  parent: null;
  subtype: unknown[];
};

export type StoreData = {
  store: Record<string, unknown>;
  typeInfo: TypeInfo[];
  typeInfoByShop: unknown[];
  subtypeInfoByShop: unknown[];
  slider: unknown[];
  showProductPrice: boolean;
  specialOfferItem: unknown[];
  dealOfTheDay: unknown[];
  popularItem: unknown[];
  storeRef: { merchantId: string; customstore_id: string };
  isLoading: boolean;
};

export type StoreModuleName = "grocery" | "medicine";

const EMPTY: Omit<StoreData, "isLoading"> = {
  store: {},
  typeInfo: [],
  typeInfoByShop: [],
  subtypeInfoByShop: [],
  slider: [],
  showProductPrice: true,
  specialOfferItem: [],
  dealOfTheDay: [],
  popularItem: [],
  storeRef: { merchantId: "", customstore_id: "" },
};

/**
 * The store-page data of an explore result. A copy of the old grocery explore
 * cases of dashboardReducer and items-by-shop (see the test), which ran only
 * for an open store.
 */
export function toStoreData(explore: ExploreResult | undefined): Omit<StoreData, "isLoading"> {
  if (!explore || storeStatusOf(explore) !== null) return EMPTY;
  const data = explore as GroceryExplore;
  const shop = data.ShopDetails?.[0] as GroceryExplore["ShopDetails"][number] | undefined;

  const typeInfo: TypeInfo[] =
    data.ProductTypeByShop?.map((info: ProductType) => ({
      id: info?.typeInfo,
      custom_type_id: info?.custom_type_id,
      name: info?.typeName,
      image: "medical_equipment.png",
      parent: null,
      subtype:
        info.statusType === "General"
          ? data.ProductSubTypeByShop?.filter(
              (subtype: ProductSubType) => subtype?.typeInfo === info?.typeInfo,
            )
          : [],
    })) || [];

  return {
    store: shop || {},
    typeInfo,
    typeInfoByShop: data.ProductTypeByShop || [],
    subtypeInfoByShop: data.ProductSubTypeByShop || [],
    slider: data.DashboardSlider || [],
    showProductPrice: shop?.show_product_price !== undefined ? shop.show_product_price : true,
    specialOfferItem: data.specialOfferItem || [],
    dealOfTheDay: data.dealOfTheDay || [],
    popularItem: data.popularItem || [],
    storeRef: { merchantId: data.storeId || "", customstore_id: data.customstoreId || "" },
  };
}

function useGroceryStoreData(): StoreData {
  const { explore, isLoading } = useGroceryStore();
  // Memoised on the query result, so effects that depend on a field
  // (typeInfo, say) do not re-run on every render.
  const data = useMemo(() => toStoreData(explore), [explore]);
  return useMemo(() => ({ ...data, isLoading }), [data, isLoading]);
}

// The Redux slices Medicine still fills (until PR 3).
type LegacyState = {
  dashboard: {
    visitedMedicineStore: Record<string, unknown>;
    typeInfo: TypeInfo[];
    typeInfoByShop: unknown[];
    subtypeInfoByShop: unknown[];
    DashboardSlider: unknown[];
    showProductPrice: boolean;
    isLoading: boolean;
  };
  itemsByStore: {
    specialOfferItem: unknown[];
    dealOfTheDay: unknown[];
    popularItem: unknown[];
    merchantId: string;
    customstore_id: string;
  };
};

function useMedicineStoreData(): StoreData {
  const dashboard = useSelector((state: LegacyState) => state.dashboard);
  const items = useSelector((state: LegacyState) => state.itemsByStore);
  return useMemo(
    () => ({
      store: dashboard.visitedMedicineStore,
      typeInfo: dashboard.typeInfo,
      typeInfoByShop: dashboard.typeInfoByShop,
      subtypeInfoByShop: dashboard.subtypeInfoByShop,
      slider: dashboard.DashboardSlider,
      showProductPrice: dashboard.showProductPrice,
      specialOfferItem: items.specialOfferItem,
      dealOfTheDay: items.dealOfTheDay,
      popularItem: items.popularItem,
      storeRef: { merchantId: items.merchantId, customstore_id: items.customstore_id },
      isLoading: dashboard.isLoading,
    }),
    [dashboard, items],
  );
}

const STORE_DATA_HOOKS: Record<StoreModuleName, () => StoreData> = {
  grocery: useGroceryStoreData,
  medicine: useMedicineStoreData,
};

/**
 * What a grocery or medicine store page shows. Grocery reads the explore
 * query; Medicine still reads Redux. A component keeps one module for its
 * whole life, so the hook it calls never changes.
 */
export function useStoreData(moduleName: StoreModuleName): StoreData {
  const useData = STORE_DATA_HOOKS[moduleName];
  return useData();
}
