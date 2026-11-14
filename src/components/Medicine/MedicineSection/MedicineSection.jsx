"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMedicine } from "@/hooks/fetch-data/useMedicine";
import StoreList from "@/components/StoreModule/StoreList";

const MedicineSection = () => {
  const [nearestInfo, setNearestInfo] = useState([]);

  const router = useRouter();

  const { getNearestMedicineStoreInfo, progressing } = useMedicine();

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

    const formattedShopName = shop.shop_name
      ?.trim()
      .toLowerCase()
      .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
      .replace(/\s+/g, "-");

    router.push(
      `/medicine/${formattedShopName}/${shop?._id}/${shop?.custom_store_id}`
    );
  };

  useEffect(() => {
    getNearestMedicineStoreInfo(setNearestInfo, 1000);
  }, []);

  return (
    <StoreList
      moduleName="medicine"
      title="Pharmacies near you"
      subtitle="Pick a pharmacy to start ordering"
      shops={nearestInfo}
      isLoading={progressing}
      onShopClick={handleStoreClick}
      emptyTitle="No pharmacies nearby"
      emptyText="We don't have a pharmacy delivering to this area yet. Try changing your delivery location."
    />
  );
};

export default MedicineSection;
