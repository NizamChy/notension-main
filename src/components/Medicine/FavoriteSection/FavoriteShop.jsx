"use client";

import React from "react";
import Image from "next/image";
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
      ?.trim()
      .toLowerCase()
      .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
      .replace(/\s+/g, "-");

    router.push(
      `/medicine/${formattedShopName}/${shop?.storeId}/${shop?.custom_store_id}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {favouriteMedicineStore?.length > 0 && (
        <h1 className="text-lg md:text-2xl font-bold text-deepGray mb-4 md:mb-6">
          Favourite Medicine Stores
        </h1>
      )}

      {isFavoriteRoute && (
        <>
          {favouriteMedicineStore?.length < 1 && (
            <div className="flex flex-col justify-center items-center min-h-content">
              <Image
                className="max-w-4xl w-full"
                src="/images/favorite/fav-shop-not-found.jpg"
                alt="favourite-shop-not-found"
                width={1867}
                height={1179}
              />
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
