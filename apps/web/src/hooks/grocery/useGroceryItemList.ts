import { useInfiniteQuery } from "@tanstack/react-query";
import { getItemPage, type GroceryItem, type ItemListQuery } from "@/lib/api/grocery";
import { queryKeys } from "@/lib/api/queryKeys";
import { useStoreRef } from "./useStoreRef";

// The API answers 24 items a page; a shorter page is the last one.
export const PAGE_SIZE = 24;

const none: GroceryItem[] = [];

/**
 * Items for a search, sub-type or custom type, page by page. The newest query
 * wins because the key changes with it (this replaces the old searchSeq).
 */
export function useGroceryItemList(q: ItemListQuery | null) {
  const ref = useStoreRef();
  const enabled = !!ref && !!q && (q.kind !== "search" || q.text.length > 1);
  const query = useInfiniteQuery({
    queryKey: queryKeys.grocery.items(ref?.storeId ?? "", q ?? { kind: "search", text: "" }),
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
    // A failed page ends the list, as the old hook did.
    hasMore: enabled && !!query.hasNextPage && !query.isError,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
    },
    loadingMore: query.isFetchingNextPage,
  };
}
