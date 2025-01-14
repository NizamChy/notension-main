import DoctorSlider from "@/components/MedicalServices/DoctorSection/DoctorHome/DoctorSlider";
import NearestDoctor from "@/components/MedicalServices/DoctorSection/NearestDoctor/NearestDoctor";
import Navbar from "@/components/shared/Navbar/Navbar";
import React from "react";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <div className="lg:flex justify-center my-10 gap-5 px-4 lg:px-0">
          <DoctorSlider />
        </div>

        <NearestDoctor />
      </div>
    </>
  );
};

export default page;
