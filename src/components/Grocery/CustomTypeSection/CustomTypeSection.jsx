import React from "react";
import PopularItem from "./PopularItem";
import SpecialOffer from "./SpecialOffer";
import DealOfTheDay from "./DealOfTheDay";

const CustomTypeSection = ({ customTypeId }) => {
  return (
    <div className="m-4 lg:m-20 pt-20 lg:pt-10">
      {customTypeId === "64f5a306baa57a4707524d6e" && <SpecialOffer />}
      {customTypeId === "6525306cf79d9e77f12a2a63" && <DealOfTheDay />}
      {customTypeId === "64f5b63a256e0838327efaef" && <PopularItem />}
    </div>
  );
};

export default CustomTypeSection;
