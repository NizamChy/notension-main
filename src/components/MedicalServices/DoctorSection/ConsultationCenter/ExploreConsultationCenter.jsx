"use client";

import { useSelector } from "react-redux";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useCenter } from "@/hooks/fetch-data/useCenter";
import ExploreConsultationCenterInfo from "./ExploreConsultationCenterInfo";
import VisitedDoctorDepartment from "../DoctorCategory/VisitedDoctorDepartment";
import VisitedPopularDoctorSlider from "../PopularDoctor/VisitedPopularDoctorSlider";
import { MedicalPageBody } from "../../Layout/MedicalLayout";

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
        <MedicalPageBody>
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
              sliceStart={15}
              sliceEnd={21}
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

          {allDeptInfo?.length > 21 && (
            <VisitedDoctorDepartment
              sliceStart={21}
              sliceEnd={30}
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

          {allDeptInfo?.length > 30 && (
            <VisitedDoctorDepartment
              sliceStart={30}
              sliceEnd={34}
              imageWidth={600}
              imageHeight={300}
              imageKey="banner_2"
              bgClassName="bg-[#FFF3FF]"
              allDeptInfo={allDeptInfo}
            />
          )}
        </MedicalPageBody>
      )}
    </div>
  );
};

export default ExploreConsultationCenter;
