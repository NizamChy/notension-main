import { useInfiniteQuery } from "@tanstack/react-query";
import type { ItemListQuery } from "@/lib/api/grocery";
import { getItemPage, type MedicineItem } from "@/lib/api/medicine";
import { queryKeys } from "@/lib/api/queryKeys";
import { useStoreRef } from "@/hooks/grocery/useStoreRef";
import { PAGE_SIZE } from "@/hooks/grocery/useGroceryItemList";

const none: MedicineItem[] = [];

/** Medicines for a search, sub-type or custom type, page by page (see useGroceryItemList). */
export function useMedicineItemList(q: ItemListQuery | null) {
  const ref = useStoreRef();
  const enabled = !!ref && !!q && (q.kind !== "search" || q.text.length > 1);
  const query = useInfiniteQuery({
    queryKey: queryKeys.medicine.items(ref?.storeId ?? "", q ?? { kind: "search", text: "" }),
    queryFn: ({ pageParam }) => getItemPage(ref!, q!, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last, all) => (last.length < PAGE_SIZE ? undefined : all.length + 1),
    enabled,
    select: (data) => data.pages.flat(),
  });

  const items = query.data ?? none;
  return {
    items,
    isLoading: enabled && query.isLoading,
    notFound: query.isSuccess && items.length === 0,
    isError: query.isError,
    hasMore: enabled && !!query.hasNextPage && !query.isError,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
    },
    loadingMore: query.isFetchingNextPage,
  };
}
