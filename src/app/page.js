import React from "react";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import LandingPage from "@/components/LandingPage/LandingPage";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";

const page = () => {
  return (
    <>
      <div className="min-h-content">
        <div className="pb-20">
          <Navbar />
        </div>
        <LocationMobile />
        <LandingPage />
      </div>

      <Footer />
    </>
  );
};

export default page;
