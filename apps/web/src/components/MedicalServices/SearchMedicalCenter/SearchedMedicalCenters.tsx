"use client";

import { LuSearch, LuSearchX } from "react-icons/lu";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useCenterSearch } from "@/hooks/healthCare/useCenters";
import { EmptyState } from "@/components/shared/UI/UI";
import CenterGrid from "../Layout/CenterGrid";
import { MedicalContainer, MedicalSectionTitle } from "../Layout/MedicalLayout";
import { CenterCardSkeleton, SkeletonGrid } from "../Layout/MedicalUI";

const SearchedMedicalCenters = () => {
  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");

  const { centers: centerInfo, isLoading: progressing } = useCenterSearch(
    "Consultation Center",
    searchText ?? "",
  );

  return (
    <MedicalContainer className="py-6 md:py-10">
      {!searchText && (
        <EmptyState
          icon={<LuSearch />}
          title="Search medical centres"
          text="Find hospitals, diagnostic, eye care and dental care centres by name or area."
        />
      )}

      {searchText && progressing && (
        <SkeletonGrid
          count={8}
          item={CenterCardSkeleton}
          className="xl:grid-cols-4"
        />
      )}

      {searchText && !progressing && centerInfo?.length < 1 && (
        <EmptyState
          icon={<LuSearchX />}
          title={`No results for “${searchText}”`}
          text="Check the spelling or try a shorter name, area or centre type."
        />
      )}

      {searchText && !progressing && centerInfo?.length > 0 && (
        <section>
          <MedicalSectionTitle
            subtitle={`${centerInfo.length} ${centerInfo.length === 1 ? "centre" : "centres"} found`}
          >
            Results for &ldquo;{searchText}&rdquo;
          </MedicalSectionTitle>
          <CenterGrid centers={centerInfo} />
        </section>
      )}
    </MedicalContainer>
  );
};

export default SearchedMedicalCenters;
