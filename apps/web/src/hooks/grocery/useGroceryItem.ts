import { useQuery, type QueryClient } from "@tanstack/react-query";
import { getItem, type GroceryItem } from "@/lib/api/grocery";
import { queryKeys } from "@/lib/api/queryKeys";
import { useStoreRef } from "./useStoreRef";

/**
 * Puts a list item in the cache so its detail page opens without a request.
 * The product URL carries the item _id (the quick view writes it), so the
 * item is filed under that id too.
 */
export function seedGroceryItem(qc: QueryClient, storeId: string, item: GroceryItem): void {
  qc.setQueryData(queryKeys.grocery.item(storeId, item.productInfoTable), item);
  if (item._id && item._id !== item.productInfoTable) {
    qc.setQueryData(queryKeys.grocery.item(storeId, item._id), item);
  }
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
    // The request failed (after retries); the page shows it as not found.
    isError: query.isError,
  };
}
