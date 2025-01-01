"use client";

import React, { useEffect, useState } from "react";
import { useGroceryShop } from "@/hooks/fetch-data/useGroceryShop";
import { useRouter } from "next/navigation";
import ShopInfoCard from "@/components/ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "@/components/ShopInfoSection/ShopInfoCardSkeleton";
import NoStoreFound from "@/components/ShopInfoSection/NoStoreFound";
import Loader from "@/components/common/Loader";

const GrocerySection = () => {
  const [nearestInfo, setNearestInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { exploreStore, getNearestGroceryStoreInfo, progressing } =
    useGroceryShop();

  const handleStoreClick = (shop) => {
    if (!shop || !shop.shop_name) return;

    setLoading(true);
    const formattedShopName = shop.shop_name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "") // Remove non-alphanumeric characters
      .replace(/\s+/g, "-"); // Replace spaces with hyphens

    exploreStore(shop);
    router.push(`/grocery/${formattedShopName}`);
  };

  useEffect(() => {
    getNearestGroceryStoreInfo(setNearestInfo);
  }, []);

  if (loading) return <Loader />;

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
          <ShopInfoCard
            onClick={() => {
              handleStoreClick(shop);
            }}
            key={shop._id}
            shop={shop}
            type="grocery"
          />
        ))}
      </div>
    </div>
  );
};

export default GrocerySection;
