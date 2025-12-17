"use client";

import Title from "./Title";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "../utils/slugify";
import { WOMEN_TYPE_ID } from "../utils/constant";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";
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
            Failed to load women's categories
          </div>
        </div>
      </section>
    );
  }

  if (!womenCategories || womenCategories?.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <Title title="Women's Fashion Categories" />

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-6">
          {womenCategories?.map((category) => (
            <div
              key={category?._id?.toString()}
              className="group p-2 bg-white relative rounded-xl overflow-hidden transition-all duration-300"
            >
              <Link
                href={`/fashion_lifestyle/subcat/women_${
                  category?.type_info
                }_${slugify(category?.category_name)}_${category?._id}`}
                className="block h-full"
                aria-label={`Browse ${category?.category_name} category`}
              >
                <div className="aspect-square">
                  <Image
                    src={
                      category?.banner
                        ? `${FASHION_IMAGE_URL}/${category?.banner}`
                        : "/png/dummyImage.png"
                    }
                    alt={category?.category_name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-full border"
                    priority={false}
                  />
                </div>

                <h3 className="text-sm text-center sm:text-base font-bold text-primary mb-2">
                  {category?.category_name}
                </h3>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href={`/fashion_lifestyle/cat/women_${WOMEN_TYPE_ID}`}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
            aria-label="Explore all women's collections"
          >
            Explore All Women's Collections
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
