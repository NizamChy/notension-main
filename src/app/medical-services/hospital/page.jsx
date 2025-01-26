import React from "react";
import HospitalSection from "@/components/MedicalServices/HospitalSection/HospitalSection";

const page = () => {
  return (
    <>
      <p className="text-center mt-2 md:mt-0 py-3 lg:text-xl text-primaryFood bg-[#FFF1EA]">
        Find Hospital
      </p>

      <HospitalSection />
    </>
  );
};

export default page;
