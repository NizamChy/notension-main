"use client";

import notify from "@/utils/notify";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { StoreList } from "./legacyViews";
import { ITEM_MODULES, type ItemModuleName } from "./moduleItems";
import { useNearestGroceryStores } from "@/hooks/grocery/useGroceryStores";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { toSlug } from "@/utils/slug";

type ListedStore = { _id?: string; shop_name?: string; custom_store_id?: string; is_closed?: boolean };

type StoreListConfig = {
  useNearest: () => { stores: ListedStore[]; isLoading: boolean };
  /** The preferences module the store list selects. */
  currentModule: string;
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyText: string;
};

const STORE_LISTS: Record<ItemModuleName, StoreListConfig> = {
  grocery: {
    useNearest: useNearestGroceryStores,
    currentModule: "Grocery",
    title: "Grocery stores near you",
    subtitle: "Pick a store to start shopping",
    emptyTitle: "No grocery stores nearby",
    emptyText:
      "We don't have a grocery store delivering to this area yet. Try changing your delivery location.",
  },
};

type Props = { moduleName: ItemModuleName };

// The stores of a module near the delivery location.
const StoreListSection = ({ moduleName }: Props) => {
  const { basePath } = ITEM_MODULES[moduleName];
  const list = STORE_LISTS[moduleName];
  const router = useRouter();
  const { stores, isLoading } = list.useNearest();

  const handleStoreClick = (shop: ListedStore) => {
    if (!shop || !shop?.shop_name) return;

    if (shop?.is_closed)
      return notify.info("This store is closed right now. Please check back later.");

    const formattedShopName = toSlug(shop?.shop_name);

    router.push(
      `${basePath}/${formattedShopName}/${shop?._id}/${shop?.custom_store_id}`
    );
  };

  // The old store-list fetch made the module current on mount.
  useEffect(() => {
    usePreferencesStore.getState().setCurrentModule(list.currentModule);
  }, [list.currentModule]);

  return (
    <StoreList
      moduleName={moduleName}
      title={list.title}
      subtitle={list.subtitle}
      shops={stores}
      isLoading={isLoading}
      onShopClick={handleStoreClick}
      emptyTitle={list.emptyTitle}
      emptyText={list.emptyText}
    />
  );
};

export default StoreListSection;
