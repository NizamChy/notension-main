"use client";

import React from "react";
import { useParams } from "next/navigation";
import SubCategoryItems from "./SubCategoryItems";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";

const TypeDetails = () => {
  const params = useParams();
  const typeSlugId = params?.category;
  const [slug, typeId] = typeSlugId?.split("_");

  const { useCategoryById } = useCategoryItem();
  const { data: categories, isLoading, isError } = useCategoryById(typeId);

  if (isLoading)
    return (
      <CategorySkeleton gridClass="grid grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6" />
    );
  if (isError) return <div>Error loading categories</div>;
  if (!categories || categories.length < 1) return null;

  return (
    <>
      {categories.map((cat, index) => (
        <div key={cat?._id?.toString()}>
          <SubCategoryItems
            catId={cat?._id?.toString()}
            bgColor={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            title={cat?.category_name}
            cat={cat}
            gridClass="grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6"
          />
        </div>
      ))}
    </>
  );
};

export default TypeDetails;
