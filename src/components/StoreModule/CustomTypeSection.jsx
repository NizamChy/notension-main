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
    <div className="space-y-10 md:space-y-14">
      <CommonSlider
        moduleName={moduleName}
        slides={DashboardSlider?.[0]?.fourth_slider}
      />

      {section && <CustomTypeItems moduleName={moduleName} section={section} />}
    </div>
  );
};

export default CustomTypeSection;
