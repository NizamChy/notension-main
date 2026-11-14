"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuStethoscope } from "react-icons/lu";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import { EmptyState, PageHeader } from "@/components/shared/UI/UI";
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
  const [pageNo, setPageNo] = useState(1);
  const [doctorsInfo, setDoctorsInfo] = useState([]);

  const params = useParams();
  const { getDoctorsInfoByDistrict, loadingMore, allLoaded } = useDoctor();

  const { currentDept } = useSelector((state) => state.doctorInfo);

  const deptId = params?.deptId || null;
  const deptName = currentDept?.dept_name;

  useEffect(() => {
    getDoctorsInfoByDistrict(deptId, setDoctorsInfo, pageNo, setPageNo);
  }, []);

  return (
    <MedicalPageBody>
      <PageHeader
        className="!mb-0"
        back="/medical-services/doctor"
        backLabel="All departments"
        title={deptName ? `${deptName} specialists` : "Specialists"}
        subtitle={
          currentDept?.dept_name_bn
            ? `${currentDept.dept_name_bn} বিশেষজ্ঞ ডাক্তার`
            : "Doctors in your district, ready to book."
        }
      />

      <NearestDoctorSlider hideWhenEmpty wide />

      <section>
        <MedicalSectionTitle
          subtitle={
            doctorsInfo?.length > 0
              ? `${doctorsInfo.length}${loadingMore && !allLoaded ? "+" : ""} doctors found`
              : null
          }
        >
          Doctors{deptName ? ` in ${deptName}` : ""}
        </MedicalSectionTitle>

        {!allLoaded && doctorsInfo?.length < 1 && (
          <SkeletonGrid count={6} item={DoctorCardSkeleton} />
        )}

        {doctorsInfo && doctorsInfo?.length > 0 ? (
          <InfiniteScroll
            dataLength={doctorsInfo?.length}
            next={() => {
              getDoctorsInfoByDistrict(
                deptId,
                setDoctorsInfo,
                pageNo,
                setPageNo
              );
            }}
            hasMore={loadingMore}
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

        {allLoaded && doctorsInfo?.length < 1 && (
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
