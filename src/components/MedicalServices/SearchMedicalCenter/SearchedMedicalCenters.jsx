"use client";

import { CiSearch } from "react-icons/ci";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCenter } from "@/hooks/fetch-data/useCenter";
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

  return (
    <>
      <div className="mx-auto px-4 lg:px-24 py-6">
        <h4 className="text-sm md:text-xl font-medium text-gray-500 pb-4">
          Found for <span className="text-gray-700">"{searchText}"</span>
        </h4>

        {!progressing && centerInfo?.length < 1 && (
          <div className="flex flex-col justify-center items-center mt-10 lg:mt-20">
            <CiSearch className="text-8xl text-deepGray" />

            <p className="text-center text-xl lg:text-2xl font-medium text-deepGray">
              Search No Result!
            </p>
            <p className="text-center text-sm font-medium text-mediumGray mt-2">
              We cannot find any matches for your search term.
            </p>
          </div>
        )}

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
