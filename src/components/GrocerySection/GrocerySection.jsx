"use client";

import { useGroceryShop } from "@/hooks/fetch-data/useGroceryShop";
import React, { useEffect, useState } from "react";
import ShopInfoCard from "../ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "../ShopInfoSection/ShopInfoCardSkeleton";
import NoStoreFound from "../ShopInfoSection/NoStoreFound";

const GrocerySection = () => {
  const [nearestInfo, setNearestInfo] = useState([]);
  const { getNearestGroceryStoreInfo, progressing } = useGroceryShop();

  useEffect(() => {
    getNearestGroceryStoreInfo(setNearestInfo);
  }, []);

  return (
    <div className="mx-auto px-4 lg:px-24 py-6">
      <h1 className="text-2xl font-bold mb-6 text-deepGray">
        Nearest Grocery Stores
      </h1>

      {!progressing && nearestInfo?.length < 1 && <NoStoreFound />}

      {progressing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <ShopInfoCardSkeleton key={index} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {nearestInfo.map((shop) => (
          <ShopInfoCard key={shop._id} shop={shop} type="grocery" />
        ))}
      </div>
    </div>
  );
};

export default GrocerySection;
