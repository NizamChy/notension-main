"use client";

import React from "react";
import { useSelector } from "react-redux";
import CommonSlider from "./CommonSlider";
import CustomTypeItems from "./CustomTypeItems";
import { getStoreModule } from "./storeModules";

const CustomTypeSection = ({ moduleName, customTypeId }) => {
  const DashboardSlider = useSelector(
    (state) => state.dashboard.DashboardSlider,
  );
  const { customTypes } = getStoreModule(moduleName);

  // customTypes maps a section name to its backend custom type ID.
  const section = Object.keys(customTypes).find(
    (key) => customTypes[key] === customTypeId,
  );

  return (
    <div className="m-4 lg:mx-20 pt-12 md:pt-16 min-h-content">
      <div className="flex justify-center">
        <div className="w-full lg:w-3/4 p-4">
          <div className="rounded-2xl shadow-lg overflow-hidden bg-white p-2">
            <CommonSlider
              moduleName={moduleName}
              classNames="max-h-[167px] md:max-h-[468px]"
              slides={DashboardSlider?.[0]?.fourth_slider}
            />
          </div>
        </div>
      </div>

      {section && <CustomTypeItems moduleName={moduleName} section={section} />}
    </div>
  );
};

export default CustomTypeSection;
