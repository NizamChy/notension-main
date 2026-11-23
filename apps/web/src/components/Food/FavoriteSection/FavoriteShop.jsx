"use client";

import React from "react";
import { useFavouriteEntries } from "@/stores/favouritesStore";
import { useRouter } from "next/navigation";
import FavoriteStores from "@/components/FavoriteSection/FavoriteStores";
import { toSlug } from "@/utils/slug";

const FavoriteShop = ({ isFavoriteRoute = false }) => {
  const router = useRouter();

  const favouriteFoodShop = useFavouriteEntries("store", 2);

  const handleStoreClick = (shop) => {
    if (!shop || !shop.shop_name) return;

    const formattedShopName = toSlug(shop.shop_name);

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
