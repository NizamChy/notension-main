"use client";

import Head from "next/head";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useStoreItems } from "../hooks/fetchData/useStoreItems";
import FiltersSidebar from "../ProductsByCategory/FiltersSidebar";
import FilterProducts from "../ProductsByCategory/FilterProducts";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import { useProductFilters } from "../hooks/useProductFilters";

const StoreProductsBySubCat = () => {
  const params = useParams();

  const typeCatSubIdSlug = params?.category || "";
  const shopId = params?.shopSlugId?.split("_")[1];
  const shopName = decodeURIComponent(
    params?.shopSlugId?.split("_")[0] || ""
  ).replace(/-/g, " ");

  const [, typeId, , catId, subCatSlug, subCatId] =
    typeCatSubIdSlug.split("_");

  const { useProductsByStoreSubCatId } = useStoreItems();
  const { useSubCategoryById, brands } = useCategoryItem();

  const {
    data: filteredKidsProducts,
    isLoading,
    isError,
  } = useProductsByStoreSubCatId(
    shopId,
    typeId,
    catId
    // subCatId
  );

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
  } = useProductFilters(filteredKidsProducts, {
    defaultSegments: subCatId ? [subCatId] : [],
    brands,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{`${subCatSlug?.replace(/-/g, " ")} | ${shopName}`}</title>
        <meta
          name="description"
          content={`Browse ${subCatSlug?.replace(/-/g, " ")} at ${shopName}`}
        />
      </Head>

      <main className="max-w-7xl mx-auto py-4 md:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        {/* Store links only carry the type and category ids (their slugs
            are the placeholders "type" and "category"), so the breadcrumb
            is "shop name > sub-category" and leads back to the shop. */}
        <h1 className="text-lg md:text-2xl font-semibold text-gray-700 capitalize mb-4 md:mb-6 flex flex-wrap items-center gap-y-1">
          <Link href={`/fashion-lifestyle/shop/${params?.shopSlugId}`}>
            <span className="flex items-center text-gray-800 hover:text-blue-600">
              {shopName}
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
            shopSlugId={params?.shopSlugId}
            isSubCategoriesLoading={isSubCategoriesLoading}
          />

          <FilterProducts
            isError={isError}
            isLoading={isLoading}
            products={filteredProducts}
            totalCount={totalCount}
            clearAllFilters={clearAllFilters}
            // products={products}
            // filteredProducts={filteredProducts}
          />
        </div>
      </main>
    </div>
  );
};

export default StoreProductsBySubCat;
