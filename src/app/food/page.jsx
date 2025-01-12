import React from "react";
import Footer from "@/components/shared/Footer/Footer";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";
import FoodCategorySection from "@/components/Food/FoodCategorySection/FoodCategorySection";

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
