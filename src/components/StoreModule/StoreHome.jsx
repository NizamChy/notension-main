"use client";

import React from "react";
import { useSelector } from "react-redux";
import CommonSlider from "./CommonSlider";
import CustomTypeItems from "./CustomTypeItems";
import ShopInfo from "@/components/ShopInfoSection/ShopInfo";
import CategoryBannerCarousel from "./CategoryBannerCarousel";

// A grocery / medicine store's home page: hero slider + shop card, then the
// custom-type item rows with a pair of promo sliders between them.
const StoreHome = ({ moduleName }) => {
  const DashboardSlider = useSelector(
    (state) => state.dashboard.DashboardSlider,
  );
  const second = DashboardSlider?.[0]?.second_slider;
  const third = DashboardSlider?.[0]?.third_slider;

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Both cells stretch to the taller one, so their tops and bottoms line up. */}
      <section className="grid gap-4 md:gap-5 md:grid-cols-3 items-stretch">
        <div className="md:col-span-2 min-w-0">
          <CategoryBannerCarousel moduleName={moduleName} />
        </div>
        <div className="min-w-0">
          <ShopInfo moduleName={moduleName} />
        </div>
      </section>

      <CustomTypeItems moduleName={moduleName} section="specialOffer" />

      {(second?.length > 0 || third?.length > 0) && (
        <section className="grid gap-4 md:gap-5 md:grid-cols-2">
          {second?.length > 0 && (
            <CommonSlider moduleName={moduleName} slides={second} />
          )}
          {third?.length > 0 && (
            <CommonSlider moduleName={moduleName} slides={third} />
          )}
        </section>
      )}

      <CustomTypeItems moduleName={moduleName} section="dealOfTheDay" />
      <CustomTypeItems moduleName={moduleName} section="popularItem" />
    </div>
  );
};

export default StoreHome;
