import React from "react";
import LocationModal from "@/components/shared/LocationModal/LocationModal";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import LandingPage from "@/components/LandingPage/LandingPage";

const page = () => {
  return (
    <>
      <div className="min-h-content">
        <div className="pb-20">
          <Navbar />
        </div>
        <LocationModal />
        <LandingPage />
      </div>

      <Footer />
    </>
  );
};

export default page;
