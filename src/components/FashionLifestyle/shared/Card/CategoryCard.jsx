import React from "react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "../../utils/slugify";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";

const CategoryCard = ({ category, typeName }) => {
  return (
    <div className="group relative rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow transition-all duration-300 bg-white">
      <Link
        href={`/subcat/${slugify(typeName)}_${category?.type_info}_${slugify(
          category?.category_name
        )}_${category?._id}`}
        className="block h-full"
      >
        <div className="aspect-square">
          <Image
            src={
              category?.banner
                ? `${FASHION_IMAGE_URL}/${category?.banner}`
                : "/images/dummyImage.png"
            }
            alt={category?.category_name}
            width={600}
            height={600}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-1 sm:p-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 text-center">
            {category?.category_name}
          </h3>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
