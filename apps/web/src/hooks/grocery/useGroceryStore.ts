import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  exploreStore,
  storeStatusOf,
  type ExploreResult,
  type GroceryExplore,
  type GroceryStore,
  type StoreStatus,
} from "@/lib/api/grocery";
import { queryKeys } from "@/lib/api/queryKeys";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useStoreRef } from "./useStoreRef";

export type GroceryStoreState = {
  explore?: ExploreResult;
  /** Set only when the store is open. */
  store?: GroceryStore;
  status: StoreStatus;
  isLoading: boolean;
};

/** The store in the URL: its home data, and whether it is open, closed or missing. */
export function useGroceryStore(): GroceryStoreState {
  const ref = useStoreRef();
  const query = useQuery({
    queryKey: queryKeys.grocery.store(ref?.storeId ?? "", ref?.customStoreId ?? ""),
    queryFn: () => exploreStore(ref!),
    enabled: !!ref,
  });

  const explore = query.data;
  const status = storeStatusOf(explore);
  const store =
    explore && status === null ? (explore as GroceryExplore).ShopDetails[0] : undefined;

  // Same as the old explore: an open store makes Grocery the current module.
  const isOpen = !!store;
  useEffect(() => {
    if (isOpen) usePreferencesStore.getState().setCurrentModule("Grocery");
  }, [isOpen]);

  return { explore, store, status, isLoading: query.isLoading };
}
