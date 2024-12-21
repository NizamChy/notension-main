import React from "react";
import PopularItem from "./PopularItem";
import SpecialOffer from "./SpecialOffer";
import DealOfTheDay from "./DealOfTheDay";

const CustomTypeSection = ({ customTypeId }) => {
  return (
    <div className="m-4 lg:m-20 pt-20 lg:pt-10 min-h-content">
      {customTypeId === "65128cbd20db0921f13b40b3" && <SpecialOffer />}
      {customTypeId === "64ec724d538280d7999a2d39" && <DealOfTheDay />}
      {customTypeId === "651284f9330595b483e38d73" && <PopularItem />}
    </div>
  );
};

export default CustomTypeSection;
