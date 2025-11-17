import React from "react";

const ShopInfoCardSkeleton = () => {
  return (
    <div className="card bg-white shadow-lg rounded-lg mb-4 animate-pulse">
      <div className="w-full h-60 bg-gray-300 rounded-t-lg"></div>
      <div className="p-4">
        <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded mb-2 flex gap-1">
          <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
        </div>
        <div className="h-4 w-1/2 bg-gray-300 rounded mb-2"></div>
      </div>
    </div>
  );
};

export default ShopInfoCardSkeleton;
