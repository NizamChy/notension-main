"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import { useGroceryShop } from "@/hooks/fetch-data/useGroceryShop";
import ShopInfoCard from "@/components/ShopInfoSection/ShopInfoCard";

const FavoriteShop = ({ isFavoriteRoute = false }) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { exploreStore } = useGroceryShop();

  const favouriteGroceryStore = useSelector(
    (state) => state.userChoice.favouriteGroceryStore
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

    exploreStore(storeData);
    router.push(`/grocery/${formattedShopName}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto px-4 lg:px-24 py-6">
      {favouriteGroceryStore.length > 0 && (
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-6 text-deepGray">
          Favourite Grocery Stores
        </h1>
      )}

      {isFavoriteRoute && (
        <>
          {favouriteGroceryStore?.length < 1 && (
            <p className="text-center text-deepGray mt-40">
              Add Favourite Grocery Store to visit later.
            </p>
          )}
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {favouriteGroceryStore.map((shop) => (
          <ShopInfoCard
            key={shop?.storeId}
            onClick={() => {
              handleStoreClick(shop);
            }}
            shop={shop}
            type="grocery"
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoriteShop;
