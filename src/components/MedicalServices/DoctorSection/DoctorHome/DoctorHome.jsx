"use client";

import DoctorNav from "./DoctorNav";
import React, { useEffect } from "react";
import DoctorSlider from "./DoctorSlider";
import { useSelector } from "react-redux";
import Loader from "@/components/common/Loader";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import DoctorDepartment from "../DoctorCategory/DoctorDepartment";
import PopularDoctorSlider from "../PopularDoctor/PopularDoctorSlider";
import { MedicalPageBody } from "../../Layout/MedicalLayout";

const DoctorHome = () => {
  const { exploreFindDoctor } = useDoctor();
  const { isLoading } = useSelector((state) => state.doctorInfo);

  useEffect(() => {
    exploreFindDoctor();
  }, []);

  return (
    <MedicalPageBody>
      {/* Hero: slider and the two shortcut tiles share one row height. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <DoctorSlider />
        <DoctorNav />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <PopularDoctorSlider startValue={0} endValue={5} />

          <DoctorDepartment
            sliceStart={0}
            sliceEnd={12}
            imageWidth={300}
            imageHeight={300}
            imageKey="banner_1"
            bgClassName="bg-[#F3F7FB]"
          />

          <PopularDoctorSlider startValue={5} endValue={10} />

          <DoctorDepartment
            sliceStart={12}
            sliceEnd={16}
            imageWidth={600}
            imageHeight={300}
            imageKey="banner_2"
            bgClassName="bg-[#DEF9EC]"
          />

          <PopularDoctorSlider startValue={10} endValue={15} />

          <DoctorDepartment
            sliceStart={16}
            sliceEnd={20}
            imageWidth={600}
            imageHeight={300}
            imageKey="banner_2"
            bgClassName="bg-[#FFFCEB]"
          />

          <PopularDoctorSlider startValue={15} endValue={20} />

          <DoctorDepartment
            sliceStart={20}
            sliceEnd={29}
            imageWidth={300}
            imageHeight={300}
            imageKey="banner_1"
            bgClassName="bg-[#F2FCE4]"
          />

          <PopularDoctorSlider startValue={20} endValue={25} />

          <DoctorDepartment
            sliceStart={29}
            sliceEnd={33}
            imageWidth={600}
            imageHeight={300}
            imageKey="banner_2"
            bgClassName="bg-[#FFF3FF]"
          />
        </>
      )}
    </MedicalPageBody>
  );
};

export default DoctorHome;
