"use client";
import { useGroceryShop } from "@/hooks/fetch-data/useGroceryShop";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ShopInfoCard from "../ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "../ShopInfoSection/ShopInfoCardSkeleton";
import NoStoreFound from "../ShopInfoSection/NoStoreFound";

const GrocerySearchedStores = () => {
  const [nearestInfo, setNearestInfo] = useState([]);
  const { handleSearchStore, progressing } = useGroceryShop();

  const searchParams = useSearchParams();

  const searchText = searchParams.get("query");

  useEffect(() => {
    handleSearchStore(searchText, setNearestInfo);
  }, [searchText]);

  console.log(nearestInfo);

  return (
    <div className="mx-auto px-4 lg:px-24 py-6">
      <h4 className="text-sm md:text-xl font-medium text-gray-500 pb-4">
        Store found for <span className="text-gray-700">"{searchText}"</span>
      </h4>

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

export default GrocerySearchedStores;
