"use client";

import React from "react";
import PopularItem from "./PopularItem";
import SpecialOffer from "./SpecialOffer";
import DealOfTheDay from "./DealOfTheDay";
import { useSelector } from "react-redux";
import GroceryCommonSlider from "../CategoryBannerCarousel/GroceryCommonSlider";

const CustomTypeSection = ({ customTypeId }) => {
  const DashboardSlider = useSelector(
    (state) => state.dashboard.DashboardSlider
  );

  return (
    <div className="m-4 lg:mx-20 pt-12 md:pt-16 min-h-content">
      <div className="py-5 md:py-10 lg:w-2/3">
        {DashboardSlider[0]?.fourth_slider?.length && (
          <GroceryCommonSlider
            classNames="max-h-[167px] md:max-h-[468px]"
            slides={DashboardSlider[0]?.fourth_slider}
          />
        )}
      </div>

      {customTypeId === "64f5a306baa57a4707524d6e" && <SpecialOffer />}
      {customTypeId === "6525306cf79d9e77f12a2a63" && <DealOfTheDay />}
      {customTypeId === "64f5b63a256e0838327efaef" && <PopularItem />}
    </div>
  );
};

export default CustomTypeSection;
