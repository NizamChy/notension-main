import FoodCategorySection from "@/components/Food/FoodCategorySection/FoodCategorySection";
import Footer from "@/components/shared/Footer/Footer";
import LocationModal from "@/components/shared/LocationModal/LocationModal";

import React from "react";

const page = () => {
  return (
    <>
      <LocationModal />
      <FoodCategorySection />
      <Footer />
    </>
  );
};

export default page;
