import React from "react";
import { Skeleton } from "@/components/shared/UI/UI";

const ProductCardSkeleton = () => {
  return (
    <div className="flex h-full flex-col" aria-hidden>
      <Skeleton className="aspect-[3/4] !rounded-2xl" />
      <div className="px-0.5 pt-3">
        <Skeleton className="h-3 w-1/3 !rounded-full" />
        <Skeleton className="mt-2 h-4 w-5/6 !rounded-full" />
        <Skeleton className="mt-1.5 h-4 w-1/2 !rounded-full" />
        <Skeleton className="mt-3 h-4 w-1/4 !rounded-full" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
