"use client";

import Head from "next/head";
import Link from "next/link";
import { useParams } from "next/navigation";
import FiltersSidebar from "./FiltersSidebar";
import FilterProducts from "./FilterProducts";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import { useProductFilters } from "../hooks/useProductFilters";

const ProductByCategory = () => {
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
    <div className="bg-gray-50">
      <Head>
        <title>{typeSlug} | Fashion Store</title>
        <meta
          name="description"
          content={`Browse our ${typeSlug} collection`}
        />
      </Head>

      <main className="max-w-7xl mx-auto py-4 md:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700 capitalize mb-4 md:mb-6 flex flex-wrap items-center gap-y-1">
          <Link href={`/fashion-lifestyle/type/${typeSlug}_${typeId}`}>
            <span className="flex items-center text-gray-800 hover:text-blue-600">
              {typeSlug?.replace(/-/g, " ")}{" "}
              <MdKeyboardArrowRight className="text-gray-500" />
            </span>
          </Link>

          <Link
            href={`/fashion-lifestyle/category/${typeSlug}_${typeId}_${catSlug}_${catId}`}
          >
            <span className="flex items-center text-gray-700 hover:text-blue-600">
              {catSlug?.replace(/-/g, " ")}{" "}
              <MdKeyboardArrowRight className="text-gray-500" />
            </span>
          </Link>
          <span className="text-gray-600">
            {subCatSlug?.replace(/-/g, " ")}
          </span>
        </h1>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
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
