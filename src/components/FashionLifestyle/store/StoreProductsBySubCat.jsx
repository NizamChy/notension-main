"use client";

import Head from "next/head";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/UI/UI";
import {
  Breadcrumbs,
  FASHION_CONTAINER,
  unslug,
} from "../shared/FashionSection";
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
    <div className="min-h-content">
      <Head>
        <title>{`${subCatSlug?.replace(/-/g, " ")} | ${shopName}`}</title>
        <meta
          name="description"
          content={`Browse ${subCatSlug?.replace(/-/g, " ")} at ${shopName}`}
        />
      </Head>

      <main className={`${FASHION_CONTAINER} py-6 md:py-8`}>
        {/* Store links only carry the type and category ids (their slugs
            are the placeholders "type" and "category"), so the breadcrumb
            is "shop name > sub-category" and leads back to the shop. */}
        <Breadcrumbs
          items={[
            { label: "Fashion", href: "/fashion-lifestyle" },
            {
              label: shopName,
              href: `/fashion-lifestyle/shop/${params?.shopSlugId}`,
            },
            { label: unslug(subCatSlug) },
          ]}
        />
        <PageHeader
          title={<span className="capitalize">{unslug(subCatSlug)}</span>}
          subtitle={<span className="capitalize">at {shopName}</span>}
          className="!mb-6"
        />

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
