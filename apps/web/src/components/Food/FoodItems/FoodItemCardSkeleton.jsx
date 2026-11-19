"use client";

import { CARD, Skeleton } from "@/components/shared/UI/UI";

// Same shape as a dish card: text lines on the left, square photo on the right.
const FoodItemCardSkeleton = () => (
  <div className={`${CARD} flex gap-3 p-3 sm:gap-4 sm:p-4`}>
    <div className="flex flex-1 flex-col gap-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="mt-auto h-5 w-20" />
    </div>
    <Skeleton className="aspect-square w-28 shrink-0 sm:w-32" />
  </div>
);

export default FoodItemCardSkeleton;
