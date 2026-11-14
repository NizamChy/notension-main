"use client";

import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { handleDoctorReducer } from "@/redux/doctorReducer";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/shared/UI/UI";
import { useCenter } from "@/hooks/fetch-data/useCenter";
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
  const [slider, setSlider] = useState([]);
  const [allDeptInfo, setAllDeptInfo] = useState([]);
  const [exploreInfo, setExploreInfo] = useState(null);

  const params = useParams();
  const dispatch = useDispatch();
  const { exploreConsultationCenter, progressing } = useCenter();
  const { currentCenter } = useSelector((state) => state.doctorInfo);

  // The URL decides which centre this is. The centre saved when a card was
  // clicked only fills in the type; a direct link loads the centre itself.
  const centerId = params?.id;
  const savedType =
    currentCenter?._id === centerId ? currentCenter?.center_type : undefined;

  useEffect(() => {
    if (!centerId) return;
    exploreConsultationCenter(
      { _id: centerId, center_type: savedType },
      setExploreInfo,
    );
    // exploreConsultationCenter is recreated on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerId]);

  useEffect(() => {
    if (progressing) return;
    const info = exploreInfo?.centerInfo;
    if (info?._id === centerId && currentCenter?._id !== centerId) {
      dispatch(handleDoctorReducer({ type: "SAVE_CENTER_INFO", data: info }));
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlider(exploreInfo?.popularDoctorsByCenter || []);
    setAllDeptInfo(exploreInfo?.departmentsInfoByCenter || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exploreInfo]);

  return (
    <div className="min-h-content">
      {progressing ? (
        <MedicalPageBody>
          <Skeleton className="h-[420px] w-full !rounded-2xl md:h-[260px]" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <SkeletonGrid count={3} item={DoctorCardSkeleton} />
          </div>
        </MedicalPageBody>
      ) : (
        <MedicalPageBody>
          <ExploreConsultationCenterInfo />

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

          {allDeptInfo?.length > 15 && (
            <VisitedDoctorDepartment
              sliceStart={15}
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
