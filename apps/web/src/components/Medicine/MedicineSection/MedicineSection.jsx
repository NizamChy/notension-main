"use client";

import notify from "@/utils/notify";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMedicine } from "@/hooks/fetch-data/useMedicine";
import StoreList from "@/components/StoreModule/StoreList";
import { toSlug } from "@/utils/slug";

const MedicineSection = () => {
  const [nearestInfo, setNearestInfo] = useState([]);

  const router = useRouter();

  const { getNearestMedicineStoreInfo, progressing } = useMedicine();

  const handleStoreClick = (shop) => {
    if (!shop || !shop?.shop_name) return;

    if (shop?.is_closed)
      return notify.info("This store is closed right now. Please check back later.");

    const formattedShopName = toSlug(shop.shop_name);

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
