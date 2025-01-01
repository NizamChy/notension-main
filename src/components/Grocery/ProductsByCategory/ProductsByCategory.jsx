"use client";

import React from "react";
import CategoryBannerCarousel from "../CategoryBannerCarousel/CategoryBannerCarousel";
import SpecialOffer from "../CustomTypeSection/SpecialOffer";
import DealOfTheDay from "../CustomTypeSection/DealOfTheDay";
import PopularItem from "../CustomTypeSection/PopularItem";
import ShopInfo from "../ShopInfoSection/ShopInfo";
import GroceryCommonSlider from "../CategoryBannerCarousel/GroceryCommonSlider";
import { useSelector } from "react-redux";

const ProductsByCategory = () => {
  const DashboardSlider = useSelector(
    (state) => state.dashboard.DashboardSlider
  );

  return (
    <div className="m-5 md:m-10 pt-20 md:pt-20 lg:pt-0 lg:my-28 lg:mx-16">
      <div className="lg:flex gap-5 space-y-5 lg:space-y-0 items-center">
        <div className="w-full lg:w-[60%] rounded-lg">
          <CategoryBannerCarousel />
        </div>
        <div className="w-full lg:w-[40%] flex justify-center items-center">
          <ShopInfo />
        </div>
      </div>

      <div className="mt-5 space-y-5 md:space-y-0">
        <SpecialOffer />
        <div className="lg:flex gap-10 space-y-4 lg:space-y-0 py-10">
          <div className="lg:w-1/2">
            {DashboardSlider[0]?.second_slider?.length && (
              <GroceryCommonSlider
                classNames="max-h-[351px]"
                slides={DashboardSlider[0]?.second_slider}
              />
            )}
          </div>
          <div className="lg:w-1/2">
            {DashboardSlider[0]?.third_slider?.length && (
              <GroceryCommonSlider
                classNames="max-h-[351px]"
                slides={DashboardSlider[0]?.third_slider}
              />
            )}
          </div>
        </div>
        <DealOfTheDay />
        <div className="py-10 lg:w-2/3">
          {DashboardSlider[0]?.fourth_slider?.length && (
            <GroceryCommonSlider
              classNames="max-h-[468px]"
              slides={DashboardSlider[0]?.fourth_slider}
            />
          )}
        </div>
        <PopularItem />
      </div>
    </div>
  );
};

export default ProductsByCategory;
