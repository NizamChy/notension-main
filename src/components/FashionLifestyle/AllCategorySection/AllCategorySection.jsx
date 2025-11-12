"use client";

import React from "react";
import CategoryItems from "./CategoryItems";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";

const AllCategorySection = () => {
  const { allType, isLoading, isError } = useCategoryItem();

  if (isLoading) return <CategorySkeleton />;

  if (isError) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Title title="Shop By Category" />
          <div className="text-center text-red-500 py-10">
            Failed to load categories
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {allType?.slice(2, allType?.length)?.map((type, index) => (
        <div key={type?._id?.toString()}>
          <CategoryItems
            title={type?.type_name}
            typeId={type?._id?.toString()}
            exploreTitle="Browse All Items"
            bgColor={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            gridClass="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-6"
          />
        </div>
      ))}
    </>
  );
};

export default AllCategorySection;
