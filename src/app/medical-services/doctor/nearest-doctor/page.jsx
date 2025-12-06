import React from "react";
import NearestDoctor from "@/components/MedicalServices/DoctorSection/NearestDoctor/NearestDoctor";
import NearestDoctorSlider from "@/components/MedicalServices/DoctorSection/NearestDoctor/NearestDoctorSlider";

const page = () => {
  return (
    <>
      <p className="text-center mt-2 md:mt-0 py-3 lg:text-xl text-primaryFood bg-[#FFF1EA]">
        Nearest Doctor Info
      </p>

      <div className="flex justify-center">
        <div className="w-full lg:w-3/4 p-4">
          <div className="rounded-2xl shadow-lg overflow-hidden bg-white p-2">
            <NearestDoctorSlider />
          </div>
        </div>
      </div>

      <NearestDoctor />
    </>
  );
};

export default page;
