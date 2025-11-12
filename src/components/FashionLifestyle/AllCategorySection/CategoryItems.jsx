"use client";

import Title from "../CategorySection/Title";
import CategoryCard from "../shared/Card/CategoryCard";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";

const CategoryItems = ({
  typeId,
  title = "Category",
  bgColor = "bg-white",
  exploreTitle = "Browse All Items",
  gridClass = "grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-6",
}) => {
  const { useCategoryById } = useCategoryItem();
  const { data: categories, isLoading, isError } = useCategoryById(typeId);

  if (isLoading) return <CategorySkeleton gridClass={gridClass} />;
  if (isError) return <div>Error loading categories</div>;
  if (!categories || categories?.length < 1) return null;

  if (categories?.length < 5) {
    gridClass = "grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6";
  } else if (categories?.length === 5) {
    gridClass = "grid grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-6";
  }

  return (
    <section className={`py-16 px-2 sm:px-6 lg:px-8 ${bgColor}`}>
      <div className="max-w-7xl mx-auto">
        <Title title={title} />

        <div className={`${gridClass}`}>
          {categories?.map((category) => (
            <CategoryCard
              key={category?._id?.toString()}
              category={category}
              typeName={title}
            />
          ))}
        </div>

        {/* <div className="mt-16 text-center">
          <Link href="#">
            <ExploreButton title={exploreTitle} />
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default CategoryItems;
