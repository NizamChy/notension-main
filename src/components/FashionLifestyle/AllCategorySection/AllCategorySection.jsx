"use client";

import React from "react";
import CategoryItems from "./CategoryItems";
import Title from "../CategorySection/Title";
import FashionSection from "../shared/FashionSection";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";

const AllCategorySection = () => {
  const { allType, isLoading, isError } = useCategoryItem();

  if (isLoading) return <CategorySkeleton className="bg-gray-50" />;

  if (isError) {
    return (
      <FashionSection className="bg-gray-50">
        <Title title="Shop by category" />
        <p className="py-6 text-center text-sm text-[#D92D20]">
          Failed to load categories
        </p>
      </FashionSection>
    );
  }

  return (
    <>
      {allType?.slice(2, allType?.length)?.map((type, index) => (
        <CategoryItems
          key={type?._id?.toString()}
          title={type?.type_name}
          typeId={type?._id?.toString()}
          exploreTitle="View all"
          bgColor={index % 2 === 0 ? "bg-gray-50" : ""}
        />
      ))}
    </>
  );
};

export default AllCategorySection;
