import React from "react";

const GroceryItemDetailsSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-3 md:p-6 w-full max-w-screen-md animate-pulse">
      {/* Title */}
      <div className="h-6 w-1/3 bg-gray-300 rounded mb-4"></div>

      <div className="md:flex">
        {/* Image */}
        <div className="md:w-1/3 h-52 bg-gray-300 rounded-lg"></div>

        {/* Details */}
        <div className="flex-1 pl-0 md:pl-6 space-y-3 mt-4 md:mt-0">
          {/* Product Name */}
          <div className="h-6 w-3/4 bg-gray-300 rounded"></div>

          {/* Pack Size */}
          <div className="h-5 w-1/4 bg-gray-300 rounded"></div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <div className="h-6 w-1/4 bg-gray-300 rounded"></div>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <div className="h-10 w-2/3 bg-gray-300 rounded-lg"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryItemDetailsSkeleton;
