"use client";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useGroceryShop } from "@/hooks/fetch-data/useGroceryShop";
import NoStoreFound from "@/components/ShopInfoSection/NoStoreFound";
import ShopInfoCard from "@/components/ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "@/components/ShopInfoSection/ShopInfoCardSkeleton";

const GrocerySection = () => {
  const [nearestInfo, setNearestInfo] = useState([]);

  const router = useRouter();

  const { getNearestGroceryStoreInfo, progressing } = useGroceryShop();

  const handleStoreClick = (shop) => {
    if (!shop || !shop?.shop_name) return;

    if (shop?.is_closed) return toast.info("Sorry we're closed!");

    const formattedShopName = shop?.shop_name
      .toLowerCase()
      // .replace(/[^a-z0-9 ]/g, "")
      .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
      .replace(/\s+/g, "-");

    router.push(
      `/grocery/${formattedShopName}/${shop?._id}/${shop?.custom_store_id}`
    );
  };

  // const handleStoreClick = (shop) => {
  //   if (!shop || !shop?.shop_name) return;

  //   const formattedShopName = shop?.shop_name
  //     .toLowerCase()
  //     .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "") // Allow Bengali script + a-z + 0-9 + space
  //     .replace(/\s+/g, "-");

  //   router.push(
  //     `/medicine/${formattedShopName}/${shop?.storeId}/${shop?.custom_store_id}`
  //   );
  // };

  useEffect(() => {
    getNearestGroceryStoreInfo(setNearestInfo);
  }, []);

  return (
    <div className="mx-auto px-4 lg:px-24 py-6">
      <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-6 text-deepGray">
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
        {nearestInfo?.map((shop) => (
          <ShopInfoCard
            onClick={() => {
              handleStoreClick(shop);
            }}
            key={shop?._id}
            shop={shop}
            type="grocery"
          />
        ))}
      </div>
    </div>
  );
};

export default GrocerySection;
