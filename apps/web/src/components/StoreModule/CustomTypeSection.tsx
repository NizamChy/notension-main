"use client";

import React from "react";
import { useStoreData, type StoreModuleName } from "./useStoreData";
import CommonSlider, { type DashboardSliders } from "./CommonSlider";
import CustomTypeItems from "./CustomTypeItems";
import { getStoreModule, type CustomTypeName } from "./storeModules";

type Props = { moduleName: StoreModuleName; customTypeId: string | null };

const CustomTypeSection = ({ moduleName, customTypeId }: Props) => {
  // boundary: useStoreData keeps the explore's DashboardSlider as unknown[].
  const { slider: DashboardSlider } = useStoreData(moduleName) as { slider: DashboardSliders };
  const { customTypes } = getStoreModule(moduleName);

  // customTypes maps a section name to its backend custom type ID.
  const section = (Object.keys(customTypes) as CustomTypeName[]).find(
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
