"use client";

import React from "react";
import { useSelector } from "react-redux";
import CommonSlider from "./CommonSlider";
import { getStoreModule } from "./storeModules";

const CategoryBannerCarousel = ({ moduleName }) => {
  const DashboardSlider = useSelector(
    (state) => state.dashboard.DashboardSlider,
  );
  const { bannerHeightClass } = getStoreModule(moduleName);

  return (
    <div>
      <CommonSlider
        moduleName={moduleName}
        slides={DashboardSlider?.[0]?.first_slider}
        classNames={`${bannerHeightClass} w-full`}
      />
    </div>
  );
};

export default CategoryBannerCarousel;
