import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";
import DoctorHome from "@/components/MedicalServices/DoctorSection/DoctorHome/DoctorHome";

const page = () => {
  return (
    <>
      <Navbar />

      <div className="pt-20">
        <LocationMobile />
        <p className="text-center py-3 lg:text-xl text-primaryFood bg-[#FFF1EA]">
          Find Doctor
        </p>
      </div>

      <DoctorHome />

      <Footer />
    </>
  );
};

export default page;
