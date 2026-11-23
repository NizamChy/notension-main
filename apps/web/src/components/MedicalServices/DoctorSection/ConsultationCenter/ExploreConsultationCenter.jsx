"use client";

import { useParams } from "next/navigation";
import React from "react";
import Link from "next/link";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { EmptyState, SECONDARY_BUTTON, Skeleton } from "@/components/shared/UI/UI";
import { useConsultationCenter } from "@/hooks/healthCare/useCenters";
import ExploreConsultationCenterInfo from "./ExploreConsultationCenterInfo";
import VisitedDoctorDepartment from "../DoctorCategory/VisitedDoctorDepartment";
import VisitedPopularDoctorSlider from "../PopularDoctor/VisitedPopularDoctorSlider";
import { MedicalPageBody } from "../../Layout/MedicalLayout";
import { DoctorCardSkeleton, SkeletonGrid } from "../../Layout/MedicalUI";

const DOCTORS_HERE = {
  title: "Doctors at this centre",
  subtitle: "এই কেন্দ্রের বিশেষজ্ঞ ডাক্তার",
};
const MORE_DOCTORS = { title: "More doctors", subtitle: null };
const DEPARTMENTS = {
  title: "Departments at this centre",
  subtitle: "বিভাগ অনুযায়ী ডাক্তার খুঁজুন",
};
const MORE_DEPARTMENTS = { title: "More departments", subtitle: null };

const ExploreConsultationCenter = () => {
  // The URL decides which centre this is.
  const centerId = useParams()?.id;
  const {
    center,
    popularDoctors: slider,
    departments: allDeptInfo,
    isLoading: loading,
    notFound,
  } = useConsultationCenter(centerId);

  return (
    <div className="min-h-content">
      {loading ? (
        <MedicalPageBody>
          <Skeleton className="h-[420px] w-full rounded-2xl! md:h-[260px]" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <SkeletonGrid count={3} item={DoctorCardSkeleton} />
          </div>
        </MedicalPageBody>
      ) : notFound ? (
        <MedicalPageBody>
          <EmptyState
            icon={<HiOutlineBuildingOffice2 />}
            title="Centre not found"
            text="This link doesn't match a hospital or consultation centre. It may have moved or been removed."
            action={
              <Link
                href="/medical-services/doctor/consultation-center"
                className={SECONDARY_BUTTON}
              >
                Browse centres
              </Link>
            }
            className="min-h-[40vh]"
          />
        </MedicalPageBody>
      ) : (
        <MedicalPageBody>
          <ExploreConsultationCenterInfo center={center} />

          {slider?.length > 0 && (
            <VisitedPopularDoctorSlider
              popularDoctors={slider}
              startValue={0}
              endValue={5}
              {...DOCTORS_HERE}
            />
          )}

          {allDeptInfo?.length > 0 && (
            <VisitedDoctorDepartment
              sliceStart={0}
              sliceEnd={12}
              imageWidth={300}
              imageHeight={300}
              imageKey="banner_1"
              allDeptInfo={allDeptInfo}
              {...DEPARTMENTS}
            />
          )}

          {slider?.length > 5 && (
            <VisitedPopularDoctorSlider
              popularDoctors={slider}
              startValue={5}
              endValue={10}
              {...MORE_DOCTORS}
            />
          )}

          {allDeptInfo?.length > 12 && (
            <VisitedDoctorDepartment
              sliceStart={12}
              sliceEnd={16}
              imageWidth={600}
              imageHeight={300}
              imageKey="banner_2"
              allDeptInfo={allDeptInfo}
              {...MORE_DEPARTMENTS}
            />
          )}

          {slider?.length > 10 && (
            <VisitedPopularDoctorSlider
              popularDoctors={slider}
              startValue={10}
              endValue={15}
              {...MORE_DOCTORS}
            />
          )}

          {allDeptInfo?.length > 16 && (
            <VisitedDoctorDepartment
              sliceStart={16}
              sliceEnd={21}
              imageWidth={300}
              imageHeight={300}
              imageKey="banner_1"
              allDeptInfo={allDeptInfo}
              {...MORE_DEPARTMENTS}
            />
          )}

          {slider?.length > 15 && (
            <VisitedPopularDoctorSlider
              popularDoctors={slider}
              startValue={15}
              endValue={20}
              {...MORE_DOCTORS}
            />
          )}

          {allDeptInfo?.length > 21 && (
            <VisitedDoctorDepartment
              sliceStart={21}
              sliceEnd={30}
              imageWidth={600}
              imageHeight={300}
              imageKey="banner_2"
              allDeptInfo={allDeptInfo}
              {...MORE_DEPARTMENTS}
            />
          )}

          {slider?.length > 20 && (
            <VisitedPopularDoctorSlider
              popularDoctors={slider}
              startValue={20}
              endValue={25}
              {...MORE_DOCTORS}
            />
          )}

          {allDeptInfo?.length > 30 && (
            <VisitedDoctorDepartment
              sliceStart={30}
              sliceEnd={34}
              imageWidth={600}
              imageHeight={300}
              imageKey="banner_2"
              allDeptInfo={allDeptInfo}
              {...MORE_DEPARTMENTS}
            />
          )}
        </MedicalPageBody>
      )}
    </div>
  );
};

export default ExploreConsultationCenter;
