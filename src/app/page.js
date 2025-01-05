import React from "react";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import LandingPage from "@/components/LandingPage/LandingPage";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";
import RoundLoader from "@/utils/round-loader";

const page = () => {
  return (
    <>
      <div className="min-h-content">
        <div className="pb-20">
          <Navbar />
        </div>

        <LocationMobile />
        {/* <div className="flex justify-center items-center min-h-[100vh]">
          <RoundLoader />
        </div> */}
        <LandingPage />
      </div>

      <Footer />
    </>
  );
};

export default page;
