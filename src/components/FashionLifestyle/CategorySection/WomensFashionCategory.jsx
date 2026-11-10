"use client";

import Title from "./Title";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "../utils/slugify";
import { WOMEN_TYPE_ID } from "../utils/constants";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";

const WomensFashionCategory = () => {
  const { useCategoryById } = useCategoryItem();

  const {
    data: womenCategories,
    isLoading,
    isError,
  } = useCategoryById(WOMEN_TYPE_ID);

  if (isLoading)
    return (
      <CategorySkeleton gridClass="grid grid-cols-3 lg:grid-cols-6 gap-6" />
    );

  if (isError) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <Title title="Women's Fashion Categories" />
          <div className="text-center text-red-500 py-10">
            Failed to load women&apos;s categories
          </div>
        </div>
      </section>
    );
  }

  if (!womenCategories || womenCategories?.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <Title title="Women's Fashion Categories" />

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {womenCategories?.map((category) => (
            <div
              key={category?._id?.toString()}
              className="group bg-white relative transition-all duration-300"
            >
              <Link
                href={`/fashion-lifestyle/category/women_${
                  category?.type_info
                }_${slugify(category?.category_name)}_${category?._id}`}
                className="block h-full"
                aria-label={`Browse ${category?.category_name} category`}
              >
                <div className="aspect-square rounded-full overflow-hidden border bg-gray-50 group-hover:border-blue-500 transition-colors">
                  <Image
                    src={
                      category?.banner
                        ? `${FASHION_IMAGE_URL}/${category?.banner}`
                        : "/png/dummyImage.png"
                    }
                    alt={category?.category_name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    priority={false}
                  />
                </div>

                <h3 className="mt-2 text-xs sm:text-sm md:text-base text-center font-semibold text-primary leading-snug line-clamp-2">
                  {category?.category_name}
                </h3>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-10 text-center">
          <Link
            href={`/fashion-lifestyle/type/women_${WOMEN_TYPE_ID}`}
            className="inline-flex items-center px-6 py-2.5 border border-gray-300 text-sm md:text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
            aria-label="Explore all women's collections"
          >
            Explore All Women&apos;s Collections
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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

export default WomensFashionCategory;
