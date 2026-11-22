"use client";

import notify from "@/utils/notify";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import StoreList from "@/components/StoreModule/StoreList";
import { useNearestGroceryStores } from "@/hooks/grocery/useGroceryStores";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { toSlug } from "@/utils/slug";

const GrocerySection = () => {
  const router = useRouter();
  const { stores, isLoading } = useNearestGroceryStores();

  const handleStoreClick = (shop) => {
    if (!shop || !shop?.shop_name) return;

    if (shop?.is_closed)
      return notify.info("This store is closed right now. Please check back later.");

    const formattedShopName = toSlug(shop?.shop_name);

    router.push(
      `/grocery/${formattedShopName}/${shop?._id}/${shop?.custom_store_id}`
    );
  };

  // The old store-list fetch made Grocery the current module on mount.
  useEffect(() => {
    usePreferencesStore.getState().setCurrentModule("Grocery");
  }, []);

  return (
    <StoreList
      moduleName="grocery"
      title="Grocery stores near you"
      subtitle="Pick a store to start shopping"
      shops={stores}
      isLoading={isLoading}
      onShopClick={handleStoreClick}
      emptyTitle="No grocery stores nearby"
      emptyText="We don't have a grocery store delivering to this area yet. Try changing your delivery location."
    />
  );
};

export default GrocerySection;
