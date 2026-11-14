"use client";

import React from "react";
import { HiChevronRight } from "react-icons/hi";
import InfiniteScroll from "react-infinite-scroll-component";
import ItemCardSkeleton from "./ItemCardSkeleton";
import { ITEM_GRID_CLASS } from "./storeModules";
import { HiOutlineCube } from "react-icons/hi2";
import { EmptyState } from "@/components/shared/UI/UI";

// Breadcrumb for sub-type pages: "Type › Sub-type". `onTypeClick` goes back
// to the parent type page.
export const TypeBreadcrumb = ({ typeName, subTypeName, onTypeClick }) => (
  <nav aria-label="Breadcrumb" className="mb-2">
    <ol className="flex min-w-0 flex-wrap items-center gap-1 text-sm">
      <li>
        <button
          type="button"
          onClick={onTypeClick}
          className="inline-flex min-h-8 items-center font-medium text-gray-500 transition-colors hover:text-[#0C3F8E] dark:hover:text-[#7FB2FF]"
        >
          {typeName}
        </button>
      </li>
      <li aria-hidden className="text-gray-300">
        <HiChevronRight />
      </li>
      <li aria-current="page" className="truncate font-medium text-gray-900">
        {subTypeName}
      </li>
    </ol>
  </nav>
);

const SkeletonGrid = ({ count }) => (
  <div className={ITEM_GRID_CLASS}>
    {Array.from({ length: count }).map((_, index) => (
      <ItemCardSkeleton key={index} />
    ))}
  </div>
);

// Infinite-scrolling product grid with skeleton and empty states, used by
// the sub-type and search result pages.
export const InfiniteItemGrid = ({
  items,
  allLoaded,
  hasMore,
  onLoadMore,
  renderItem,
  emptyTitle = "No products found",
  emptyText = "There's nothing here right now. Check back soon.",
}) => {
  const isEmpty = !items || items.length < 1;

  if (isEmpty) {
    return allLoaded ? (
      <EmptyState
        icon={<HiOutlineCube />}
        title={emptyTitle}
        text={emptyText}
        className="min-h-[40vh]"
      />
    ) : (
      <SkeletonGrid count={12} />
    );
  }

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={onLoadMore}
      hasMore={hasMore}
      style={{ overflow: "visible" }}
      loader={
        <div className="mt-3 md:mt-4">
          <SkeletonGrid count={4} />
        </div>
      }
    >
      <div className={ITEM_GRID_CLASS}>{items.map(renderItem)}</div>
    </InfiniteScroll>
  );
};
