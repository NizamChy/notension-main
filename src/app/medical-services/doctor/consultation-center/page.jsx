import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import DoctorSlider from "@/components/MedicalServices/DoctorSection/DoctorHome/DoctorSlider";
import ConsultationCenter from "@/components/MedicalServices/DoctorSection/ConsultationCenter/ConsultationCenter";
import Footer from "@/components/shared/Footer/Footer";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <p className="text-center py-3 text-xl text-primaryFood bg-[#FFF1EA]">
          Find Doctor By Consultation Center
        </p>
        <div className="lg:flex justify-center my-10 gap-5 px-4 lg:px-0">
          <DoctorSlider />
        </div>
        <ConsultationCenter />
      </div>

      <Footer />
    </>
  );
};

export default page;
