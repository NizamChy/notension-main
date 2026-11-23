"use client";

import React from "react";
import { LuStethoscope } from "react-icons/lu";
import { useNearestDoctors } from "@/hooks/healthCare/useDoctors";
import { EmptyState } from "@/components/shared/UI/UI";
import DoctorInfoCard from "../DoctorCard/DoctorInfoCard";
import {
  MedicalCardGrid,
  MedicalSectionTitle,
} from "../../Layout/MedicalLayout";
import { DoctorCardSkeleton, SkeletonGrid } from "../../Layout/MedicalUI";

const NearestDoctor = () => {
  const { doctors: doctorsInfo, isLoading: loading } = useNearestDoctors();

  return (
    <section className="min-h-[40vh]">
      <MedicalSectionTitle
        subtitle={
          !loading && doctorsInfo?.length > 0
            ? `${doctorsInfo.length} ${doctorsInfo.length === 1 ? "doctor" : "doctors"}, closest first`
            : null
        }
      >
        Doctors near you
      </MedicalSectionTitle>

      {loading ? (
        <SkeletonGrid count={6} item={DoctorCardSkeleton} />
      ) : doctorsInfo?.length > 0 ? (
        <MedicalCardGrid>
          {doctorsInfo.map((doctor) => (
            <DoctorInfoCard key={doctor?._id} doctor={doctor} />
          ))}
        </MedicalCardGrid>
      ) : (
        <EmptyState
          icon={<LuStethoscope />}
          title="No doctor found near you"
          text="Check that location access is on, or browse doctors by department."
        />
      )}
    </section>
  );
};

export default NearestDoctor;
