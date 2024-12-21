import React from "react";

const CategoryCardSkeleton = () => {
  return (
    <div className="h-32 w-32 py-4 px-4 flex flex-col justify-center items-center border-2 rounded-lg cursor-pointer bg-white shadow-sm animate-pulse">
      <div className="flex flex-col justify-center items-center text-center">
        <div className="h-16 w-24 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-full bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default CategoryCardSkeleton;
