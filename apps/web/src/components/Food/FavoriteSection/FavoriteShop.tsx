"use client";

import React from "react";
import { useFavouriteEntries, type Favourite } from "@/stores/favouritesStore";
import { useRouter } from "next/navigation";
import FavoriteStores from "@/components/FavoriteSection/FavoriteStores";
import { toSlug } from "@/utils/slug";

type Props = { isFavoriteRoute?: boolean };

const FavoriteShop = ({ isFavoriteRoute = false }: Props) => {
  const router = useRouter();

  const favouriteFoodShop = useFavouriteEntries("store", 2);

  const handleStoreClick = (shop: Favourite) => {
    if (!shop || !shop.shop_name) return;

    const formattedShopName = toSlug(shop.shop_name as string);

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
