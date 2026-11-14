"use client";

import React, { useEffect, useState } from "react";
import { LuMapPinned } from "react-icons/lu";
import { useCenter } from "@/hooks/fetch-data/useCenter";
import { EmptyState } from "@/components/shared/UI/UI";
import CenterGrid from "./CenterGrid";
import {
  MedicalPageBody,
  MedicalPageHeader,
  MedicalSectionTitle,
} from "./MedicalLayout";
import { CenterCardSkeleton, SkeletonGrid } from "./MedicalUI";

// Shared body of every "Nearest <center type>" page.
const NearestCenterListing = ({
  centerType,
  title,
  subtitle = "Sorted by distance from your current location.",
  back,
  backLabel,
}) => {
  const [centerInfo, setCenterInfo] = useState([]);

  const { getNearestCenterInfo, progressing } = useCenter();

  useEffect(() => {
    getNearestCenterInfo(centerType, setCenterInfo);
  }, []);

  return (
    <>
      <MedicalPageHeader
        title={title}
        subtitle={subtitle}
        back={back}
        backLabel={backLabel}
      />
      <MedicalPageBody className="min-h-content">
        {progressing ? (
          <SkeletonGrid
            count={8}
            item={CenterCardSkeleton}
            className="xl:grid-cols-4"
          />
        ) : centerInfo?.length > 0 ? (
          <section>
            <MedicalSectionTitle>
              {centerInfo.length} {centerInfo.length === 1 ? "centre" : "centres"}{" "}
              near you
            </MedicalSectionTitle>
            <CenterGrid centers={centerInfo} />
          </section>
        ) : (
          <EmptyState
            icon={<LuMapPinned />}
            title="No centre found near you"
            text="Check that location access is on, or pick a different area from the location menu."
          />
        )}
      </MedicalPageBody>
    </>
  );
};

export default NearestCenterListing;
