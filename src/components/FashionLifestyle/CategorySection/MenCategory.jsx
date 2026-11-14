import React from "react";
import { MEN_TYPE_ID } from "../utils/constants";
import CategoryItems from "../AllCategorySection/CategoryItems";

const MenCategory = () => {
  return (
    <CategoryItems
      title="Men's fashion"
      subtitle="Everything he needs, by category"
      exploreTitle="View all"
      typeId={MEN_TYPE_ID}
    />
  );
};

export default MenCategory;
