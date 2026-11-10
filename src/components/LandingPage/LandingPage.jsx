import React from "react";
import BottomSection from "./BottomSection";
import SecondSection from "./SecondSection";
import MiddleSection from "./MiddleSection";
import TopLeftSection from "./TopLeftSection";
import TopRightSection from "./TopRightSection";
import FavoriteSection from "../FavoriteSection/FavoriteSection";

const LandingPage = () => {
  return (
    <div className="w-full max-w-[1312px] mx-auto px-3 md:px-4 pb-8 md:pb-10 overflow-hidden flex flex-col gap-3 md:gap-4">
      <FavoriteSection />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <TopLeftSection />
        <TopRightSection />
      </div>

      <SecondSection />

      <MiddleSection />

      <BottomSection />
    </div>
  );
};

export default LandingPage;
