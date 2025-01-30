"use client";

import { useSelector } from "react-redux";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useCenter } from "@/hooks/fetch-data/useCenter";
import ExploreConsultationCenterInfo from "./ExploreConsultationCenterInfo";
import VisitedDoctorDepartment from "../DoctorCategory/VisitedDoctorDepartment";
import VisitedPopularDoctorSlider from "../PopularDoctor/VisitedPopularDoctorSlider";

const ExploreConsultationCenter = () => {
  const [slider, setSlider] = useState([]);
  const [allDeptInfo, setAllDeptInfo] = useState([]);
  const [exploreInfo, setExploreInfo] = useState(null);

  const { exploreConsultationCenter, progressing } = useCenter();
  const { currentCenter } = useSelector((state) => state.doctorInfo);

  useEffect(() => {
    exploreConsultationCenter(currentCenter, setExploreInfo);
  }, [currentCenter]);

  useEffect(() => {
    if (!progressing && exploreInfo?.popularDoctorsByCenter?.length > 0) {
      setSlider(exploreInfo?.popularDoctorsByCenter);
    }

    if (!progressing && exploreInfo?.departmentsInfoByCenter?.length > 0) {
      setAllDeptInfo(exploreInfo?.departmentsInfoByCenter);
    }
  }, [exploreInfo]);

  return (
    <div className="min-h-content">
      {progressing ? (
        <Loader />
      ) : (
        <div className="lg:px-28 space-y-10">
          <ExploreConsultationCenterInfo />

          {slider?.length > 0 && (
            <VisitedPopularDoctorSlider
              popularDoctors={slider}
              startValue={0}
              endValue={5}
            />
          )}

          {allDeptInfo?.length > 0 && (
            <VisitedDoctorDepartment
              gridClassName="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5"
              sliceStart={0}
              sliceEnd={12}
              imageWidth={300}
              imageHeight={300}
              imageKey="banner_1"
              bgClassName="bg-[#F3F7FB]"
              allDeptInfo={allDeptInfo}
            />
          )}

          {slider?.length > 5 && (
            <VisitedPopularDoctorSlider
              popularDoctors={slider}
              startValue={5}
              endValue={10}
            />
          )}

          {allDeptInfo?.length > 12 && (
            <VisitedDoctorDepartment
              gridClassName="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5"
              sliceStart={12}
              sliceEnd={16}
              imageWidth={600}
              imageHeight={300}
              imageKey="banner_2"
              bgClassName="bg-[#DEF9EC]"
              allDeptInfo={allDeptInfo}
            />
          )}

          {slider?.length > 10 && (
            <VisitedPopularDoctorSlider
              popularDoctors={slider}
              startValue={10}
              endValue={15}
            />
          )}

          {allDeptInfo?.length > 15 && (
            <VisitedDoctorDepartment
              gridClassName="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5"
              sliceStart={15}
              sliceEnd={20}
              imageWidth={300}
              imageHeight={300}
              imageKey="banner_1"
              bgClassName="bg-[#F2FCE4]"
              allDeptInfo={allDeptInfo}
            />
          )}

          {slider?.length > 15 && (
            <VisitedPopularDoctorSlider
              popularDoctors={slider}
              startValue={15}
              endValue={20}
            />
          )}

          {allDeptInfo?.length > 20 && (
            <VisitedDoctorDepartment
              gridClassName="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5"
              sliceStart={20}
              sliceEnd={29}
              imageWidth={600}
              imageHeight={300}
              imageKey="banner_2"
              bgClassName="bg-[#FFF3FF]"
              allDeptInfo={allDeptInfo}
            />
          )}

          {slider?.length > 20 && (
            <VisitedPopularDoctorSlider
              popularDoctors={slider}
              startValue={20}
              endValue={25}
            />
          )}

          {allDeptInfo?.length > 29 && (
            <VisitedDoctorDepartment
              gridClassName="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5"
              sliceStart={29}
              sliceEnd={33}
              imageWidth={600}
              imageHeight={300}
              imageKey="banner_2"
              bgClassName="bg-[#FFF3FF]"
              allDeptInfo={allDeptInfo}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ExploreConsultationCenter;
