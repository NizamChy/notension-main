"use client";

import Link from "next/link";
import Title from "../CategorySection/Title";
import { slugify } from "../utils/slugify";
import CategoryCard from "../shared/Card/CategoryCard";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";

const CategoryItems = ({
  typeId,
  title = "Category",
  bgColor = "bg-white",
  exploreTitle = "Browse All Items",
  gridClass = "grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-6",
}) => {
  const { useCategoryById, allType } = useCategoryItem();
  const { data: categories, isLoading, isError } = useCategoryById(typeId);

  const typeName =
    allType?.find((type) => type?._id?.toString() === typeId)?.type_name ||
    title;
  const exploreHref = typeId
    ? `/fashion-lifestyle/type/${slugify(typeName)}_${typeId}`
    : "/fashion-lifestyle";

  if (isLoading) return <CategorySkeleton gridClass={gridClass} />;
  if (isError) return <div>Error loading categories</div>;
  if (!categories || categories?.length < 1) return null;

  if (categories?.length < 5) {
    gridClass = "grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6";
  } else if (categories?.length === 5) {
    gridClass = "grid grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-6";
  }

  return (
    <section className={`py-16 px-2 sm:px-6 lg:px-8 ${bgColor}`}>
      <div className="max-w-7xl mx-auto">
        <Title title={title} />

        <div className={`${gridClass}`}>
          {categories?.map((category) => (
            <CategoryCard
              key={category?._id?.toString()}
              category={category}
              typeName={title}
            />
          ))}
        </div>

        <div className="mt-10 sm:mt-16 text-center">
          <Link
            href={exploreHref}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            {exploreTitle}
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryItems;
