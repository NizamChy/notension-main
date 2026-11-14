"use client";

import Title from "./Title";
import { slugify } from "../utils/slugify";
import { WOMEN_TYPE_ID } from "../utils/constants";
import FashionSection from "../shared/FashionSection";
import { CategoryBubble } from "../shared/Card/CategoryCard";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";

const WomensFashionCategory = () => {
  const { useCategoryById } = useCategoryItem();

  const {
    data: womenCategories,
    isLoading,
    isError,
  } = useCategoryById(WOMEN_TYPE_ID);

  if (isLoading) return <CategorySkeleton />;

  if (isError) {
    return (
      <FashionSection>
        <Title title="Women's fashion" />
        <p className="py-6 text-center text-sm text-[#D92D20]">
          Failed to load women&apos;s categories
        </p>
      </FashionSection>
    );
  }

  if (!womenCategories || womenCategories?.length === 0) {
    return null;
  }

  return (
    <FashionSection>
      <Title
        title="Women's fashion"
        subtitle="Shop the latest by category"
        href={`/fashion-lifestyle/type/women_${WOMEN_TYPE_ID}`}
      />

      <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-4 lg:grid-cols-6 lg:gap-x-6">
        {womenCategories?.map((category) => (
          <CategoryBubble
            key={category?._id?.toString()}
            href={`/fashion-lifestyle/category/women_${
              category?.type_info
            }_${slugify(category?.category_name)}_${category?._id}`}
            image={category?.banner}
            name={category?.category_name}
            ariaLabel={`Browse ${category?.category_name}`}
          />
        ))}
      </div>
    </FashionSection>
  );
};

export default WomensFashionCategory;
