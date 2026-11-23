"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import { InfiniteItemGrid, PageHeader } from "./legacyViews";
import StoreItemTile from "./StoreItemTile";
import { ITEM_MODULES, type ItemModuleName, type StoreItem } from "./moduleItems";

type Props = { moduleName: ItemModuleName };

// Search results inside the visited store (?query=…). A search needs two
// characters or more.
const SearchedItems = ({ moduleName }: Props) => {
  const config = ITEM_MODULES[moduleName];
  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");

  const { items, notFound, isError, hasMore, loadMore } = config.useItemList(
    searchText ? { kind: "search", text: searchText } : null
  );

  return (
    <div>
      <PageHeader
        title={`Results for “${searchText || ""}”`}
        subtitle={
          items?.length > 0
            ? `${items.length}${hasMore ? "+" : ""} ${config.labels.items} found in this store`
            : null
        }
      />

      <InfiniteItemGrid<StoreItem>
        items={items}
        allLoaded={notFound || isError}
        hasMore={hasMore}
        onLoadMore={loadMore}
        renderItem={(item) => (
          <StoreItemTile key={item?._id} moduleName={moduleName} item={item} />
        )}
        emptyTitle={config.labels.searchEmptyTitle}
        emptyText={config.labels.searchEmptyText}
      />
    </div>
  );
};

export default SearchedItems;
