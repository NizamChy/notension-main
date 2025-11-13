import React from "react";
import SubCategorySlider from "@/components/Slider/SubCategorySlider";
import ProductsByCategory from "@/components/ProductsByCategory/ProductsByCategory";

const page = () => {
  return (
    <>
      <SubCategorySlider />
      <ProductsByCategory />
    </>
  );
};

export default page;
