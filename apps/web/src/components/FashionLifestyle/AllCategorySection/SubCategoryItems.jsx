"use client";

import Title from "../CategorySection/Title";
import FashionSection from "../shared/FashionSection";
import SubCategoryCard from "../shared/Card/SubCategoryCard";
import { CATEGORY_GRID_CLASS } from "../shared/Card/CategoryCard";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";

const SubCategoryItems = ({
  cat,
  catId,
  title = "Category",
  href,
  bgColor = "",
  gridClass = CATEGORY_GRID_CLASS,
}) => {
  const { useSubCategoryById } = useCategoryItem();
  const { data: subCategories, isLoading, isError } = useSubCategoryById(catId);

  if (isLoading) return <CategorySkeleton className={bgColor} />;
  if (isError)
    return (
      <FashionSection className={bgColor}>
        <Title title={title} />
        <p className="py-6 text-center text-sm text-[#D92D20]">
          Error loading sub categories
        </p>
      </FashionSection>
    );
  if (!subCategories || subCategories?.length < 1) return null;

  return (
    <FashionSection className={bgColor}>
      <Title
        title={title}
        subtitle={`${subCategories.length} ${
          subCategories.length === 1 ? "style" : "styles"
        }`}
        href={href}
      />

      <div className={gridClass}>
        {subCategories?.map((subCategory) => (
          <SubCategoryCard
            key={subCategory?._id?.toString()}
            subCategory={subCategory}
            cat={cat}
          />
        ))}
      </div>
    </FashionSection>
  );
};

export default SubCategoryItems;
