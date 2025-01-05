import React from "react";
import FoodCategorySection from "@/components/Food/FoodCategorySection/FoodCategorySection";
import Footer from "@/components/shared/Footer/Footer";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";

const page = () => {
  return (
    <>
      <LocationMobile />
      <FoodCategorySection />
      <Footer />
    </>
  );
};

export default page;
