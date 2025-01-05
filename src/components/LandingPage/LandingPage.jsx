import React from "react";
import TopLeftSection from "./TopLeftSection";
import TopRightSection from "./TopRightSection";
import MiddleSection from "./MiddleSection";
import BottomSection from "./BottomSection";
import SecondSection from "./SecondSection";
import FavoriteSection from "../FavoriteSection/FavoriteSection";

const LandingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center overflow-hidden">
      <FavoriteSection />
      <div className="lg:flex justify-center gap-4 mt-2">
        <TopLeftSection />
        <TopRightSection />
      </div>

      <SecondSection />

      <div className="flex justify-center gap-4 mt-4">
        <MiddleSection />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <BottomSection />
      </div>
    </div>
  );
};

export default LandingPage;
