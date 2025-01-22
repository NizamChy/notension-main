import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";
import NearestDoctor from "@/components/MedicalServices/DoctorSection/NearestDoctor/NearestDoctor";
import NearestDoctorSlider from "@/components/MedicalServices/DoctorSection/NearestDoctor/NearestDoctorSlider";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <LocationMobile />
        <p className="text-center py-3 lg:text-xl text-primaryFood bg-[#FFF1EA]">
          Nearest Doctor Info
        </p>
        <div className="lg:flex justify-center my-10 gap-5 px-4 lg:px-0">
          <NearestDoctorSlider />
        </div>
        <NearestDoctor />
      </div>

      <Footer />
    </>
  );
};

export default page;
