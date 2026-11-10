import React from "react";

// Same shape as ShopInfoCard.
const ShopInfoCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full aspect-[5/3] bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default ShopInfoCardSkeleton;
