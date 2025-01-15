import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import DoctorNav from "@/components/MedicalServices/DoctorSection/DoctorHome/DoctorNav";
import DoctorSlider from "@/components/MedicalServices/DoctorSection/DoctorHome/DoctorSlider";
import FirstDoctorCategory from "@/components/MedicalServices/DoctorSection/DoctorCategory/FirstDoctorCategory";
import ThirdDoctorCategory from "@/components/MedicalServices/DoctorSection/DoctorCategory/ThirdDoctorCategory";
import FifthDoctorCategory from "@/components/MedicalServices/DoctorSection/DoctorCategory/FifthDoctorCategory";
import SecondDoctorCategory from "@/components/MedicalServices/DoctorSection/DoctorCategory/SecondDoctorCategory";
import FourthDoctorCategory from "@/components/MedicalServices/DoctorSection/DoctorCategory/FourthDoctorCategory";
import PopularDoctorFirstSlider from "@/components/MedicalServices/DoctorSection/PopularDoctor/PopularDoctorFirstSlider";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";

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
