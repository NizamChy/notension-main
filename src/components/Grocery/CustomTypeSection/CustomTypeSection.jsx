"use client";

import React from "react";
import PopularItem from "./PopularItem";
import SpecialOffer from "./SpecialOffer";
import DealOfTheDay from "./DealOfTheDay";
import { useSelector } from "react-redux";
import CommonSlider from "@/components/StoreModule/CommonSlider";
import { getStoreModule } from "@/components/StoreModule/storeModules";

const { customTypes } = getStoreModule("grocery");

const CustomTypeSection = ({ customTypeId }) => {
  const DashboardSlider = useSelector(
    (state) => state.dashboard.DashboardSlider,
  );

  return (
    <div className="m-4 lg:mx-20 pt-12 md:pt-16 min-h-content">
      <div className="flex justify-center">
        <div className="w-full lg:w-3/4 p-4">
          <div className="rounded-2xl shadow-lg overflow-hidden bg-white p-2">
            {DashboardSlider?.[0]?.fourth_slider?.length > 0 && (
              <CommonSlider
                moduleName="grocery"
                classNames="max-h-[167px] md:max-h-[468px]"
                slides={DashboardSlider[0]?.fourth_slider}
              />
            )}
          </div>
        </div>
      </div>

      {customTypeId === customTypes.specialOffer && <SpecialOffer />}
      {customTypeId === customTypes.dealOfTheDay && <DealOfTheDay />}
      {customTypeId === customTypes.popularItem && <PopularItem />}
    </div>
  );
};

export default CustomTypeSection;
