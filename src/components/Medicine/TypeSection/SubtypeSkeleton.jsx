import React from "react";

const SubtypeSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-2 md:p-4 animate-pulse">
      <div className="w-full h-20 md:h-40 bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
    </div>
  );
};

export default SubtypeSkeleton;
