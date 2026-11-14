"use client";

import Head from "next/head";
import { useParams } from "next/navigation";
import FiltersSidebar from "./FiltersSidebar";
import FilterProducts from "./FilterProducts";
import { PageHeader } from "@/components/shared/UI/UI";
import { useProductFilters } from "../hooks/useProductFilters";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import {
  Breadcrumbs,
  FASHION_CONTAINER,
  unslug,
} from "../shared/FashionSection";

const ProductByCategory = ({ subCategoryNav = null }) => {
  const params = useParams();
  const typeCatSubIdSlug = params?.subcategorySlugId || "";
  const [typeSlug, typeId, catSlug, catId, subCatSlug, subCatId] =
    typeCatSubIdSlug.split("_");

  const { brands, useSubCategoryById, useKidsProductsByCatId } =
    useCategoryItem();

  const {
    data: kidsProductsByCatId,
    isLoading,
    isError,
  } = useKidsProductsByCatId(typeId, catId);

  const { data: subCategories, isLoading: isSubCategoriesLoading } =
    useSubCategoryById(catId);

  const {
    selectedSizes,
    selectedColors,
    selectedBrands,
    selectedFits,
    selectedFabrics,
    selectedEmbelishments,
    selectedSleeveLengths,
    selectedSegments,
    inStockOnly,
    setInStockOnly,
    priceRange,
    toggleFilter,
    handlePriceChange,
    clearAllFilters,
    filterOptions,
    filteredProducts,
    totalCount,
  } = useProductFilters(kidsProductsByCatId, {
    defaultSegments: subCatId ? [subCatId] : [],
    brands,
  });

  return (
    <div className="min-h-content">
      <Head>
        <title>{typeSlug} | Fashion Store</title>
        <meta
          name="description"
          content={`Browse our ${typeSlug} collection`}
        />
      </Head>

      <main className={`${FASHION_CONTAINER} py-6 md:py-8`}>
        <Breadcrumbs
          items={[
            { label: "Fashion", href: "/fashion-lifestyle" },
            {
              label: unslug(typeSlug),
              href: `/fashion-lifestyle/type/${typeSlug}_${typeId}`,
            },
            {
              label: unslug(catSlug),
              href: `/fashion-lifestyle/category/${typeSlug}_${typeId}_${catSlug}_${catId}`,
            },
            { label: unslug(subCatSlug) },
          ]}
        />
        <PageHeader
          title={<span className="capitalize">{unslug(subCatSlug)}</span>}
          className="!mb-5"
        />

        {subCategoryNav && <div className="mb-6 md:mb-8">{subCategoryNav}</div>}

        <div className="flex flex-col items-start gap-6 md:flex-row lg:gap-8">
          <FiltersSidebar
            priceRange={priceRange}
            inStockOnly={inStockOnly}
            toggleFilter={toggleFilter}
            selectedFits={selectedFits}
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
            setInStockOnly={setInStockOnly}
            selectedBrands={selectedBrands}
            clearAllFilters={clearAllFilters}
            selectedFabrics={selectedFabrics}
            selectedSegments={selectedSegments}
            handlePriceChange={handlePriceChange}
            selectedEmbelishments={selectedEmbelishments}
            selectedSleeveLengths={selectedSleeveLengths}
            subCategories={subCategories}
            brands={brands}
            filterOptions={filterOptions}
            typeCatSubIdSlug={typeCatSubIdSlug}
            isSubCategoriesLoading={isSubCategoriesLoading}
          />

          <FilterProducts
            isError={isError}
            isLoading={isLoading}
            products={filteredProducts}
            totalCount={totalCount}
            clearAllFilters={clearAllFilters}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductByCategory;
