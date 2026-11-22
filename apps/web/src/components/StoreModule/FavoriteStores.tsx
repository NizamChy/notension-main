"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FavoriteStores as FavoriteStoresView } from "./legacyViews";
import { ITEM_MODULES, type ItemModuleName } from "./moduleItems";
import { toSlug } from "@/utils/slug";

// Favourites stay in Redux (userChoice).
const FAVORITE_STORES: Record<ItemModuleName, { stateKey: "favouriteGroceryStore"; label: string }> = {
  grocery: { stateKey: "favouriteGroceryStore", label: "grocery" },
};

type SavedStore = { shop_name?: string; storeId?: string; custom_store_id?: string };
type FavoritesState = { userChoice: Record<string, SavedStore[]> };

type Props = { moduleName: ItemModuleName; isFavoriteRoute?: boolean };

// The saved stores of a module: a section on its home page, or the whole
// favourite-stores page (`isFavoriteRoute`).
const FavoriteStores = ({ moduleName, isFavoriteRoute = false }: Props) => {
  const { basePath } = ITEM_MODULES[moduleName];
  const { stateKey, label } = FAVORITE_STORES[moduleName];
  const router = useRouter();

  const favouriteStores = useSelector(
    (state: FavoritesState) => state.userChoice[stateKey]
  );

  const handleStoreClick = (shop: SavedStore) => {
    if (!shop || !shop?.shop_name) return;

    const formattedShopName = toSlug(shop?.shop_name);

    router.push(
      `${basePath}/${formattedShopName}/${shop?.storeId}/${shop?.custom_store_id}`
    );
  };

  return (
    <FavoriteStoresView
      stores={favouriteStores}
      type={moduleName}
      label={label}
      isFavoriteRoute={isFavoriteRoute}
      onStoreClick={handleStoreClick}
      favoritesHref={`${basePath}/favorite-stores`}
      browseHref={`${basePath}/home/find-store`}
    />
  );
};

export default FavoriteStores;
