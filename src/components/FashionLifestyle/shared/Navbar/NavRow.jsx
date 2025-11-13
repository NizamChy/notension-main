"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "../../utils/slugify";
import { BsChevronDown } from "react-icons/bs";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";

const NavRow = ({
  navItems,
  brands,
  itemsByBrand,
  setItemsByBrand,
  activeMenu,
  setActiveMenu,
  hoveredCategory,
  setHoveredCategory,
}) => {
  return (
    <ul className="hidden lg:flex gap-2 2xl:gap-6 font-medium h-full">
      {navItems?.map((navItem) => (
        <li
          key={navItem?.type_id}
          className="h-full flex items-center group"
          onMouseEnter={() => setActiveMenu(navItem?.type_name)}
          onMouseLeave={() => {
            setActiveMenu(null);
            setHoveredCategory(null);
            itemsByBrand && setItemsByBrand(null);
          }}
        >
          <Link
            href={`/fashion_lifestyle/cat/${slugify(navItem?.type_name)}_${
              navItem?.type_id
            }`}
            onClick={() => setActiveMenu(null)}
            className="flex items-center py-2 cursor-pointer text-primary hover:text-blue-700 px-2"
          >
            {navItem?.type_name}
            <BsChevronDown className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180" />
          </Link>

          {activeMenu === navItem?.type_name &&
            navItem?.categories?.length > 0 && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[1000px] xl:w-[1200px] bg-white shadow-lg z-50 border rounded-b-lg">
                <div className="p-6 grid grid-cols-5 gap-6">
                  <div className="col-span-1">
                    <h3 className="font-bold text-lg text-blue-900">
                      Search By Brands
                    </h3>
                    <ul className="space-y-1 mt-1">
                      {brands?.map((brand, index) => (
                        <li key={index}>
                          <button
                            onClick={() => {
                              const activeNavItem = navItems?.find(
                                (item) => item?.type_name === activeMenu
                              );
                              if (!activeNavItem) return;
                              const filterByBrand =
                                activeNavItem?.categories?.filter((item) =>
                                  item?.name
                                    .toLowerCase()
                                    .includes(brand?.brand_name?.toLowerCase())
                                );
                              setItemsByBrand(filterByBrand);
                            }}
                            className="text-base text-primary hover:text-blue-500 transition-all duration-300 capitalize hover:underline focus:text-blue-500"
                          >
                            {brand?.brand_name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-span-3 max-h-[50vh] overflow-y-auto">
                    <div className="columns-4 gap-8">
                      {(itemsByBrand || navItem?.categories)?.map((cat) => (
                        <div
                          key={cat?.category_id}
                          className="break-inside-avoid mb-4"
                          onMouseEnter={() => setHoveredCategory(cat)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          <Link
                            href={`/fashion_lifestyle/subcat/${slugify(
                              navItem?.type_name
                            )}_${cat?.type_id}_${slugify(cat?.name)}_${
                              cat?.category_id
                            }`}
                            onClick={() => setActiveMenu(null)}
                          >
                            <h3 className="font-bold text-sm text-blue-800 capitalize">
                              {cat?.name}
                            </h3>
                          </Link>
                          <ul className="list-none p-0 m-0">
                            {cat?.subcategories?.map((subcat) => (
                              <li key={subcat?.id}>
                                <Link
                                  href={`/fashion_lifestyle/category/${slugify(
                                    navItem?.type_name
                                  )}_${cat?.type_id}_${slugify(cat?.name)}_${
                                    cat?.category_id
                                  }_${slugify(subcat?.name)}_${subcat?.id}`}
                                  onClick={() => setActiveMenu(null)}
                                  className="text-sm text-gray-800 hover:text-blue-500 transition-all duration-300 capitalize"
                                >
                                  {subcat?.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-l pl-6 col-span-1">
                    {hoveredCategory ? (
                      <>
                        <h3 className="font-bold text-base mb-3">Featured</h3>
                        <div className="group">
                          <div className="aspect-[3/4] relative overflow-hidden rounded-lg mb-2">
                            {hoveredCategory?.category_img && (
                              <Image
                                src={`${FASHION_IMAGE_URL}/${hoveredCategory?.category_img}`}
                                alt={hoveredCategory?.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                          </div>
                          <p className="text-sm">{hoveredCategory?.name}</p>
                        </div>
                      </>
                    ) : (
                      navItem?.featured?.image && (
                        <>
                          <h3 className="font-bold text-base mb-3">Featured</h3>
                          <div className="group">
                            <div className="aspect-[3/4] relative overflow-hidden rounded-lg mb-2">
                              <Image
                                src={`${FASHION_IMAGE_URL}/${navItem?.featured?.image}`}
                                alt={navItem?.featured?.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <p className="text-sm">
                              {navItem?.featured?.title}
                            </p>
                          </div>
                        </>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
        </li>
      ))}
    </ul>
  );
};

export default NavRow;
