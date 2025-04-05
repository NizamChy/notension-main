"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import { useFood } from "@/hooks/fetch-data/useFood";
import ShopInfoCard from "@/components/ShopInfoSection/ShopInfoCard";

const FavoriteShop = ({ isFavoriteRoute = false }) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { exploreStore } = useFood();

  const favouriteFoodShop = useSelector(
    (state) => state.userChoice.favouriteFoodShop
  );

  const handleStoreClick = (shop) => {
    if (!shop || !shop.shop_name) return;

    // setLoading(true);

    const formattedShopName = shop.shop_name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "") // Remove non-alphanumeric characters
      .replace(/\s+/g, "-"); // Replace spaces with hyphens

    const storeData = {
      _id: shop?.storeId,
      custom_store_id: shop?.custom_store_id,
    };

    // exploreStore(storeData);

    // router.push(`/food/store/${formattedShopName}`);

    router.push(
      `/food/store/${formattedShopName}/${shop?.storeId}/${shop?.custom_store_id}`
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto px-4 lg:px-24 py-6">
      {favouriteFoodShop.length > 0 && (
        <h1 className="text-2xl font-bold mb-6 text-deepGray">
          Favourite Food Shop
        </h1>
      )}

      {isFavoriteRoute && (
        <>
          {favouriteFoodShop?.length < 1 && (
            <p className="text-center text-deepGray mt-40">
              Add Favourite Food Shop to visit later.
            </p>
          )}
        </>
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
