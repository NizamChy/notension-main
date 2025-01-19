"use client";
import React from "react";
import PopularItem from "./PopularItem";
import SpecialOffer from "./SpecialOffer";
import DealOfTheDay from "./DealOfTheDay";
import MedicineCommonSlider from "../CategoryBannerCarousel/MedicineCommonSlider";
import { useSelector } from "react-redux";

const CustomTypeSection = ({ customTypeId }) => {
  const DashboardSlider = useSelector(
    (state) => state.dashboard.DashboardSlider
  );

  return (
    <div className="m-4 lg:mx-20 pt-12 md:pt-16 min-h-content">
      <div className="py-5 md:py-10 lg:w-2/3">
        {DashboardSlider[0]?.fourth_slider?.length && (
          <MedicineCommonSlider
            classNames="max-h-[144px] md:max-h-[468px]"
            slides={DashboardSlider[0]?.fourth_slider}
          />
        )}
      </div>

      {customTypeId === "65128cbd20db0921f13b40b3" && <SpecialOffer />}
      {customTypeId === "64ec724d538280d7999a2d39" && <DealOfTheDay />}
      {customTypeId === "651284f9330595b483e38d73" && <PopularItem />}
    </div>
  );
};

export default CustomTypeSection;
