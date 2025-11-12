import React from "react";
import GoTop from "@/components/FashionLifestyle/shared/GoTop/GoTop";
import MensWear from "@/components/FashionLifestyle/ProductSection/MensWear";
import KidsWear from "@/components/FashionLifestyle/ProductSection/KidsWear";
import ProductSlider from "@/components/FashionLifestyle/Slider/ProductSlider";
import WomensWear from "@/components/FashionLifestyle/ProductSection/WomensWear";
import CategoryNav from "@/components/FashionLifestyle/shared/Navbar/CategoryNav";
import MenCategory from "@/components/FashionLifestyle/CategorySection/MenCategory";
import FashionCarousel from "@/components/FashionLifestyle/Carousel/FashionCarousel";
import AllTypesSlider from "@/components/FashionLifestyle/CategorySection/AllTypesSlider";
import AllCategoriesSlider from "@/components/FashionLifestyle/Slider/AllCategoriesSlider";
import AllCategorySection from "@/components/FashionLifestyle/AllCategorySection/AllCategorySection";
import WomensFashionCategory from "@/components/FashionLifestyle/CategorySection/WomensFashionCategory";

const page = () => {
  return (
    <>
      <CategoryNav />
      <FashionCarousel />
      <AllCategoriesSlider />
      <ProductSlider />
      <MensWear />
      <WomensWear />
      <KidsWear />
      <MenCategory />
      <AllTypesSlider />
      <WomensFashionCategory />
      <AllCategorySection />
      <GoTop />
    </>
  );
};

export default page;
