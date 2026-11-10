"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ShopInfoCard from "@/components/ShopInfoSection/ShopInfoCard";

const FavoriteShop = ({ isFavoriteRoute = false }) => {
  const router = useRouter();

  const favouriteGroceryStore = useSelector(
    (state) => state.userChoice.favouriteGroceryStore
  );

  const handleStoreClick = (shop) => {
    if (!shop || !shop?.shop_name) return;

    const formattedShopName = shop?.shop_name
      ?.trim()
      .toLowerCase()
      .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
      .replace(/\s+/g, "-");

    router.push(
      `/grocery/${formattedShopName}/${shop?.storeId}/${shop?.custom_store_id}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {favouriteGroceryStore?.length > 0 && (
        <h1 className="text-lg md:text-2xl font-bold text-deepGray mb-4 md:mb-6">
          Favourite Grocery Stores
        </h1>
      )}

      {isFavoriteRoute && (
        <>
          {favouriteGroceryStore?.length < 1 && (
            <div className="flex flex-col justify-center items-center min-h-content">
              <Image
                className="max-w-md w-full"
                src="/images/favorite/no-fav-store.png"
                alt="no-fav-store"
                width={740}
                height={474}
              />

              <p className="text-center text-deepGray font-semibold lg:text-2xl">
                No Favourite Grocery Store found!
              </p>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {favouriteGroceryStore?.map((shop) => (
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
