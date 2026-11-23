import React from "react";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import LandingPage from "@/components/LandingPage/LandingPage";
import DemoModeToggle from "@/components/DemoMode/DemoModeToggle";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";

const page = () => {
  return (
    <>
      <div className="min-h-content">
        <div className="pb-16 lg:pb-20">
          {/* boundary: legacy JS caller. Navbar is JS, so TS reads every prop as
              required; this page passes none. */}
          <Navbar search={undefined} leading={undefined} actions={undefined} />
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
