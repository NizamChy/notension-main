"use client";

import Title from "../CategorySection/Title";
import SubCategoryCard from "../shared/Card/SubCategoryCard";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";

const SubCategoryItems = ({
  cat,
  catId,
  title = "Category",
  bgColor = "bg-white",
  gridClass = "grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-6",
}) => {
  const { useSubCategoryById } = useCategoryItem();
  const { data: subCategories, isLoading, isError } = useSubCategoryById(catId);

  if (isLoading)
    return (
      <CategorySkeleton gridClass="grid grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6" />
    );
  if (isError) return <div>Error loading sub categories</div>;
  if (!subCategories || subCategories?.length < 1) return null;

  return (
    <section
      className={`md:mb-8 lg:mb-16 lg:mt-4 pb-6 px-2 sm:px-6 lg:px-8 ${bgColor}`}
    >
      <div className="max-w-7xl mx-auto">
        <Title title={title} />

        <div className={`${gridClass}`}>
          {subCategories?.map((subCategory) => (
            <SubCategoryCard
              key={subCategory?._id?.toString()}
              subCategory={subCategory}
              cat={cat}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubCategoryItems;
