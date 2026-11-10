"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { slugify } from "../../utils/slugify";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";

const SubCategoryCard = ({ subCategory, cat }) => {
  const params = useParams();
  const typeSlugId = params?.typeSlugId || null;

  return (
    <div className="group relative rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow transition-all duration-300 bg-white">
      <Link
        href={`/fashion-lifestyle/subcategory/${typeSlugId}_${slugify(
          cat?.category_name
        )}_${cat?._id}_${slugify(subCategory?.sub_category_name)}_${
          subCategory?._id
        }`}
        className="block h-full"
      >
        <div className="aspect-square overflow-hidden bg-gray-50">
          <Image
            src={
              subCategory?.banner_type_1
                ? `${FASHION_IMAGE_URL}/${subCategory?.banner_type_1}`
                : "/png/dummyImage.png"
            }
            alt={subCategory?.sub_category_name}
            width={300}
            height={300}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="px-1.5 py-2 sm:px-2 sm:py-2.5">
          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 text-center leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center">
            {subCategory?.sub_category_name}
          </h3>
        </div>
      </Link>
    </div>
  );
};

export default SubCategoryCard;
