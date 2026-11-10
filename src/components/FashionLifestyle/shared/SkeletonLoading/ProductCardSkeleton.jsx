import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />

      <div className="p-2.5 sm:p-3">
        <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded-full w-1/2 mb-4" />

        <div className="flex items-center gap-2">
          <span className="h-4 bg-gray-200 rounded-full w-1/4" />
          <span className="h-3 bg-gray-200 rounded-full w-1/5" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
