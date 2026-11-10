"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMedicine } from "@/hooks/fetch-data/useMedicine";
import NoStoreFound from "../../ShopInfoSection/NoStoreFound";
import ShopInfoCard from "../../ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "../../ShopInfoSection/ShopInfoCardSkeleton";

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
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <h1 className="text-lg md:text-2xl font-bold text-deepGray mb-4 md:mb-6">
        Nearest Medicine Stores
      </h1>

      {!progressing && nearestInfo?.length < 1 && <NoStoreFound />}

      {progressing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ShopInfoCardSkeleton key={index} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {nearestInfo?.map((shop) => (
          <ShopInfoCard
            onClick={() => {
              handleStoreClick(shop);
            }}
            key={shop?._id}
            shop={shop}
            type="medicine"
          />
        ))}
      </div>
    </div>
  );
};

export default MedicineSection;
