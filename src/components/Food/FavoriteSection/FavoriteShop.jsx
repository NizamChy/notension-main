"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import FavoriteStores from "@/components/FavoriteSection/FavoriteStores";

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
    <FavoriteStores
      stores={favouriteFoodShop}
      type="food"
      label="food"
      isFavoriteRoute={isFavoriteRoute}
      onStoreClick={handleStoreClick}
      favoritesHref="/food/store/favorite-stores"
      browseHref="/food"
    />
  );
};

export default FavoriteShop;
