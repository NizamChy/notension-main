import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { storeStatusOf, type StoreStatus } from "@/lib/api/grocery";
import {
  exploreStore,
  type MedicineExplore,
  type MedicineExploreResult,
  type MedicineStore,
} from "@/lib/api/medicine";
import { queryKeys } from "@/lib/api/queryKeys";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useStoreRef } from "@/hooks/grocery/useStoreRef";

export type MedicineStoreState = {
  explore?: MedicineExploreResult;
  /** Set only when the store is open. */
  store?: MedicineStore;
  status: StoreStatus;
  isLoading: boolean;
};

/** The pharmacy in the URL: its home data, and whether it is open, closed or missing. */
export function useMedicineStore(): MedicineStoreState {
  const ref = useStoreRef();
  const query = useQuery({
    queryKey: queryKeys.medicine.store(ref?.storeId ?? "", ref?.customStoreId ?? ""),
    queryFn: () => exploreStore(ref!),
    enabled: !!ref,
    // Read by many components (cards, sidebar, cart); see useGroceryStore.
    staleTime: 5 * 60_000,
  });

  const explore = query.data;
  const status = storeStatusOf(explore);
  const store =
    explore && status === null ? (explore as MedicineExplore).ShopDetails[0] : undefined;

  const isOpen = !!store;
  useEffect(() => {
    if (isOpen) usePreferencesStore.getState().setCurrentModule("Medicine");
  }, [isOpen]);

  return { explore, store, status, isLoading: query.isLoading };
}
