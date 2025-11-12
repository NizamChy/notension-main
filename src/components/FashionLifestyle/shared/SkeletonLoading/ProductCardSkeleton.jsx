import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="group relative cursor-pointer animate-pulse">
      <div className="aspect-[3/4] relative bg-gray-200 rounded-lg overflow-hidden mb-3">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      <div className="px-1">
        <h3 className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></h3>
        <h3 className="h-4 bg-gray-200 rounded-full w-1/2 mb-3"></h3>

        <div className="flex items-center gap-2">
          <span className="h-4 bg-gray-200 rounded-full w-1/4"></span>
          <span className="h-3 bg-gray-200 rounded-full w-1/5"></span>
          <span className="h-3 bg-gray-200 rounded-full w-1/5"></span>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
