import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { StoreStatus } from "@/lib/api/grocery";
import {
  exploreStore,
  foodStoreStatusOf,
  type FoodExplore,
  type FoodExploreResult,
  type FoodItem,
  type FoodStore,
} from "@/lib/api/food";
import { queryKeys } from "@/lib/api/queryKeys";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useStoreRef } from "@/hooks/grocery/useStoreRef";

type MenuCategory = FoodExplore["allProductCategory"][number];

/** One menu section: a category and its dishes (was itemsByStore.productInfoByShop). */
export type MenuSection = { _id: string; catagory: string; itemsInfo: FoodItem[] };

export type FoodMenu = {
  /** The menu categories (was itemsByStore.productCategory). */
  productCategory: MenuCategory[];
  productInfoByShop: MenuSection[];
  popularItem: FoodItem[];
};

const EMPTY_MENU: FoodMenu = { productCategory: [], productInfoByShop: [], popularItem: [] };

/**
 * The menu of an open restaurant. A copy of the old EXPLORE_FOOD_STORE_ITEMS
 * case of items-by-shop (see the test), which ran only for an open store.
 */
export function toFoodMenu(explore: FoodExploreResult | undefined): FoodMenu {
  if (!explore || foodStoreStatusOf(explore) !== null) return EMPTY_MENU;
  const data = explore as FoodExplore;
  return {
    productCategory: data.allProductCategory || [],
    productInfoByShop:
      data.allProductCategory?.map((info) => ({
        _id: info?.categoryInfo?._id,
        catagory: info?.categoryName,
        itemsInfo: data.allProduct?.filter(
          (item) => item?.productCategory === info?.categoryInfo?._id,
        ),
      })) || [],
    popularItem: data.allProduct?.filter((p) => p.is_popular === true) || [],
  };
}

export type FoodStoreState = FoodMenu & {
  explore?: FoodExploreResult;
  /** Set only when the restaurant is open (was dashboard.visitedFoodStore). */
  store?: FoodStore;
  status: StoreStatus;
  isLoading: boolean;
};

/** The restaurant in the URL: its shop, menu, and whether it is open, closed or missing. */
export function useFoodStore(): FoodStoreState {
  const ref = useStoreRef();
  const query = useQuery({
    queryKey: queryKeys.food.store(ref?.storeId ?? "", ref?.customStoreId ?? ""),
    queryFn: () => exploreStore(ref!),
    enabled: !!ref,
    // Read by many components (header, menu, cards, cart); see useGroceryStore.
    staleTime: 5 * 60_000,
  });

  const explore = query.data;
  const status = foodStoreStatusOf(explore);
  const store = explore && status === null ? (explore as FoodExplore).shopDetails[0] : undefined;
  const menu = useMemo(() => toFoodMenu(explore), [explore]);

  // As the old explore: an open restaurant makes Food the current module.
  const isOpen = !!store;
  useEffect(() => {
    if (isOpen) usePreferencesStore.getState().setCurrentModule("Food");
  }, [isOpen]);

  return { ...menu, explore, store, status, isLoading: query.isLoading };
}

/**
 * One dish of the restaurant in the URL. The food API has no item endpoint,
 * so it is looked up in the restaurant's menu (one request on a direct link,
 * none when the menu is cached), as the old details page did.
 */
export function useFoodItem(productId: string | undefined) {
  const { explore, isLoading, status } = useFoodStore();
  const all = (explore as FoodExplore | undefined)?.allProduct;
  const item = productId ? all?.find((p) => p?._id === productId) : undefined;
  return {
    item,
    isLoading,
    notFound: !isLoading && (status !== null || !!explore) && !item,
  };
}
