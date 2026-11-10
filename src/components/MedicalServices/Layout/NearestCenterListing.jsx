"use client";

import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useCenter } from "@/hooks/fetch-data/useCenter";
import CenterGrid from "./CenterGrid";
import { MedicalPageBody, MedicalPageHeader } from "./MedicalLayout";

// Shared body of every "Nearest <center type>" page.
const NearestCenterListing = ({ centerType, title }) => {
  const [centerInfo, setCenterInfo] = useState([]);

  const { getNearestCenterInfo, progressing } = useCenter();

  useEffect(() => {
    getNearestCenterInfo(centerType, setCenterInfo);
  }, []);

  return (
    <>
      <MedicalPageHeader title={title} />
      {progressing ? (
        <Loader />
      ) : (
        <MedicalPageBody className="min-h-content">
          {centerInfo?.length > 0 ? (
            <CenterGrid centers={centerInfo} />
          ) : (
            <p className="py-16 text-center text-mediumGray">
              No center found near your location.
            </p>
          )}
        </MedicalPageBody>
      )}
    </>
  );
};

export default NearestCenterListing;
