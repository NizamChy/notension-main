"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import FavoriteStores from "@/components/FavoriteSection/FavoriteStores";
import { toSlug } from "@/utils/slug";

const FavoriteShop = ({ isFavoriteRoute = false }) => {
  const router = useRouter();

  const favouriteGroceryStore = useSelector(
    (state) => state.userChoice.favouriteGroceryStore
  );

  const handleStoreClick = (shop) => {
    if (!shop || !shop?.shop_name) return;

    const formattedShopName = toSlug(shop?.shop_name);

    router.push(
      `/grocery/${formattedShopName}/${shop?.storeId}/${shop?.custom_store_id}`
    );
  };

  return (
    <FavoriteStores
      stores={favouriteGroceryStore}
      type="grocery"
      label="grocery"
      isFavoriteRoute={isFavoriteRoute}
      onStoreClick={handleStoreClick}
      favoritesHref="/grocery/favorite-stores"
      browseHref="/grocery/home/find-store"
    />
  );
};

export default FavoriteShop;
