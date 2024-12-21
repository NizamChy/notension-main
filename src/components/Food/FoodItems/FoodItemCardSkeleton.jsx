import React from "react";

const FoodItemCardSkeleton = () => {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg animate-pulse p-4">
      <div className="relative h-48 w-full bg-gray-300 rounded-lg"></div>

      <div className="py-4">
        <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded mb-2"></div>

        <div className="flex items-center justify-between mt-3">
          <div className="h-8 w-full bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default FoodItemCardSkeleton;
