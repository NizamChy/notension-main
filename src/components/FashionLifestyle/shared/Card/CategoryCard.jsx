import React from "react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "../../utils/slugify";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";

/** Grid columns for category / sub-category tiles. */
export const CATEGORY_GRID_CLASS =
  "grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 sm:gap-x-4 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-7";

/**
 * Square image tile with the name underneath. Used for categories and
 * sub-categories so every grid in the module looks the same.
 */
export const CategoryTile = ({ href, image, name, ariaLabel }) => (
  <Link
    href={href}
    aria-label={ariaLabel}
    className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#0C3F8E] focus-visible:ring-offset-2"
  >
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 transition-colors group-hover:border-gray-300">
      <Image
        src={image ? `${FASHION_IMAGE_URL}/${image}` : "/png/dummyImage.png"}
        alt={name || "Category"}
        fill
        sizes="(min-width: 1024px) 200px, (min-width: 640px) 25vw, 33vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </div>
    <h3 className="mt-2.5 line-clamp-2 text-center text-xs font-semibold leading-snug text-gray-800 transition-colors group-hover:text-[#0C3F8E] sm:text-sm dark:group-hover:text-[#7FB2FF]">
      {name}
    </h3>
  </Link>
);

/** Round image + label used by the category rails and circle grids. */
export const CategoryBubble = ({ href, image, name, ariaLabel }) => (
  <Link
    href={href}
    aria-label={ariaLabel}
    className="group flex flex-col items-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#0C3F8E]"
  >
    <div className="relative aspect-square w-full max-w-[150px] overflow-hidden rounded-full border border-gray-200 bg-gray-100 ring-2 ring-transparent ring-offset-2 ring-offset-[color:var(--background)] transition group-hover:ring-[#0C3F8E] dark:group-hover:ring-[#7FB2FF]">
      <Image
        src={image ? `${FASHION_IMAGE_URL}/${image}` : "/png/dummyImage.png"}
        alt={name || "Category"}
        fill
        sizes="(min-width: 1024px) 150px, (min-width: 640px) 20vw, 28vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <h3 className="mt-2.5 line-clamp-2 text-center text-xs font-semibold leading-snug text-gray-800 transition-colors group-hover:text-[#0C3F8E] sm:text-sm dark:group-hover:text-[#7FB2FF]">
      {name}
    </h3>
  </Link>
);

const CategoryCard = ({ category, typeName }) => {
  return (
    <CategoryTile
      href={`/fashion-lifestyle/category/${slugify(typeName)}_${
        category?.type_info
      }_${slugify(category?.category_name)}_${category?._id}`}
      image={category?.banner}
      name={category?.category_name}
    />
  );
};

export default CategoryCard;
