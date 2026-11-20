"use client";

import notify from "@/utils/notify";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import StoreList from "@/components/StoreModule/StoreList";
import { useGroceryShop } from "@/hooks/fetch-data/useGroceryShop";
import { toSlug } from "@/utils/slug";

const GrocerySection = () => {
  const [nearestInfo, setNearestInfo] = useState([]);

  const router = useRouter();
  const { getNearestGroceryStoreInfo, progressing } = useGroceryShop();

  const handleStoreClick = (shop) => {
    if (!shop || !shop?.shop_name) return;

    if (shop?.is_closed)
      return notify.info("This store is closed right now. Please check back later.");

    const formattedShopName = toSlug(shop?.shop_name);

    router.push(
      `/grocery/${formattedShopName}/${shop?._id}/${shop?.custom_store_id}`
    );
  };

  useEffect(() => {
    getNearestGroceryStoreInfo(setNearestInfo);
  }, []);

  return (
    <StoreList
      moduleName="grocery"
      title="Grocery stores near you"
      subtitle="Pick a store to start shopping"
      shops={nearestInfo}
      isLoading={progressing}
      onShopClick={handleStoreClick}
      emptyTitle="No grocery stores nearby"
      emptyText="We don't have a grocery store delivering to this area yet. Try changing your delivery location."
    />
  );
};

export default GrocerySection;
