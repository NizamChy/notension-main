"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ShopInfoCard from "@/components/ShopInfoSection/ShopInfoCard";

const FavoriteShop = ({ isFavoriteRoute = false }) => {
  const router = useRouter();

  const favouriteFoodShop = useSelector(
    (state) => state.userChoice.favouriteFoodShop
  );

  const handleStoreClick = (shop) => {
    if (!shop || !shop.shop_name) return;

    const formattedShopName = shop.shop_name
      ?.trim()
      .toLowerCase()
      .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
      .replace(/\s+/g, "-");

    router.push(
      `/food/store/${formattedShopName}/${shop?.storeId}/${shop?.custom_store_id}`
    );
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-8">
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
