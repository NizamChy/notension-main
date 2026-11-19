"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import FavoriteStores from "@/components/FavoriteSection/FavoriteStores";
import { toSlug } from "@/utils/slug";

const FavoriteShop = ({ isFavoriteRoute = false }) => {
  const router = useRouter();

  const favouriteMedicineStore = useSelector(
    (state) => state.userChoice.favouriteMedicineStore
  );

  const handleStoreClick = (shop) => {
    if (!shop || !shop?.shop_name) return;

    const formattedShopName = toSlug(shop?.shop_name);

    router.push(
      `/medicine/${formattedShopName}/${shop?.storeId}/${shop?.custom_store_id}`
    );
  };

  return (
    <FavoriteStores
      stores={favouriteMedicineStore}
      type="medicine"
      label="medicine"
      isFavoriteRoute={isFavoriteRoute}
      onStoreClick={handleStoreClick}
      favoritesHref="/medicine/favorite-stores"
      browseHref="/medicine/home/find-store"
    />
  );
};

export default FavoriteShop;
