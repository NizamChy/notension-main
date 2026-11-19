"use client";

import Title from "../CategorySection/Title";
import { slugify } from "../utils/slugify";
import FashionSection from "../shared/FashionSection";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";
import CategoryCard, {
  CATEGORY_GRID_CLASS,
} from "../shared/Card/CategoryCard";

const CategoryItems = ({
  typeId,
  title = "Category",
  subtitle,
  bgColor = "",
  exploreTitle = "View all",
  gridClass = CATEGORY_GRID_CLASS,
}) => {
  const { useCategoryById, allType } = useCategoryItem();
  const { data: categories, isLoading, isError } = useCategoryById(typeId);

  const typeName =
    allType?.find((type) => type?._id?.toString() === typeId)?.type_name ||
    title;
  const exploreHref = typeId
    ? `/fashion-lifestyle/type/${slugify(typeName)}_${typeId}`
    : "/fashion-lifestyle";

  if (isLoading)
    return <CategorySkeleton gridClass={gridClass} className={bgColor} />;
  if (isError)
    return (
      <FashionSection className={bgColor}>
        <Title title={title} />
        <p className="py-6 text-center text-sm text-[#D92D20]">
          Error loading categories
        </p>
      </FashionSection>
    );
  if (!categories || categories?.length < 1) return null;

  // Few categories: use fewer, larger columns on desktop.
  if (categories?.length < 5) {
    gridClass =
      "grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 sm:gap-x-4 lg:gap-x-6 lg:gap-y-7";
  } else if (categories?.length === 5) {
    gridClass =
      "grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-5 sm:gap-x-4 lg:gap-x-6 lg:gap-y-7";
  }

  return (
    <FashionSection className={bgColor}>
      <Title
        title={title}
        subtitle={subtitle}
        href={exploreHref}
        linkLabel={exploreTitle}
      />

      <div className={gridClass}>
        {categories?.map((category) => (
          <CategoryCard
            key={category?._id?.toString()}
            category={category}
            typeName={typeName}
          />
        ))}
      </div>
    </FashionSection>
  );
};

export default CategoryItems;
