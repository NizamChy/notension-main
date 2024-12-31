import React from "react";
import TopLeftSection from "./TopLeftSection";
import TopRightSection from "./TopRightSection";
import MiddleSection from "./MiddleSection";
import BottomSection from "./BottomSection";

const LandingPage = () => {
  return (
    <>
      <div className="flex justify-center gap-4 mt-4">
        <TopLeftSection />
        <TopRightSection />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <MiddleSection />
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <BottomSection />
      </div>
    </>
  );
};

export default LandingPage;
