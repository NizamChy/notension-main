import React from "react";
import { Skeleton } from "@/components/shared/UI/UI";
import FashionSection from "../FashionSection";

const CategorySkeleton = ({
  gridClass = "grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6 lg:gap-6",
  count = 6,
  className = "",
}) => {
  return (
    <FashionSection className={className}>
      <div aria-hidden>
        <Skeleton className="mb-6 h-7 w-1/2 !rounded-full sm:w-1/3 lg:w-1/4" />
        <div className={gridClass}>
          {[...Array(count)].map((_, index) => (
            <div key={index}>
              <Skeleton className="aspect-square !rounded-2xl" />
              <Skeleton className="mx-auto mt-3 h-3.5 w-2/3 !rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </FashionSection>
  );
};

export default CategorySkeleton;
