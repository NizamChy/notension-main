"use client";

import React, { type ReactNode } from "react";
import { LuMapPinned } from "react-icons/lu";
import { useNearestCenters } from "@/hooks/healthCare/useCenters";
import { EmptyState } from "@/components/shared/UI/UI";
import CenterGrid from "./CenterGrid";
import {
  MedicalPageBody,
  MedicalPageHeader,
  MedicalSectionTitle,
} from "./MedicalLayout";
import { CenterCardSkeleton, SkeletonGrid } from "./MedicalUI";
import type { CenterType } from "@/lib/api/healthCare";

type Props = {
  centerType: CenterType;
  title?: ReactNode;
  subtitle?: ReactNode;
  back?: string;
  backLabel?: ReactNode;
};

// Shared body of every "Nearest <center type>" page.
const NearestCenterListing = ({
  centerType,
  title,
  subtitle = "Sorted by distance from your current location.",
  back,
  backLabel,
}: Props) => {
  const { centers: centerInfo, isLoading: progressing } = useNearestCenters(centerType);

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
