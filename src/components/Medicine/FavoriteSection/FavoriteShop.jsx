"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ShopInfoCard from "@/components/ShopInfoSection/ShopInfoCard";

const FavoriteShop = ({ isFavoriteRoute = false }) => {
  const router = useRouter();

  const favouriteMedicineStore = useSelector(
    (state) => state.userChoice.favouriteMedicineStore
  );

  const handleStoreClick = (shop) => {
    if (!shop || !shop?.shop_name) return;

    const formattedShopName = shop?.shop_name
      .toLowerCase()
      // .replace(/[^a-z0-9 ]/g, "")
      .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
      .replace(/\s+/g, "-");

    router.push(
      `/medicine/${formattedShopName}/${shop?.storeId}/${shop?.custom_store_id}`
    );
  };

  return (
    <div className="mx-auto px-4 lg:px-24 py-6">
      {favouriteMedicineStore.length > 0 && (
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-6 text-deepGray">
          Favourite Medicine Stores
        </h1>
      )}

      {isFavoriteRoute && (
        <>
          {favouriteMedicineStore?.length < 1 && (
            <p className="text-center text-deepGray mt-40">
              Add Favourite Medicine Store to visit later.
            </p>
          )}
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {favouriteMedicineStore?.map((shop) => (
          <ShopInfoCard
            key={shop?.storeId}
            onClick={() => {
              handleStoreClick(shop);
            }}
            shop={shop}
            type="medicine"
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoriteShop;
