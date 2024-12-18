"use client";

import React, { useEffect, useState } from "react";
import { useMedicine } from "@/hooks/fetch-data/useMedicine";
import ShopInfoCard from "../ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "../ShopInfoSection/ShopInfoCardSkeleton";
import NoStoreFound from "../ShopInfoSection/NoStoreFound";

const MedicineSection = () => {
  const [nearestInfo, setNearestInfo] = useState([]);
  const { getNearestMedicineStoreInfo, progressing } = useMedicine();

  useEffect(() => {
    getNearestMedicineStoreInfo(setNearestInfo, 1000);
  }, []);

  return (
    <div className="mx-auto px-4 lg:px-24 py-6">
      <h1 className="text-2xl font-bold mb-6 text-deepGray">
        Nearest Medicine Stores
      </h1>

      {!progressing && nearestInfo?.length < 1 && <NoStoreFound />}

      {progressing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <ShopInfoCardSkeleton key={index} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {nearestInfo.map((shop) => (
          <ShopInfoCard key={shop._id} shop={shop} type="medicine" />
        ))}
      </div>
    </div>
  );
};

export default MedicineSection;
