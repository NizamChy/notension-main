import React from "react";
import HeroSection from "./HeroSection";
import QuickAccess from "./QuickAccess";
import ShopCategories from "./ShopCategories";
import HealthcareSection from "./HealthcareSection";
import CareSection from "./CareSection";
import HowItWorks from "./HowItWorks";
import AppDownload from "./AppDownload";

const LandingPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-[1312px] flex-col gap-12 px-4 pb-14 pt-4 md:gap-20 md:pb-20 md:pt-6">
      <div className="flex flex-col gap-4">
        <HeroSection />
        <QuickAccess />
      </div>
      <ShopCategories />
      <HealthcareSection />
      <CareSection />
      <HowItWorks />
      <AppDownload />
    </div>
  );
};

export default LandingPage;
