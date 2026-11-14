"use client";

import { useState, useEffect } from "react";
import FilterSection from "./FilterSection";
import FilterCheckbox from "./FilterCheckbox";
import PriceRangeSlider from "./PriceRangeSlider";
import { FILTER_OPTIONS } from "../utils/constants";
import MobileFilterButton from "./MobileFilterButton";
import Drawer from "@/components/shared/Drawer/Drawer";
import { CARD, PRIMARY_BUTTON } from "@/components/shared/UI/UI";

// Colour names that are not valid CSS colour keywords.
const SWATCHES = {
  cream: "#F5EFD9",
  mustard: "#D4A017",
  peach: "#F6B99A",
  "off white": "#F7F5EF",
  "sky blue": "#87CEEB",
  multi:
    "conic-gradient(#EB5C2F, #F79009, #12B76A, #0C3F8E, #7F56D9, #EB5C2F)",
  multicolor:
    "conic-gradient(#EB5C2F, #F79009, #12B76A, #0C3F8E, #7F56D9, #EB5C2F)",
};

/** CSS background for a colour name ("Navy", "Sky Blue", "Mustard"). */
export const colorSwatch = (name = "") => {
  const key = String(name).trim().toLowerCase();
  return SWATCHES[key] || key.replace(/\s+/g, "") || "transparent";
};

const FiltersSidebar = ({
  selectedSizes,
  selectedColors,
  selectedBrands,
  selectedFits,
  selectedFabrics,
  selectedEmbelishments,
  selectedSleeveLengths,
  selectedSegments,
  inStockOnly,
  priceRange,
  toggleFilter,
  setInStockOnly,
  handlePriceChange,
  clearAllFilters,
  subCategories,
  brands,
  filterOptions,
  typeCatSubIdSlug,
  shopSlugId = null,
  isSubCategoriesLoading,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [openFilter, setOpenFilter] = useState("segment");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const activeFilterCount = [
    selectedSizes.length,
    selectedColors.length,
    selectedBrands.length,
    selectedFits.length,
    selectedFabrics.length,
    selectedEmbelishments.length,
    selectedSleeveLengths.length,
    selectedSegments.length,
    inStockOnly ? 1 : 0,
    priceRange[0] > 0 || priceRange[1] < 25000 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const contentProps = {
    openFilter,
    setOpenFilter,
    selectedSizes,
    selectedColors,
    selectedBrands,
    selectedSegments,
    priceRange,
    toggleFilter,
    handlePriceChange,
    subCategories,
    brands,
    filterOptions,
    typeCatSubIdSlug,
    isSubCategoriesLoading,
  };

  return (
    <>
      <MobileFilterButton
        onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
        filterCount={activeFilterCount}
      />

      {/* Desktop Sidebar */}
      <aside
        aria-label="Product filters"
        className="hidden w-full flex-shrink-0 self-stretch md:block md:w-60 lg:w-64"
      >
        <div
          className={`${CARD} sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto px-5 py-4`}
        >
          <FilterHeader
            count={activeFilterCount}
            clearAllFilters={clearAllFilters}
          />
          <FilterContent {...contentProps} />
        </div>
      </aside>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        side="left"
        title="Filters"
        subtitle={
          activeFilterCount > 0 ? `${activeFilterCount} applied` : undefined
        }
        bodyClass="px-5 py-2"
        footer={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearAllFilters}
              className="h-11 rounded-full px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(false)}
              className={`${PRIMARY_BUTTON} flex-1`}
            >
              Show results
            </button>
          </div>
        }
      >
        <FilterContent {...contentProps} />
      </Drawer>
    </>
  );
};

const FilterHeader = ({ count, clearAllFilters }) => (
  <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
    <h2 className="text-base font-semibold text-gray-900">
      Filters
      {count > 0 && (
        <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0C3F8E] px-1.5 text-xs font-bold tabular-nums text-white">
          {count}
        </span>
      )}
    </h2>

    <button
      type="button"
      onClick={clearAllFilters}
      className="min-h-9 text-sm font-semibold text-[#0C3F8E] hover:underline dark:text-[#7FB2FF]"
    >
      Clear all
    </button>
  </div>
);

const FilterContent = ({
  openFilter,
  setOpenFilter,
  selectedSizes,
  selectedColors,
  selectedBrands,
  selectedSegments,
  priceRange,
  toggleFilter,
  handlePriceChange,
  subCategories,
  brands,
  filterOptions,
  typeCatSubIdSlug,
  isSubCategoriesLoading,
}) => {
  const [, , , , , subCatId] = typeCatSubIdSlug?.split("_") || "";

  // Options come from the loaded products (see useProductFilters) so every
  // choice actually matches something. Fall back to the static lists only
  // when no options were passed at all.
  const brandOptions =
    filterOptions?.brands ??
    (brands || []).map((brand) => ({
      value: brand?._id,
      label: brand?.brand_name,
    }));
  const sizeOptions =
    filterOptions?.sizes ??
    FILTER_OPTIONS.sizes.map((size) => ({
      value: size.toLowerCase(),
      label: size,
    }));
  const colorOptions =
    filterOptions?.colors ??
    FILTER_OPTIONS.colors.map((color) => ({
      value: color.toLowerCase(),
      label: color,
    }));

  const emptyOptions = (label) => (
    <p className="py-1 text-sm text-gray-500">No {label} for these products</p>
  );

  const toggle = (key) => setOpenFilter(openFilter === key ? null : key);

  return (
    <div>
      {/* MULTI SELECT SUB-CATEGORY FILTER */}
      <FilterSection
        title="Category"
        isOpen={openFilter === "segment"}
        onClick={() => toggle("segment")}
      >
        {isSubCategoriesLoading ? (
          <p className="py-1 text-sm text-gray-500">Loading…</p>
        ) : (
          <div className="space-y-0.5">
            {subCategories?.map((subCategory) => (
              <FilterCheckbox
                key={subCategory?._id}
                label={subCategory?.sub_category_name}
                checked={
                  selectedSegments.includes(subCategory?._id) ||
                  subCategory?._id === subCatId
                }
                disabled={subCategory?._id === subCatId}
                onChange={() => toggleFilter("segment", subCategory?._id)}
              />
            ))}
          </div>
        )}
      </FilterSection>

      <FilterSection
        title="Brand"
        isOpen={openFilter === "brand"}
        onClick={() => toggle("brand")}
      >
        <div className="space-y-0.5">
          {brandOptions.length
            ? brandOptions.map((brand) => (
                <FilterCheckbox
                  key={brand.value}
                  label={brand.label}
                  checked={selectedBrands.includes(brand.value)}
                  onChange={() => toggleFilter("brand", brand.value)}
                />
              ))
            : emptyOptions("brands")}
        </div>
      </FilterSection>

      <FilterSection
        title="Size"
        isOpen={openFilter === "size"}
        onClick={() => toggle("size")}
      >
        {sizeOptions.length ? (
          <div className="flex flex-wrap gap-2 p-0.5">
            {sizeOptions.map((size) => {
              const active = selectedSizes.includes(size.value);
              return (
                <button
                  key={size.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleFilter("size", size.value)}
                  className={`h-10 min-w-12 rounded-full border px-3 text-sm font-medium transition-colors ${
                    active
                      ? "border-[#0C3F8E] bg-[#0C3F8E] text-white"
                      : "border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        ) : (
          emptyOptions("sizes")
        )}
      </FilterSection>

      <FilterSection
        title="Colour"
        isOpen={openFilter === "color"}
        onClick={() => toggle("color")}
      >
        {colorOptions.length ? (
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
            {colorOptions.map((color) => (
              <FilterCheckbox
                key={color.value}
                label={color.label}
                swatch={colorSwatch(color.label)}
                checked={selectedColors.includes(color.value)}
                onChange={() => toggleFilter("color", color.value)}
              />
            ))}
          </div>
        ) : (
          emptyOptions("colours")
        )}
      </FilterSection>

      <PriceRangeSlider
        priceRange={priceRange}
        handlePriceChange={handlePriceChange}
      />
    </div>
  );
};

export default FiltersSidebar;
