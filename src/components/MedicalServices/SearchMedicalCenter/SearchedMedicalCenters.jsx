"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCenter } from "@/hooks/fetch-data/useCenter";
import NoStoreFound from "@/components/ShopInfoSection/NoStoreFound";
import MedicalCenterCard from "../MedicalCenterCard/MedicalCenterCard";
import ShopInfoCardSkeleton from "@/components/ShopInfoSection/ShopInfoCardSkeleton";

const SearchedMedicalCenters = () => {
  const [centerInfo, setCenterInfo] = useState([]);
  const { searchConsultationCenter, progressing } = useCenter();

  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");

  const centerType = "Consultation Center";

  useEffect(() => {
    searchConsultationCenter(centerType, searchText, setCenterInfo);
  }, [searchText]);

  console.log("searchConsultationCenter:", centerInfo);

  return (
    <>
      <div className="mx-auto px-4 lg:px-24 py-6">
        <h4 className="text-sm md:text-xl font-medium text-gray-500 pb-4">
          Found for <span className="text-gray-700">"{searchText}"</span>
        </h4>

        {!progressing && centerInfo?.length < 1 && <NoStoreFound />}

        {progressing && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <ShopInfoCardSkeleton key={index} />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {centerInfo.map((center) => (
            <MedicalCenterCard key={center._id} center={center} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchedMedicalCenters;
