"use client";
import React from "react";
import PopularItem from "./PopularItem";
import SpecialOffer from "./SpecialOffer";
import DealOfTheDay from "./DealOfTheDay";
import { useSelector } from "react-redux";
import MedicineCommonSlider from "../CategoryBannerCarousel/MedicineCommonSlider";

const CustomTypeSection = ({ customTypeId }) => {
  const DashboardSlider = useSelector(
    (state) => state.dashboard.DashboardSlider
  );

  return (
    <div className="m-4 lg:mx-20 pt-12 md:pt-16 min-h-content">
      <div className="flex justify-center">
        <div className="w-full lg:w-3/4 p-4">
          <div className="rounded-2xl shadow-lg overflow-hidden bg-white p-2">
            {DashboardSlider[0]?.fourth_slider?.length && (
              <MedicineCommonSlider
                classNames="max-h-[167px] md:max-h-[468px]"
                slides={DashboardSlider[0]?.fourth_slider}
              />
            )}
          </div>
        </div>
      </div>

      {customTypeId === "65128cbd20db0921f13b40b3" && <SpecialOffer />}
      {customTypeId === "64ec724d538280d7999a2d39" && <DealOfTheDay />}
      {customTypeId === "651284f9330595b483e38d73" && <PopularItem />}
    </div>
  );
};

export default CustomTypeSection;
