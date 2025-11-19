"use client";

import Link from "next/link";
import Image from "next/image";
import { slugify } from "../utils/slugify";
import { useParams } from "next/navigation";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";

const SubCategorySection = ({
  bgColor = "bg-white",
  gridClass = "grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-6",
}) => {
  const params = useParams();
  const catSlugId = params.catSlugId;
  const [typeSlug, typeId, catSlug, catId] = catSlugId.split("_");

  const { useSubCategoryById } = useCategoryItem();
  const { data: subCategories, isLoading, isError } = useSubCategoryById(catId);

  if (isLoading)
    return (
      <CategorySkeleton gridClass="grid grid-cols-3 lg:grid-cols-6 gap-2 md:gap-6" />
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
      className={`md:mb-8 lg:mb-16 lg:mt-4 pb-6 px-2 sm:px-6 lg:px-8 ${bgColor}`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold py-4 text-gray-700 capitalize flex items-center">
          <Link href={`/fashion_lifestyle/cat/${typeSlug}_${typeId}`}>
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
                href={`/fashion_lifestyle/category/${typeSlug}_${typeId}_${catSlug}_${catId}_${slugify(
                  subCategory?.sub_category_name
                )}_${subCategory?._id}`}
                className="block h-full"
              >
                <div className="aspect-square overflow-hidden">
                  <Image
                    src={
                      subCategory?.banner_type_1
                        ? `${FASHION_IMAGE_URL}/${subCategory?.banner_type_1}`
                        : "/images/png/dummyImage.png"
                    }
                    alt={subCategory?.sub_category_name}
                    width={300}
                    height={300}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-1 sm:p-2">
                  <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-deepGray mb-1 text-center">
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
