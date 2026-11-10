import React from "react";

// Same shape as a food category tile.
const CategoryCardSkeleton = () => {
  return (
    <div className="aspect-square w-full rounded-xl bg-white border-2 border-white shadow-sm p-1.5 animate-pulse">
      <div className="w-full h-full rounded-lg bg-gray-200" />
    </div>
  );
};

export default CategoryCardSkeleton;
