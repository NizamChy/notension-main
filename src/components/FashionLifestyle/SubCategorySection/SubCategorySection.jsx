"use client";

import Link from "next/link";
import Image from "next/image";
import { slugify } from "../utils/slugify";
import { useParams } from "next/navigation";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";

const SubCategorySection = ({
  bgColor = "bg-white",
  gridClass = "grid grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6",
}) => {
  const params = useParams();
  const catSlugId = params?.categorySlugId;
  const [typeSlug, typeId, catSlug, catId] = catSlugId.split("_");

  const { useSubCategoryById } = useCategoryItem();
  const { data: subCategories, isLoading, isError } = useSubCategoryById(catId);

  if (isLoading)
    return (
      <CategorySkeleton gridClass="grid grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6" />
    );
  if (isError)
    return (
      <div className="text-center text-red-500">
        Error loading sub categories
      </div>
    );
  if (!subCategories || subCategories?.length < 1) return null;

  return (
    <section
      className={`py-6 md:py-10 px-4 sm:px-6 lg:px-8 ${bgColor}`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-gray-700 capitalize flex flex-wrap items-center">
          <Link href={`/fashion-lifestyle/type/${typeSlug}_${typeId}`}>
            <span className="flex items-center hover:text-blue-500">
              {typeSlug?.replace(/-/g, " ")}{" "}
              <MdKeyboardArrowRight className="text-gray-500" />
            </span>
          </Link>
          <span className="flex items-center text-gray-500">
            {catSlug?.replace(/-/g, " ")}
          </span>
        </h1>

        <div className={`${gridClass}`}>
          {subCategories?.map((subCategory) => (
            <div
              key={subCategory?._id?.toString()}
              className="group relative rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow transition-all duration-300 bg-white"
            >
              <Link
                href={`/fashion-lifestyle/subcategory/${typeSlug}_${typeId}_${catSlug}_${catId}_${slugify(
                  subCategory?.sub_category_name
                )}_${subCategory?._id}`}
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
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-deepGray text-center leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center">
                    {subCategory?.sub_category_name}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubCategorySection;
