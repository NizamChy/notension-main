"use client";

import DoctorNav from "./DoctorNav";
import React, { useEffect } from "react";
import DoctorSlider from "./DoctorSlider";
import { useSelector } from "react-redux";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import { Skeleton } from "@/components/shared/UI/UI";
import DoctorDepartment from "../DoctorCategory/DoctorDepartment";
import PopularDoctorSlider from "../PopularDoctor/PopularDoctorSlider";
import { MedicalPageBody } from "../../Layout/MedicalLayout";
import { DoctorCardSkeleton, SkeletonGrid } from "../../Layout/MedicalUI";

const MORE_DEPARTMENTS = { title: "More departments", subtitle: null };
const MORE_DOCTORS = { title: "More specialists", subtitle: null };

const DoctorHome = () => {
  const { exploreFindDoctor } = useDoctor();
  const { isLoading } = useSelector((state) => state.doctorInfo);

  useEffect(() => {
    exploreFindDoctor();
  }, []);

  return (
    <MedicalPageBody>
      {/* Hero: slider and the two shortcut tiles share one row height. */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
        <DoctorSlider />
        <DoctorNav />
      </div>

      {isLoading ? (
        <div className="space-y-4" role="status" aria-label="Loading doctors">
          <Skeleton className="h-6 w-48" />
          <SkeletonGrid count={3} item={DoctorCardSkeleton} />
        </div>
      ) : (
        <>
          <PopularDoctorSlider startValue={0} endValue={5} />

          <DoctorDepartment
            sliceStart={0}
            sliceEnd={12}
            imageWidth={300}
            imageHeight={300}
            imageKey="banner_1"
          />

          <PopularDoctorSlider startValue={5} endValue={10} {...MORE_DOCTORS} />

          <DoctorDepartment
            sliceStart={12}
            sliceEnd={16}
            imageWidth={600}
            imageHeight={300}
            imageKey="banner_2"
            {...MORE_DEPARTMENTS}
          />

          <PopularDoctorSlider startValue={10} endValue={15} {...MORE_DOCTORS} />

          <DoctorDepartment
            sliceStart={16}
            sliceEnd={20}
            imageWidth={600}
            imageHeight={300}
            imageKey="banner_2"
            {...MORE_DEPARTMENTS}
          />

          <PopularDoctorSlider startValue={15} endValue={20} {...MORE_DOCTORS} />

          <DoctorDepartment
            sliceStart={20}
            sliceEnd={29}
            imageWidth={300}
            imageHeight={300}
            imageKey="banner_1"
            {...MORE_DEPARTMENTS}
          />

          <PopularDoctorSlider startValue={20} endValue={25} {...MORE_DOCTORS} />

          <DoctorDepartment
            sliceStart={29}
            sliceEnd={33}
            imageWidth={600}
            imageHeight={300}
            imageKey="banner_2"
            {...MORE_DEPARTMENTS}
          />
        </>
      )}
    </MedicalPageBody>
  );
};

export default DoctorHome;
