"use client";

import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useCenter } from "@/hooks/fetch-data/useCenter";
import MedicalCenterCard from "../MedicalCenterCard/MedicalCenterCard";

const NearestDiagnostic = () => {
  const [centerInfo, setCenterInfo] = useState([]);

  const { getNearestCenterInfo, progressing } = useCenter();

  const centerType = "Diagnostic Centre";

  useEffect(() => {
    getNearestCenterInfo(centerType, setCenterInfo);
  }, []);

  return (
    <>
      <p className="text-center mt-2 md:mt-0 py-3 lg:text-xl text-primaryFood bg-[#FFF1EA]">
        Nearest Diagnostic Center
      </p>
      {progressing ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-center px-4 lg:px-20 xl:px-28 py-5 lg:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {centerInfo?.map((center) => (
                <MedicalCenterCard key={center?._id} center={center} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NearestDiagnostic;
