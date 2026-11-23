import { useQuery, type QueryClient } from "@tanstack/react-query";
import { getItem, type MedicineItem } from "@/lib/api/medicine";
import { queryKeys } from "@/lib/api/queryKeys";
import { useStoreRef } from "@/hooks/grocery/useStoreRef";

/**
 * Puts a list item in the cache so its detail page opens without a request.
 * Filed under its medStoreProductInfo and its _id (the product URL carries
 * the _id).
 */
export function seedMedicineItem(qc: QueryClient, storeId: string, item: MedicineItem): void {
  qc.setQueryData(queryKeys.medicine.item(storeId, item.medStoreProductInfo), item);
  if (item._id && item._id !== item.medStoreProductInfo) {
    qc.setQueryData(queryKeys.medicine.item(storeId, item._id), item);
  }
}

/** One medicine of the visited pharmacy. `notFound` means it no longer lists it. */
export function useMedicineItem(productId: string | undefined) {
  const ref = useStoreRef();
  const query = useQuery({
    queryKey: queryKeys.medicine.item(ref?.storeId ?? "", productId ?? ""),
    queryFn: () => getItem(ref!, productId!),
    enabled: !!ref && !!productId,
    staleTime: 60_000,
  });
  return {
    item: query.data ?? undefined,
    isLoading: query.isLoading,
    notFound: query.data === null,
    isError: query.isError,
  };
}
