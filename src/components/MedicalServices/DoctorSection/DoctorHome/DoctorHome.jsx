"use client";

import DoctorNav from "./DoctorNav";
import React, { useEffect } from "react";
import DoctorSlider from "./DoctorSlider";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import DoctorDepartment from "../DoctorCategory/DoctorDepartment";
import PopularDoctorSlider from "../PopularDoctor/PopularDoctorSlider";

const DoctorHome = () => {
  const { exploreFindDoctor } = useDoctor();

  useEffect(() => {
    exploreFindDoctor();
  }, []);

  return (
    <>
      <div className="lg:flex justify-center items-center my-5 lg:my-10 gap-5 px-4 lg:px-20">
        <div className="w-full lg:w-1/2 lg:p-10">
          <DoctorSlider />
        </div>

        <div className="w-full lg:w-1/2 lg:p-10 flex justify-center items-center">
          <DoctorNav />
        </div>
      </div>

      <div className="lg:px-28 space-y-10">
        <PopularDoctorSlider startValue={0} endValue={5} />

        <DoctorDepartment
          gridClassName="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5"
          sliceStart={0}
          sliceEnd={12}
          imageWidth={300}
          imageHeight={300}
          imageKey="banner_1"
          bgClassName="bg-[#F3F7FB]"
        />

        <PopularDoctorSlider startValue={5} endValue={10} />

        <DoctorDepartment
          gridClassName="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5"
          sliceStart={12}
          sliceEnd={16}
          imageWidth={600}
          imageHeight={300}
          imageKey="banner_2"
          bgClassName="bg-[#DEF9EC]"
        />

        <PopularDoctorSlider startValue={10} endValue={15} />

        <DoctorDepartment
          gridClassName="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5"
          sliceStart={16}
          sliceEnd={20}
          imageWidth={600}
          imageHeight={300}
          imageKey="banner_2"
          bgClassName="bg-[#FFFCEB]"
        />

        <PopularDoctorSlider startValue={15} endValue={20} />

        <DoctorDepartment
          gridClassName="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5"
          sliceStart={20}
          sliceEnd={29}
          imageWidth={300}
          imageHeight={300}
          imageKey="banner_1"
          bgClassName="bg-[#F2FCE4]"
        />

        <PopularDoctorSlider startValue={20} endValue={25} />

        <DoctorDepartment
          gridClassName="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5"
          sliceStart={29}
          sliceEnd={33}
          imageWidth={600}
          imageHeight={300}
          imageKey="banner_2"
          bgClassName="bg-[#FFF3FF]"
        />
      </div>
    </>
  );
};

export default DoctorHome;
