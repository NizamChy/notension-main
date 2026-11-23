"use client";

import { useParams } from "next/navigation";
import React from "react";
import { LuStethoscope } from "react-icons/lu";
import { useDoctorsByDept, useFindDoctor } from "@/hooks/healthCare/useDoctors";
import { EmptyState, PageHeader } from "@/components/StoreModule/legacyViews";
import DoctorInfoCard from "../DoctorCard/DoctorInfoCard";
import InfiniteScroll from "react-infinite-scroll-component";
import NearestDoctorSlider from "../NearestDoctor/NearestDoctorSlider";
import {
  MedicalCardGrid,
  MedicalPageBody,
  MedicalSectionTitle,
} from "../../Layout/MedicalLayout";
import {
  DoctorCardSkeleton,
  InlineSpinner,
  SkeletonGrid,
} from "../../Layout/MedicalUI";

const DoctorInfoByDept = () => {
  const params = useParams<{ deptId?: string }>();
  const deptId = params?.deptId || null;
  const {
    doctors: doctorsInfo,
    isLoading,
    hasMore,
    loadMore,
  } = useDoctorsByDept(deptId);
  const { departments } = useFindDoctor();

  // The department in the URL, from the doctor home's list or else from the
  // doctors' chambers.
  const dept =
    departments.find((d) => d?._id === deptId) || doctorsInfo?.[0]?.deptInfo;
  const deptName = dept?.dept_name;

  return (
    <MedicalPageBody>
      <PageHeader
        className="mb-0!"
        back="/medical-services/doctor"
        backLabel="All departments"
        title={deptName ? `${deptName} specialists` : "Specialists"}
        subtitle={
          dept?.dept_name_bn
            ? `${dept.dept_name_bn} বিশেষজ্ঞ ডাক্তার`
            : "Doctors in your district, ready to book."
        }
      />

      <NearestDoctorSlider hideWhenEmpty wide />

      <section>
        <MedicalSectionTitle
          subtitle={
            doctorsInfo?.length > 0
              ? `${doctorsInfo.length}${hasMore ? "+" : ""} doctors found`
              : null
          }
        >
          Doctors{deptName ? ` in ${deptName}` : ""}
        </MedicalSectionTitle>

        {isLoading && (
          <SkeletonGrid count={6} item={DoctorCardSkeleton} />
        )}

        {doctorsInfo && doctorsInfo?.length > 0 ? (
          <InfiniteScroll
            dataLength={doctorsInfo?.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<InlineSpinner />}
            style={{ overflow: "visible" }}
          >
            <MedicalCardGrid>
              {doctorsInfo?.map((doctor) => (
                <DoctorInfoCard key={doctor?._id} doctor={doctor} />
              ))}
            </MedicalCardGrid>
          </InfiniteScroll>
        ) : null}

        {!isLoading && doctorsInfo?.length < 1 && (
          <EmptyState
            icon={<LuStethoscope />}
            title="No doctor found in this department"
            text="Try another department or look for doctors near you."
          />
        )}
      </section>
    </MedicalPageBody>
  );
};

export default DoctorInfoByDept;
