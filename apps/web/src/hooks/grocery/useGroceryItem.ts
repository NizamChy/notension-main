import { useQuery, type QueryClient } from "@tanstack/react-query";
import { getItem, type GroceryItem } from "@/lib/api/grocery";
import { queryKeys } from "@/lib/api/queryKeys";
import { useStoreRef } from "./useStoreRef";

/** Puts a list item in the cache so its detail page opens without a request. */
export function seedGroceryItem(qc: QueryClient, storeId: string, item: GroceryItem): void {
  qc.setQueryData(queryKeys.grocery.item(storeId, item.productInfoTable), item);
}

/** One product of the visited store. `notFound` means the store no longer lists it. */
export function useGroceryItem(productId: string | undefined) {
  const ref = useStoreRef();
  const query = useQuery({
    queryKey: queryKeys.grocery.item(ref?.storeId ?? "", productId ?? ""),
    queryFn: () => getItem(ref!, productId!),
    enabled: !!ref && !!productId,
    // A seeded item counts as fresh for a minute.
    staleTime: 60_000,
  });
  return {
    item: query.data ?? undefined,
    isLoading: query.isLoading,
    notFound: query.data === null,
  };
}
