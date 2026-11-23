"use client";

import React from "react";
import { LuHospital } from "react-icons/lu";
import { useCentersByDistrict } from "@/hooks/healthCare/useCenters";
import InfiniteScroll from "react-infinite-scroll-component";
import { EmptyState } from "@/components/shared/UI/UI";
import CenterHero from "./CenterHero";
import CenterGrid from "./CenterGrid";
import { MedicalPageBody, MedicalSectionTitle } from "./MedicalLayout";
import { CenterCardSkeleton, InlineSpinner, SkeletonGrid } from "./MedicalUI";
import SearchCenter from "../SearchMedicalCenter/SearchCenter";

// Shared body of the Eye care / Dental / Hospital / Diagnostic / Consultation
// center pages: search field, hero row (slider + nearest promo) and the
// infinite list of centers in the current district.
const CenterDistrictListing = ({
  centerType,
  heroHref,
  heroImage,
  heroAlt,
  sliderNode = null,
  listTitle = "Centres in your district",
  listSubtitle,
  emptyTitle = "No centres found in your district",
}) => {
  const {
    centers: centerInfo,
    banner,
    isLoading,
    hasMore,
    loadMore,
  } = useCentersByDistrict(centerType);

  // All banners except the last one go to the slider.
  const slider = banner?.length > 1 ? banner.slice(0, -1) : [];

  return (
    <MedicalPageBody>
      <SearchCenter />

      <CenterHero
        slider={slider}
        sliderNode={sliderNode}
        href={heroHref}
        image={heroImage}
        alt={heroAlt}
      />

      <section>
        <MedicalSectionTitle subtitle={listSubtitle}>{listTitle}</MedicalSectionTitle>

        {isLoading && (
          <SkeletonGrid
            count={4}
            item={CenterCardSkeleton}
            className="xl:grid-cols-4"
          />
        )}

        {centerInfo && centerInfo?.length > 0 ? (
          <InfiniteScroll
            dataLength={centerInfo?.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<InlineSpinner />}
            style={{ overflow: "visible" }}
          >
            <CenterGrid centers={centerInfo} />
          </InfiniteScroll>
        ) : null}

        {!isLoading && centerInfo?.length < 1 && (
          <EmptyState
            icon={<LuHospital />}
            title={emptyTitle}
            text="Try changing your location, or find the nearest one to you."
          />
        )}
      </section>
    </MedicalPageBody>
  );
};

export default CenterDistrictListing;
