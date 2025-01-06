"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import Loader from "@/components/common/Loader";
import ShopInfoCard from "@/components/ShopInfoSection/ShopInfoCard";
import { useGroceryShop } from "@/hooks/fetch-data/useGroceryShop";
import { useRouter } from "next/navigation";
import { useFood } from "@/hooks/fetch-data/useFood";

const FavoriteShop = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { exploreStore } = useFood();

  const favouriteFoodShop = useSelector(
    (state) => state.userChoice.favouriteFoodShop
  );

  const handleStoreClick = (shop) => {
    if (!shop || !shop.shop_name) return;

    setLoading(true);
    const formattedShopName = shop.shop_name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "") // Remove non-alphanumeric characters
      .replace(/\s+/g, "-"); // Replace spaces with hyphens

    const storeData = {
      _id: shop?.storeId,
      custom_store_id: shop?.custom_store_id,
    };

    console.log("shop", shop);
    console.log("storeData", storeData);

    exploreStore(storeData);
    router.push(`/food/store/${formattedShopName}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto px-4 lg:px-24 py-6">
      {favouriteFoodShop.length > 0 && (
        <h1 className="text-2xl font-bold mb-6 text-deepGray">
          Favourite Food Shop
        </h1>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {favouriteFoodShop.map((shop) => (
          <ShopInfoCard
            key={shop?.storeId}
            onClick={() => {
              handleStoreClick(shop);
            }}
            shop={shop}
            type="food"
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoriteShop;
