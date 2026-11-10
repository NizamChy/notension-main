import React from "react";
import BottomSection from "./BottomSection";
import SecondSection from "./SecondSection";
import MiddleSection from "./MiddleSection";
import TopLeftSection from "./TopLeftSection";
import TopRightSection from "./TopRightSection";
import FavoriteSection from "../FavoriteSection/FavoriteSection";

const LandingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center overflow-hidden md:px-4">
      <FavoriteSection />
      <div className="w-full lg:w-[1280px] max-w-full lg:grid lg:grid-cols-2 gap-4 mt-2">
        <TopLeftSection />
        <TopRightSection />
      </div>

      <div className="w-full lg:w-[1280px] max-w-full">
        <SecondSection />
      </div>

      <div className="flex justify-center gap-4 mt-4 w-full">
        <MiddleSection />
      </div>
      <div className="flex justify-center gap-4 mt-4 w-full lg:w-[1280px] max-w-full">
        <BottomSection />
      </div>
    </div>
  );
};

export default LandingPage;
