import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import DoctorSlider from "@/components/MedicalServices/DoctorSection/DoctorHome/DoctorSlider";
import ConsultationCenter from "@/components/MedicalServices/DoctorSection/ConsultationCenter/ConsultationCenter";
import Footer from "@/components/shared/Footer/Footer";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";
import Image from "next/image";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <LocationMobile />
        <p className="text-center py-3 lg:text-xl text-primaryFood bg-[#FFF1EA]">
          Find Doctor By Consultation Center
        </p>
        <div className="lg:flex justify-center items-center gap-5 my-10 lg:px-20 space-y-5 lg:space-y-0">
          <div className="w-full lg:w-1/2 lg:p-10">
            <DoctorSlider />
          </div>

          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <Image
              src="/images/medical-services/find-near-consultation.jpg"
              alt="find-near-consultation"
              width={800}
              height={400}
              className="rounded-lg w-full"
            />
          </div>
        </div>
        <ConsultationCenter />
      </div>

      <Footer />
    </>
  );
};

export default page;
