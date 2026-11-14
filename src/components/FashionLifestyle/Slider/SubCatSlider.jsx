"use client";

import Link from "next/link";
import Image from "next/image";
import { slugify } from "../utils/slugify";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/shared/UI/UI";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";

/**
 * Sibling sub-categories as a horizontally scrolling chip row. The current
 * sub-category is highlighted.
 */
const SubCatSlider = () => {
  const params = useParams();
  const typeCatSubIdSlug = params?.subcategorySlugId;

  const [typeSlug, typeId, catSlug, catId, , subCatId] =
    typeCatSubIdSlug.split("_");

  const { useSubCategoryById } = useCategoryItem();
  const { data: subCategories, isLoading, isError } = useSubCategoryById(catId);

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-hidden" aria-hidden>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-11 w-32 shrink-0 !rounded-full" />
        ))}
      </div>
    );
  }

  if (isError || !subCategories || subCategories.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Sub categories" className="-mx-4 sm:mx-0">
      <ul className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        {subCategories.map((category) => {
          const active = category?._id === subCatId;
          return (
            <li key={category?._id?.toString()} className="shrink-0">
              <Link
                href={`/fashion-lifestyle/subcategory/${typeSlug}_${typeId}_${catSlug}_${catId}_${slugify(
                  category?.sub_category_name
                )}_${category?._id}`}
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-11 items-center gap-2 rounded-full border py-1 pl-1 pr-4 text-sm font-medium transition-colors ${
                  active
                    ? "border-[#0C3F8E] bg-[#0C3F8E] text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-100">
                  <Image
                    src={
                      category?.banner_type_1
                        ? `${FASHION_IMAGE_URL}/${category?.banner_type_1}`
                        : "/png/dummyImage.png"
                    }
                    alt=""
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </span>
                <span className="whitespace-nowrap">
                  {category?.sub_category_name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SubCatSlider;
