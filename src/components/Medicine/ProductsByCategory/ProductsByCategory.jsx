"use client";

import React from "react";

import SpecialOffer from "../CustomTypeSection/SpecialOffer";
import DealOfTheDay from "../CustomTypeSection/DealOfTheDay";
import PopularItem from "../CustomTypeSection/PopularItem";
import CategoryBannerCarousel from "../CategoryBannerCarousel/CategoryBannerCarousel";
import ShopInfo from "../../ShopInfoSection/ShopInfo";

const ProductsByCategory = () => {
  return (
    <div className="m-5 md:m-10 pt-20 md:pt-20 lg:pt-0 lg:m-20 xl:m-28 min-h-content">
      <div className="lg:flex gap-5 space-y-5 lg:space-y-0">
        <div className="w-full lg:w-2/3">
          <CategoryBannerCarousel />
        </div>
        <div className="w-full lg:w-1/3 flex justify-center items-center">
          <ShopInfo />
        </div>
      </div>

      <div className="mt-5 space-y-5 md:space-y-0">
        <SpecialOffer />
        <DealOfTheDay />
        <PopularItem />
      </div>
    </div>
  );
};

export default ProductsByCategory;
