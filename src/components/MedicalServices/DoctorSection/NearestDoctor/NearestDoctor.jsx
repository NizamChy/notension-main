"use client";

import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import DoctorInfoCard from "../DoctorCard/DoctorInfoCard";

const NearestDoctor = () => {
  const [doctorsInfo, setDoctorsInfo] = useState(null);

  const { getNearestDoctorsInfo, progressing } = useDoctor();

  useEffect(() => {
    getNearestDoctorsInfo(setDoctorsInfo);
  }, []);

  return (
    <div className="container min-h-content px-2 md:px-4">
      {progressing ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-5 lg:gap-10 justify-center items-center">
            {doctorsInfo?.map((doctor) => (
              <DoctorInfoCard key={doctor?._id} doctor={doctor} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NearestDoctor;
