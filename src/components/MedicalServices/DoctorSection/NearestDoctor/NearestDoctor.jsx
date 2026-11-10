"use client";

import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import DoctorInfoCard from "../DoctorCard/DoctorInfoCard";
import {
  MedicalCardGrid,
  MedicalSectionTitle,
} from "../../Layout/MedicalLayout";

const NearestDoctor = () => {
  const [doctorsInfo, setDoctorsInfo] = useState(null);

  const { getNearestDoctorsInfo, progressing } = useDoctor();

  useEffect(() => {
    getNearestDoctorsInfo(setDoctorsInfo);
  }, []);

  if (progressing) return <Loader />;

  return (
    <section className="min-h-[40vh]">
      <MedicalSectionTitle>Doctors near you</MedicalSectionTitle>

      {doctorsInfo?.length > 0 ? (
        <MedicalCardGrid>
          {doctorsInfo.map((doctor) => (
            <DoctorInfoCard key={doctor?._id} doctor={doctor} />
          ))}
        </MedicalCardGrid>
      ) : (
        <p className="py-16 text-center text-mediumGray">
          No doctor found near your location.
        </p>
      )}
    </section>
  );
};

export default NearestDoctor;
