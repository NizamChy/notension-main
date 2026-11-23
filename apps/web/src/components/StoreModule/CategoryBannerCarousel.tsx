"use client";

import React from "react";
import { useStoreData, type StoreModuleName } from "./useStoreData";
import CommonSlider, { type DashboardSliders } from "./CommonSlider";

type Props = { moduleName: StoreModuleName };

const CategoryBannerCarousel = ({ moduleName }: Props) => {
  // boundary: useStoreData keeps the explore's DashboardSlider as unknown[].
  const { slider: DashboardSlider } = useStoreData(moduleName) as { slider: DashboardSliders };

  return (
    <CommonSlider
      moduleName={moduleName}
      slides={DashboardSlider?.[0]?.first_slider}
    />
  );
};

export default CategoryBannerCarousel;
