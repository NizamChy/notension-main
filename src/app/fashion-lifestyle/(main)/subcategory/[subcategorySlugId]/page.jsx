import React from "react";
import SubCatSlider from "@/components/FashionLifestyle/Slider/SubCatSlider";
import ProductByCategory from "@/components/FashionLifestyle/ProductsByCategory/ProductByCategory";

const page = () => {
  return <ProductByCategory subCategoryNav={<SubCatSlider />} />;
};

export default page;
