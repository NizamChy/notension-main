"use client";

import React from "react";
import { useFavouriteEntries } from "@/stores/favouritesStore";
import { useRouter } from "next/navigation";
import { FavoriteStores as FavoriteStoresView } from "./legacyViews";
import { ITEM_MODULES, type ItemModuleName } from "./moduleItems";
import { toSlug } from "@/utils/slug";

// The module's merchantType in the favourite store lists.
const FAVORITE_STORES: Record<ItemModuleName, { merchantType: number; label: string }> = {
  grocery: { merchantType: 0, label: "grocery" },
  medicine: { merchantType: 1, label: "medicine" },
};

type SavedStore = { shop_name?: string; storeId?: string; custom_store_id?: string };

type Props = { moduleName: ItemModuleName; isFavoriteRoute?: boolean };

// The saved stores of a module: a section on its home page, or the whole
// favourite-stores page (`isFavoriteRoute`).
const FavoriteStores = ({ moduleName, isFavoriteRoute = false }: Props) => {
  const { basePath } = ITEM_MODULES[moduleName];
  const { merchantType, label } = FAVORITE_STORES[moduleName];
  const router = useRouter();

  const favouriteStores = useFavouriteEntries("store", merchantType) as SavedStore[];

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
