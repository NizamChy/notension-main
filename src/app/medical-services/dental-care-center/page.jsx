import React from "react";
import DentalCareCenter from "@/components/MedicalServices/DentalCareCenter/DentalCareCenter";

const page = () => {
  return (
    <>
      <p className="text-center mt-2 md:mt-0 py-3 lg:text-xl text-primaryFood bg-[#FFF1EA]">
        Find Dental Care Center
      </p>

      <DentalCareCenter />
    </>
  );
};

export default page;
