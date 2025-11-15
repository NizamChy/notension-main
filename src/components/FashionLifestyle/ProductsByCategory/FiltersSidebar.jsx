"use client";

import Link from "next/link";
import { slugify } from "../utils/slugify";
import { useState, useEffect } from "react";
import FilterSection from "./FilterSection";
import FilterCheckbox from "./FilterCheckbox";
import PriceRangeSlider from "./PriceRangeSlider";
import { FILTER_OPTIONS } from "../utils/constants";
import MobileFilterButton from "./MobileFilterButton";

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
  typeCatSubIdSlug,
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
    const handleClickOutside = (event) => {
      const drawer = document.getElementById("filter-drawer");
      const button = document.getElementById("filter-button");

      if (
        drawer &&
        button &&
        !drawer.contains(event.target) &&
        !button.contains(event.target)
      ) {
        setIsMobileDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <MobileFilterButton
        onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
        filterCount={activeFilterCount}
      />

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-full md:w-64 flex-shrink-0">
        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-28">
          <FilterContent
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
            selectedBrands={selectedBrands}
            selectedFits={selectedFits}
            selectedFabrics={selectedFabrics}
            selectedEmbelishments={selectedEmbelishments}
            selectedSleeveLengths={selectedSleeveLengths}
            selectedSegments={selectedSegments}
            inStockOnly={inStockOnly}
            priceRange={priceRange}
            toggleFilter={toggleFilter}
            setInStockOnly={setInStockOnly}
            handlePriceChange={handlePriceChange}
            clearAllFilters={clearAllFilters}
            subCategories={subCategories}
            brands={brands}
            typeCatSubIdSlug={typeCatSubIdSlug}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        id="filter-drawer"
        className={`fixed inset-0 z-30 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsMobileDrawerOpen(false)}
        ></div>
        <div className="relative h-full w-4/5 max-w-sm bg-white shadow-xl overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-end items-center mb-6">
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <FilterContent
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
              selectedSizes={selectedSizes}
              selectedColors={selectedColors}
              selectedBrands={selectedBrands}
              selectedFits={selectedFits}
              selectedFabrics={selectedFabrics}
              selectedEmbelishments={selectedEmbelishments}
              selectedSleeveLengths={selectedSleeveLengths}
              selectedSegments={selectedSegments}
              inStockOnly={inStockOnly}
              priceRange={priceRange}
              toggleFilter={toggleFilter}
              setInStockOnly={setInStockOnly}
              handlePriceChange={handlePriceChange}
              clearAllFilters={clearAllFilters}
              subCategories={subCategories}
              brands={brands}
              typeCatSubIdSlug={typeCatSubIdSlug}
            />

            <div className="mt-5 flex justify-center">
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg px-4 w-full"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const FilterContent = ({
  openFilter,
  setOpenFilter,
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
  typeCatSubIdSlug,
}) => {
  const [typeSlug, typeId, catSlug, catId, subCatSlug, subCatId] =
    typeCatSubIdSlug.split("_");

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Filters</h2>

        <button
          onClick={clearAllFilters}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear all
        </button>
      </div>

      <FilterSection
        title="Category"
        isOpen={openFilter === "segment"}
        onClick={() =>
          setOpenFilter(openFilter === "segment" ? null : "segment")
        }
      >
        <div className="space-y-2">
          {subCategories?.map((subCategory) => (
            <Link
              key={subCategory?._id}
              href={`/fashion_lifestyle/category/${typeSlug}_${typeId}_${catSlug}_${catId}_${slugify(
                subCategory?.sub_category_name
              )}_${subCategory?._id}`}
              className="flex items-center"
            >
              <label className="space-x-2 cursor-pointer flex items-center">
                <input
                  type="radio"
                  checked={
                    subCatId === subCategory?._id ||
                    selectedSegments.includes(subCategory?.sub_category_name)
                  }
                  onChange={() =>
                    toggleFilter("segment", subCategory?.sub_category_name)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">
                  {subCategory?.sub_category_name}
                </span>
              </label>
            </Link>
          ))}
        </div>
      </FilterSection>

      {/* <FilterSection
        title="Category"
        isOpen={openFilter === "segment"}
        onClick={() =>
          setOpenFilter(openFilter === "segment" ? null : "segment")
        }
      >
        <div className="space-y-2">
          {subCategories?.map((subCategory) => (
            <FilterCheckbox
              key={subCategory?._id}
              label={subCategory?.sub_category_name}
              checked={selectedSegments.includes(
                subCategory?.sub_category_name
              )}
              onChange={() =>
                toggleFilter("segment", subCategory?.sub_category_name)
              }
            />
          ))}
        </div>
      </FilterSection> */}

      {/* <FilterSection
        title="Category"
        isOpen={openFilter === "segment"}
        onClick={() =>
          setOpenFilter(openFilter === "segment" ? null : "segment")
        }
      >
        <div className="space-y-2">
          {FILTER_OPTIONS.segments.map((segment) => (
            <FilterCheckbox
              key={segment}
              label={segment}
              checked={selectedSegments.includes(segment)}
              onChange={() => toggleFilter("segment", segment)}
            />
          ))}
        </div>
      </FilterSection> */}

      <FilterSection
        title="Brand"
        isOpen={openFilter === "brand"}
        onClick={() => setOpenFilter(openFilter === "brand" ? null : "brand")}
      >
        <div className="space-y-2">
          {brands?.map((brand) => (
            <FilterCheckbox
              key={brand?._id}
              label={brand?.brand_name}
              checked={selectedBrands.includes(brand?.brand_name)}
              onChange={() => toggleFilter("brand", brand?.brand_name)}
            />
          ))}
        </div>
      </FilterSection>

      {/*   <FilterSection
        title="Brand"
        isOpen={openFilter === "brand"}
        onClick={() => setOpenFilter(openFilter === "brand" ? null : "brand")}
      >
        <div className="space-y-2">
          {FILTER_OPTIONS.brands.map((brand) => (
            <FilterCheckbox
              key={brand}
              label={brand}
              checked={selectedBrands.includes(brand)}
              onChange={() => toggleFilter("brand", brand)}
            />
          ))}
        </div>
      </FilterSection> */}

      <FilterSection
        title="Size"
        isOpen={openFilter === "size"}
        onClick={() => setOpenFilter(openFilter === "size" ? null : "size")}
      >
        <div className="grid grid-cols-3 gap-2">
          {FILTER_OPTIONS.sizes.map((size) => (
            <FilterCheckbox
              key={size}
              label={size}
              checked={selectedSizes.includes(size)}
              onChange={() => toggleFilter("size", size)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Color"
        isOpen={openFilter === "color"}
        onClick={() => setOpenFilter(openFilter === "color" ? null : "color")}
      >
        <div className="grid grid-cols-2 gap-2">
          {FILTER_OPTIONS.colors.map((color) => (
            <FilterCheckbox
              key={color}
              label={color}
              checked={selectedColors.includes(color.toLowerCase())}
              onChange={() => toggleFilter("color", color.toLowerCase())}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Fit"
        isOpen={openFilter === "fit"}
        onClick={() => setOpenFilter(openFilter === "fit" ? null : "fit")}
      >
        <div className="space-y-2">
          {FILTER_OPTIONS.fits.map((fit) => (
            <FilterCheckbox
              key={fit}
              label={fit}
              checked={selectedFits.includes(fit)}
              onChange={() => toggleFilter("fit", fit)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Fabrication"
        isOpen={openFilter === "fabric"}
        onClick={() => setOpenFilter(openFilter === "fabric" ? null : "fabric")}
      >
        <div className="space-y-2">
          {FILTER_OPTIONS.fabrics.map((fabric) => (
            <FilterCheckbox
              key={fabric}
              label={fabric}
              checked={selectedFabrics.includes(fabric)}
              onChange={() => toggleFilter("fabric", fabric)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Embelishments"
        isOpen={openFilter === "embelishment"}
        onClick={() =>
          setOpenFilter(openFilter === "embelishment" ? null : "embelishment")
        }
      >
        <div className="space-y-2">
          {FILTER_OPTIONS.embelishments.map((emb) => (
            <FilterCheckbox
              key={emb}
              label={emb}
              checked={selectedEmbelishments.includes(emb)}
              onChange={() => toggleFilter("embelishment", emb)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Sleeve Length"
        isOpen={openFilter === "sleeveLength"}
        onClick={() =>
          setOpenFilter(openFilter === "sleeveLength" ? null : "sleeveLength")
        }
      >
        <div className="space-y-2">
          {FILTER_OPTIONS.sleeveLengths.map((length) => (
            <FilterCheckbox
              key={length}
              label={length}
              checked={selectedSleeveLengths.includes(length)}
              onChange={() => toggleFilter("sleeveLength", length)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Stock Availability"
        isOpen={openFilter === "stock"}
        onClick={() => setOpenFilter(openFilter === "stock" ? null : "stock")}
      >
        <div className="space-y-2">
          <FilterCheckbox
            label="In stock only"
            checked={inStockOnly}
            onChange={() => setInStockOnly(!inStockOnly)}
          />
        </div>
      </FilterSection>

      <PriceRangeSlider
        priceRange={priceRange}
        handlePriceChange={handlePriceChange}
      />
    </>
  );
};

export default FiltersSidebar;
