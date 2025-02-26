import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import ServicesArea from "@/components/AllCareServices/ServicesArea";
import ServicesSlider from "@/components/AllCareServices/ServicesSlider";
import AllCareServices from "@/components/AllCareServices/AllCareServices";

const page = () => {
  return (
    <>
      <Navbar />

      <div className="max-w-screen-2xl mx-auto min-h-content pt-20">
        <AllCareServices />
        <ServicesArea />
        <ServicesSlider />
        <ServicesArea />
        <ServicesSlider />
        <ServicesArea />
        <ServicesSlider />
      </div>

      <Footer />
    </>
  );
};

export default page;
