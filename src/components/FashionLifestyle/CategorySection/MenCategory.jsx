import React from "react";
import { MEN_TYPE_ID } from "@/utils/constant";
import CategoryItems from "../AllCategorySection/CategoryItems";

const MenCategory = () => {
  return (
    <>
      <CategoryItems
        title="Men's Fashion Categories"
        bgColor="bg-white"
        exploreTitle="Explore Men's Fashion"
        typeId={MEN_TYPE_ID}
        gridClass="grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6"
      />
    </>
  );
};

export default MenCategory;
