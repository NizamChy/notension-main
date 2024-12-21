"use client";

import { useGroceryShop } from "@/hooks/fetch-data/useGroceryShop";
import React, { useEffect, useState } from "react";
// import ShopInfoCard from "../ShopInfoSection/ShopInfoCard";
// import ShopInfoCardSkeleton from "../ShopInfoSection/ShopInfoCardSkeleton";
// import NoStoreFound from "../ShopInfoSection/NoStoreFound";
import { useRouter } from "next/navigation";
import ShopInfoCard from "@/components/ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "@/components/ShopInfoSection/ShopInfoCardSkeleton";
import NoStoreFound from "@/components/ShopInfoSection/NoStoreFound";

const GrocerySection = () => {
  const [nearestInfo, setNearestInfo] = useState([]);
  const { getNearestGroceryStoreInfo, progressing } = useGroceryShop();

  const { exploreStore } = useGroceryShop();

  const router = useRouter();

  useEffect(() => {
    getNearestGroceryStoreInfo(setNearestInfo);
  }, []);

  // const handleStoreClick = (shop) => {
  //   console.log("shop", shop);
  //   console.log("shop_name:", shop?.shop_name);
  // };

  const handleStoreClick = (shop) => {
    if (!shop || !shop.shop_name) return;

    const formattedShopName = shop.shop_name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "") // Remove non-alphanumeric characters
      .replace(/\s+/g, "-"); // Replace spaces with hyphens

    exploreStore(shop);

    router.push(`/grocery/${formattedShopName}`);
  };

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

// {
//   "_id": "667fbfd7bb00a058878f518e",
//   "custom_store_id": "GS111168",
//   "shop_name": "Tatka Mart SuperShop",
//   "shop_address": "Opposite Delta Hospita, Mirjarpoll,Panchlaish,  Chittagong. ",
//   "less": 0,
//   "less_notice": null,
//   "delivery_notice": null,
//   "shop_banner_app": "1719648214515-320743613.webp",
//   "is_closed": false,
//   "distance": 119.25339889145114
// }

// Tatka Mart SuperShop

// tatka-mart-supershop
