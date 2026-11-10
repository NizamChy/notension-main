import React from "react";

const CategorySkeleton = ({
  gridClass = "grid grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6",
}) => {
  return (
    <section className="py-6 md:py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="h-8 lg:h-9 mb-4 md:mb-6 rounded-md bg-gray-200 animate-pulse w-1/3 lg:w-1/4" />
        <div className={`${gridClass}`}>
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="group relative rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-white"
            >
              <div className="block h-full">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-1 sm:p-2">
                  <div className="h-4 bg-gray-200 rounded-full animate-pulse w-3/4 mx-auto mb-1" />
                  <div className="h-3 bg-gray-200 rounded-full animate-pulse w-1/2 mx-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySkeleton;
