"use client";

import React from "react";
import { useStoreData } from "./useStoreData";
import CommonSlider from "./CommonSlider";

const CategoryBannerCarousel = ({ moduleName }) => {
  const { slider: DashboardSlider } = useStoreData(moduleName);

  return (
    <CommonSlider
      moduleName={moduleName}
      slides={DashboardSlider?.[0]?.first_slider}
    />
  );
};

export default CategoryBannerCarousel;
