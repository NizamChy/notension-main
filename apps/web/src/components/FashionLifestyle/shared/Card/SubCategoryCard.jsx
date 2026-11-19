"use client";

import React from "react";
import { CategoryTile } from "./CategoryCard";
import { useParams } from "next/navigation";
import { slugify } from "../../utils/slugify";

const SubCategoryCard = ({ subCategory, cat }) => {
  const params = useParams();
  const typeSlugId = params?.typeSlugId || null;

  return (
    <CategoryTile
      href={`/fashion-lifestyle/subcategory/${typeSlugId}_${slugify(
        cat?.category_name
      )}_${cat?._id}_${slugify(subCategory?.sub_category_name)}_${
        subCategory?._id
      }`}
      image={subCategory?.banner_type_1}
      name={subCategory?.sub_category_name}
    />
  );
};

export default SubCategoryCard;
