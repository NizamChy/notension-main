import React from "react";
import { CARD } from "@/components/shared/UI/UI";

// Placeholder with the same shape as StoreItemCard.
const ItemCardSkeleton = () => {
  return (
    <div
      aria-hidden
      className={`flex h-full w-full animate-pulse flex-col overflow-hidden ${CARD}`}
    >
      <div className="aspect-square w-full bg-gray-100" />
      <div className="flex flex-1 flex-col p-3 md:p-3.5">
        <div className="h-3.5 w-11/12 rounded-full bg-gray-100" />
        <div className="mt-2 h-3.5 w-2/3 rounded-full bg-gray-100" />
        <div className="mt-2 h-3 w-1/3 rounded-full bg-gray-100" />
        <div className="mt-4 h-4 w-1/2 rounded-full bg-gray-100" />
        <div className="mt-3 h-10 w-full rounded-full bg-gray-100" />
      </div>
    </div>
  );
};

export default ItemCardSkeleton;
