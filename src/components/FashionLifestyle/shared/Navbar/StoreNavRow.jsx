"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { slugify } from "../../utils/slugify";
import { BsChevronDown } from "react-icons/bs";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";

const StoreNavRow = ({
  navItems,
  activeMenu,
  setActiveMenu,
  hoveredCategory,
  setHoveredCategory,
}) => {
  const params = useParams();
  const shopSlugId = params?.shopSlugId;

  if (!navItems) return null;

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
          }}
        >
          <button
            // href={`/fashion-lifestyle/type/${slugify(navItem?.type_name)}_${
            //   navItem?.type_id
            // }`}
            onClick={() => setActiveMenu(null)}
            className={`flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              activeMenu === navItem?.type_name
                ? "text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {navItem?.type_name}
            <BsChevronDown className="ml-1 text-xs transition-transform duration-300 group-hover:rotate-180" />
          </button>

          {activeMenu === navItem?.type_name &&
            navItem?.categories?.length > 0 && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-[900px] bg-white shadow-xl shadow-gray-900/10 z-50 border border-gray-200 rounded-b-2xl">
                <div className="p-6 grid grid-cols-4 gap-6">
                  <div className="col-span-3 max-h-[50vh] overflow-y-auto">
                    <div className="columns-4 gap-8">
                      {navItem?.categories?.map((cat) => (
                        <div
                          key={cat?.category_id}
                          className="break-inside-avoid mb-4"
                          onMouseEnter={() => setHoveredCategory(cat)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          <button
                            onClick={() => setActiveMenu(null)}
                          >
                            <h3 className="mb-1 font-semibold text-sm text-gray-900 capitalize hover:text-[#D9481C] dark:hover:text-[#FF8A5B]">
                              {cat?.name}
                            </h3>
                          </button>
                          <ul className="list-none p-0 m-0">
                            {cat?.subcategories?.map((subcat, index) => (
                              <li
                                key={`${subcat?.id}-${subcat?.name}-${index}`}
                              >
                                <Link
                                  href={`/fashion-lifestyle/shop/${shopSlugId}/category/${slugify(
                                    navItem?.type_name
                                  )}_${cat?.type_id}_${slugify(cat?.name)}_${
                                    cat?.category_id
                                  }_${slugify(subcat?.name)}_${subcat?.id}`}
                                  onClick={() => setActiveMenu(null)}
                                  className="text-sm leading-6 text-gray-600 hover:text-[#D9481C] dark:hover:text-[#FF8A5B] transition-colors capitalize"
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

export default StoreNavRow;
