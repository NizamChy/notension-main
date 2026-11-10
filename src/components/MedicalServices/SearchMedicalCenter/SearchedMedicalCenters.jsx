"use client";

import { CiSearch } from "react-icons/ci";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCenter } from "@/hooks/fetch-data/useCenter";
import CenterGrid from "../Layout/CenterGrid";
import { MedicalCardGrid, MedicalContainer } from "../Layout/MedicalLayout";

const SearchedMedicalCenters = () => {
  const [centerInfo, setCenterInfo] = useState([]);
  const { searchConsultationCenter, progressing } = useCenter();

  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");

  const centerType = "Consultation Center";

  useEffect(() => {
    if (!searchText) return;
    searchConsultationCenter(centerType, searchText, setCenterInfo);
  }, [searchText]);

  return (
    <>
      <MedicalContainer className="py-6 md:py-8">
        {searchText ? (
          <h2 className="text-base md:text-xl font-medium text-gray-500 pb-4 md:pb-5">
            Found for{" "}
            <span className="text-gray-700">&ldquo;{searchText}&rdquo;</span>
          </h2>
        ) : (
          <p className="text-center text-sm md:text-base text-mediumGray py-10">
            Search hospitals, diagnostic, eye care and dental care centers.
          </p>
        )}

        {searchText && !progressing && centerInfo?.length < 1 && (
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

        {searchText && progressing ? (
          <MedicalCardGrid className="xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="aspect-[2/1] bg-gray-200" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </MedicalCardGrid>
        ) : (
          <CenterGrid centers={centerInfo} />
        )}
      </MedicalContainer>
    </>
  );
};

export default SearchedMedicalCenters;
