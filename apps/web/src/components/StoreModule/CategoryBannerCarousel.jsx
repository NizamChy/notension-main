"use client";

import React from "react";
import { useSelector } from "react-redux";
import CommonSlider from "./CommonSlider";

const CategoryBannerCarousel = ({ moduleName }) => {
  const DashboardSlider = useSelector(
    (state) => state.dashboard.DashboardSlider,
  );

  return (
    <CommonSlider
      moduleName={moduleName}
      slides={DashboardSlider?.[0]?.first_slider}
    />
  );
};

export default CategoryBannerCarousel;
