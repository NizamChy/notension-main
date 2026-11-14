"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import StoreList from "@/components/StoreModule/StoreList";
import { useGroceryShop } from "@/hooks/fetch-data/useGroceryShop";

const GrocerySection = () => {
  const [nearestInfo, setNearestInfo] = useState([]);

  const router = useRouter();
  const { getNearestGroceryStoreInfo, progressing } = useGroceryShop();

  const handleStoreClick = (shop) => {
    if (!shop || !shop?.shop_name) return;

    if (shop?.is_closed)
      return toast("Sorry we're closed!", {
        style: {
          border: "1px solid #FC8F1E",
        },
        icon: "ℹ️",
        iconTheme: {
          primary: "#FC8F1E",
          secondary: "#FFFAEE",
        },
      });

    const formattedShopName = shop?.shop_name
      ?.trim()
      .toLowerCase()
      .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
      .replace(/\s+/g, "-");

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
