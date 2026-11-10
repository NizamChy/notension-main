import React from "react";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import LandingPage from "@/components/LandingPage/LandingPage";
import DemoModeToggle from "@/components/DemoMode/DemoModeToggle";
import LocationAccess from "@/components/shared/Map/LocationAccess";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";

const page = () => {
  return (
    <>
      <LocationAccess />
      <div className="min-h-content">
        <div className="pb-16 lg:pb-20">
          <Navbar />
        </div>
        <LocationMobile />
        <LandingPage />
      </div>

      <Footer />
      <DemoModeToggle />
    </>
  );
};

export default page;
