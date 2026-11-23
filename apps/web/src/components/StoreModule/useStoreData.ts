import { useMemo } from "react";
import { storeStatusOf, type ExploreResult, type GroceryExplore } from "@/lib/api/grocery";
import type { MedicineExploreResult } from "@/lib/api/medicine";
import { useGroceryStore } from "@/hooks/grocery/useGroceryStore";
import { useMedicineStore } from "@/hooks/medicine/useMedicineStore";

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
 * The store-page data of an explore result. A copy of the old explore cases
 * of dashboardReducer (EXPLORE_STORE and EXPLORE_MED_STORE are identical) and
 * items-by-shop (see the test), which ran only for an open store. Medicine
 * reads the same fields, so its explore is read through the grocery type.
 */
export function toStoreData(
  explore: ExploreResult | MedicineExploreResult | undefined,
): Omit<StoreData, "isLoading"> {
  if (!explore || storeStatusOf(explore as ExploreResult) !== null) return EMPTY;
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

function useMedicineStoreData(): StoreData {
  const { explore, isLoading } = useMedicineStore();
  const data = useMemo(() => toStoreData(explore), [explore]);
  return useMemo(() => ({ ...data, isLoading }), [data, isLoading]);
}

const STORE_DATA_HOOKS: Record<StoreModuleName, () => StoreData> = {
  grocery: useGroceryStoreData,
  medicine: useMedicineStoreData,
};

/**
 * What a grocery or medicine store page shows, from that module's explore
 * query. A component keeps one module for its whole life, so the hook it
 * calls never changes.
 */
export function useStoreData(moduleName: StoreModuleName): StoreData {
  const useData = STORE_DATA_HOOKS[moduleName];
  return useData();
}
