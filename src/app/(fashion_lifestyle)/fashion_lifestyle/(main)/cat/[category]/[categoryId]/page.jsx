import React from "react";
import SubCategorySlider from "@/components/FashionLifestyle/Slider/SubCategorySlider";
import ProductsByCategory from "@/components/FashionLifestyle/ProductsByCategory/ProductsByCategory";

const page = () => {
  return (
    <>
      <SubCategorySlider />
      <ProductsByCategory />
    </>
  );
};

export default page;
