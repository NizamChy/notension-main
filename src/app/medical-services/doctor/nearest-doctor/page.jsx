import React from "react";
import NearestDoctor from "@/components/MedicalServices/DoctorSection/NearestDoctor/NearestDoctor";
import NearestDoctorSlider from "@/components/MedicalServices/DoctorSection/NearestDoctor/NearestDoctorSlider";

const page = () => {
  return (
    <>
      <p className="text-center mt-2 md:mt-0 py-3 lg:text-xl text-primaryFood bg-[#FFF1EA]">
        Nearest Doctor Info
      </p>
      <div className="lg:flex justify-center my-10 gap-5 px-4 lg:px-0">
        <NearestDoctorSlider />
      </div>
      <NearestDoctor />
    </>
  );
};

export default page;
