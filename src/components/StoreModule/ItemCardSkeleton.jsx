import React from "react";

// Placeholder with the same shape as the grocery / medicine item cards.
const ItemCardSkeleton = () => {
  return (
    <div className="w-full h-full flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-9 w-full bg-gray-200 rounded-lg mt-3" />
      </div>
    </div>
  );
};

export default ItemCardSkeleton;
