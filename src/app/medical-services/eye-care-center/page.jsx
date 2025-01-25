import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";
import EyeCareCenter from "@/components/MedicalServices/EyeCareCenter/EyeCareCenter";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <LocationMobile />
        <p className="text-center py-3 lg:text-xl text-primaryFood bg-[#FFF1EA]">
          Find Eye Care Center
        </p>

        <EyeCareCenter />
      </div>

      <Footer />
    </>
  );
};

export default page;
