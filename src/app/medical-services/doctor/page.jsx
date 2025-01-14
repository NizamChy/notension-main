import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import DoctorNav from "@/components/MedicalServices/DoctorSection/DoctorHome/DoctorNav";
import DoctorSlider from "@/components/MedicalServices/DoctorSection/DoctorHome/DoctorSlider";
import FirstDoctorCategory from "@/components/MedicalServices/DoctorSection/DoctorCategory/FirstDoctorCategory";
import SecondDoctorCategory from "@/components/MedicalServices/DoctorSection/DoctorCategory/SecondDoctorCategory";
import ThirdDoctorCategory from "@/components/MedicalServices/DoctorSection/DoctorCategory/ThirdDoctorCategory";
import FourthDoctorCategory from "@/components/MedicalServices/DoctorSection/DoctorCategory/FourthDoctorCategory";
import FifthDoctorCategory from "@/components/MedicalServices/DoctorSection/DoctorCategory/FifthDoctorCategory";
import PopularDoctorFirstSlider from "@/components/MedicalServices/DoctorSection/PopularDoctor/PopularDoctorFirstSlider";

const page = () => {
  return (
    <>
      <Navbar />
      <p className="text-center py-3 text-xl text-primaryFood bg-[#FFF1EA] pt-20">
        Find Doctor
      </p>

      <div className="lg:flex justify-center my-10 gap-5 px-4 lg:px-0">
        <DoctorSlider />
        <DoctorNav />
      </div>

      <div className="lg:px-28 space-y-10">
        <PopularDoctorFirstSlider />
        <FirstDoctorCategory />
        <PopularDoctorFirstSlider />
        <SecondDoctorCategory />
        <PopularDoctorFirstSlider />
        <ThirdDoctorCategory />
        <PopularDoctorFirstSlider />
        <FourthDoctorCategory />
        <PopularDoctorFirstSlider />
        <FifthDoctorCategory />
      </div>

      <Footer />
    </>
  );
};

export default page;
