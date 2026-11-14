"use client";

import { slugify } from "../utils/slugify";
import { useParams } from "next/navigation";
import { EmptyState, PageHeader } from "@/components/shared/UI/UI";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";
import FashionSection, {
  Breadcrumbs,
  unslug,
} from "../shared/FashionSection";
import {
  CATEGORY_GRID_CLASS,
  CategoryTile,
} from "../shared/Card/CategoryCard";

const SubCategorySection = ({
  bgColor = "",
  gridClass = CATEGORY_GRID_CLASS,
}) => {
  const params = useParams();
  const catSlugId = params?.categorySlugId;
  const [typeSlug, typeId, catSlug, catId] = catSlugId.split("_");

  const { useSubCategoryById } = useCategoryItem();
  const { data: subCategories, isLoading, isError } = useSubCategoryById(catId);

  const header = (
    <>
      <Breadcrumbs
        items={[
          { label: "Fashion", href: "/fashion-lifestyle" },
          {
            label: unslug(typeSlug),
            href: `/fashion-lifestyle/type/${typeSlug}_${typeId}`,
          },
          { label: unslug(catSlug) },
        ]}
      />
      <PageHeader
        title={<span className="capitalize">{unslug(catSlug)}</span>}
        subtitle={
          subCategories?.length
            ? `Choose from ${subCategories.length} ${
                subCategories.length === 1 ? "style" : "styles"
              }`
            : undefined
        }
      />
    </>
  );

  if (isLoading) return <CategorySkeleton gridClass={gridClass} />;

  return (
    <FashionSection className={`min-h-content !pt-6 md:!pt-8 ${bgColor}`}>
      {header}

      {isError ? (
        <EmptyState
          title="Couldn't load sub categories"
          text="Please check your connection and try again."
        />
      ) : !subCategories || subCategories?.length < 1 ? (
        <EmptyState
          title="Nothing here yet"
          text="New styles are on the way. Check back soon."
        />
      ) : (
        <div className={gridClass}>
          {subCategories?.map((subCategory) => (
            <CategoryTile
              key={subCategory?._id?.toString()}
              href={`/fashion-lifestyle/subcategory/${typeSlug}_${typeId}_${catSlug}_${catId}_${slugify(
                subCategory?.sub_category_name
              )}_${subCategory?._id}`}
              image={subCategory?.banner_type_1}
              name={subCategory?.sub_category_name}
            />
          ))}
        </div>
      )}
    </FashionSection>
  );
};

export default SubCategorySection;
