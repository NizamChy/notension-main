"use client";

import React from "react";
import { CategoryTile } from "./CategoryCard";
import { useParams } from "next/navigation";
import { slugify } from "../../utils/slugify";
import type { FashionCategory, FashionSubCategory } from "@/lib/api/fashion";

type Props = {
  subCategory: Pick<FashionSubCategory, "_id" | "sub_category_name" | "banner_type_1">;
  cat: Pick<FashionCategory, "_id" | "category_name"> | null | undefined;
};

const SubCategoryCard = ({ subCategory, cat }: Props) => {
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
