"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/utils/slugify";
import { useParams } from "next/navigation";
import { IMAGE_URL } from "@/api-endpoints/secret";

const SubCategoryCard = ({ subCategory, cat }) => {
  const params = useParams();
  const typeSlugId = params?.category || null;

  return (
    <div className="group relative rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow transition-all duration-300 bg-white">
      <Link
        href={`/category/${typeSlugId}_${slugify(cat?.category_name)}_${
          cat?._id
        }_${slugify(subCategory?.sub_category_name)}_${subCategory?._id}`}
        className="block h-full"
      >
        <div className="aspect-square overflow-hidden">
          <Image
            src={
              subCategory?.banner_type_1
                ? `${IMAGE_URL}/${subCategory?.banner_type_1}`
                : "/images/dummyImage.png"
            }
            alt={subCategory?.sub_category_name}
            width={300}
            height={300}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-1 sm:p-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 text-center">
            {subCategory?.sub_category_name}
          </h3>
        </div>
      </Link>
    </div>
  );
};

export default SubCategoryCard;
