"use client";

import React from "react";
import { useParams } from "next/navigation";
import { slugify } from "../utils/slugify";
import SubCategoryItems from "./SubCategoryItems";
import { EmptyState, PageHeader } from "@/components/shared/UI/UI";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";
import {
  Breadcrumbs,
  FASHION_CONTAINER,
  unslug,
} from "../shared/FashionSection";

const TypeDetails = () => {
  const params = useParams();
  const typeSlugId = params?.typeSlugId;
  const [slug, typeId] = typeSlugId?.split("_");

  const { useCategoryById, allType } = useCategoryItem();
  const { data: categories, isLoading, isError } = useCategoryById(typeId);

  const typeName =
    allType?.find((type) => type?._id?.toString() === typeId)?.type_name ||
    unslug(slug);

  const header = (
    <div className={`${FASHION_CONTAINER} pt-6 md:pt-8`}>
      <Breadcrumbs
        items={[
          { label: "Fashion", href: "/fashion-lifestyle" },
          { label: typeName },
        ]}
      />
      <PageHeader
        title={<span className="capitalize">{typeName}</span>}
        subtitle={
          categories?.length
            ? `Browse ${categories.length} ${
                categories.length === 1 ? "category" : "categories"
              }`
            : undefined
        }
        className="!mb-0"
      />
    </div>
  );

  if (isLoading)
    return (
      <>
        {header}
        <CategorySkeleton />
      </>
    );

  if (isError)
    return (
      <>
        {header}
        <div className={`${FASHION_CONTAINER} py-8`}>
          <EmptyState
            title="Couldn't load categories"
            text="Please check your connection and try again."
          />
        </div>
      </>
    );

  if (!categories || categories.length < 1)
    return (
      <>
        {header}
        <div className={`${FASHION_CONTAINER} py-8`}>
          <EmptyState
            title="No categories yet"
            text="New styles are on the way. Check back soon."
          />
        </div>
      </>
    );

  return (
    <div className="min-h-content">
      {header}
      {categories.map((cat, index) => (
        <SubCategoryItems
          key={cat?._id?.toString()}
          catId={cat?._id?.toString()}
          bgColor={index % 2 === 0 ? "" : "bg-gray-50"}
          title={cat?.category_name}
          href={`/fashion-lifestyle/category/${typeSlugId}_${slugify(
            cat?.category_name
          )}_${cat?._id}`}
          cat={cat}
        />
      ))}
    </div>
  );
};

export default TypeDetails;
