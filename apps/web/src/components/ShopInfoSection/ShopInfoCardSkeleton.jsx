import React from "react";
import { CARD } from "@/components/shared/UI/UI";

// Same shape as ShopInfoCard.
const ShopInfoCardSkeleton = () => {
  return (
    <div aria-hidden className={`animate-pulse overflow-hidden ${CARD}`}>
      <div className="aspect-[16/9] w-full bg-gray-100" />
      <div className="space-y-2.5 p-4">
        <div className="h-4 w-3/4 rounded-full bg-gray-100" />
        <div className="h-3 w-full rounded-full bg-gray-100" />
        <div className="h-3 w-2/3 rounded-full bg-gray-100" />
        <div className="!mt-4 h-6 w-24 rounded-full bg-gray-100" />
      </div>
    </div>
  );
};

export default ShopInfoCardSkeleton;
