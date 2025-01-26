import React from "react";
import DoctorHome from "@/components/MedicalServices/DoctorSection/DoctorHome/DoctorHome";

const page = () => {
  return (
    <>
      <p className="text-center mt-2 md:mt-0 py-3 lg:text-xl text-primaryFood bg-[#FFF1EA]">
        Find Doctor
      </p>
      <DoctorHome />
    </>
  );
};

export default page;
