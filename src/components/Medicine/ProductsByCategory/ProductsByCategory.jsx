"use client";

import React from "react";
import { useSelector } from "react-redux";
import ShopInfo from "../../ShopInfoSection/ShopInfo";
import CustomTypeItems from "@/components/StoreModule/CustomTypeItems";
import CommonSlider from "@/components/StoreModule/CommonSlider";
import CategoryBannerCarousel from "@/components/StoreModule/CategoryBannerCarousel";

const ProductsByCategory = () => {
  const { DashboardSlider, isLoading } = useSelector(
    (state) => state.dashboard,
  );

  return (
    <div className="m-5 md:m-10 pt-14 md:pt-20 lg:pt-0 lg:my-28 lg:mx-16">
      <div className="lg:flex gap-5 space-y-5 lg:space-y-0 items-center">
        <div className="w-full lg:w-[60%] rounded-lg">
          <CategoryBannerCarousel moduleName="medicine" />
        </div>
        <div className="w-full lg:w-[40%] flex justify-center items-center">
          <ShopInfo />
        </div>
      </div>

      <div className="mt-5 space-y-5 md:space-y-0">
        <CustomTypeItems moduleName="medicine" section="specialOffer" />
        <div className="lg:flex gap-10 space-y-4 lg:space-y-0 pt-4 md:py-10">
          <div className="lg:w-1/2">
            {DashboardSlider?.[0]?.second_slider?.length > 0 && (
              <CommonSlider
                moduleName="medicine"
                classNames="max-h-[167px] md:max-h-[351px]"
                slides={DashboardSlider[0]?.second_slider}
              />
            )}
          </div>
          <div className="lg:w-1/2">
            {DashboardSlider?.[0]?.third_slider?.length > 0 && (
              <CommonSlider
                moduleName="medicine"
                classNames="max-h-[167px] md:max-h-[351px]"
                slides={DashboardSlider[0]?.third_slider}
              />
            )}
          </div>
        </div>
        <CustomTypeItems moduleName="medicine" section="dealOfTheDay" />
        <CustomTypeItems moduleName="medicine" section="popularItem" />
      </div>
    </div>
  );
};

export default ProductsByCategory;
