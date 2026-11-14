"use client";

import Link from "next/link";
import React, { useState } from "react";
import { slugify } from "../utils/slugify";
import { useParams } from "next/navigation";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsChevronDown, BsPerson } from "react-icons/bs";
import { useStoreItems } from "../hooks/fetchData/useStoreItems";
import { generateStoreNavItems } from "../utils/generateStoreNavItems";

const StoreSidebarItems = ({ onClose }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeCatMenu, setActiveCatMenu] = useState(null);

  const params = useParams();
  const storeId = params?.shopSlugId?.split("_")[1];
  const shopSlugId = params?.shopSlugId;

  const { useTypeByStoreId, useCategoryByStoreId, useSubCategoryByStoreId } =
    useStoreItems();

  const { data: allTypesByStore } = useTypeByStoreId(storeId);
  const { data: allCategoriesByStore } = useCategoryByStoreId(storeId);
  const { data: allSubCategoriesByStore, isLoading } =
    useSubCategoryByStoreId(storeId);

  const storeNavItems =
    allTypesByStore && allCategoriesByStore && allSubCategoriesByStore
      ? generateStoreNavItems(
          allTypesByStore,
          allCategoriesByStore,
          allSubCategoriesByStore
        )
      : null;

  if (isLoading) {
    return (
      <div className="bg-white h-[90vh] flex justify-center items-center animate-pulse">
        <div className="flex flex-col gap-5 justify-center items-center border-b h-10 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="min-h-8 border w-56 bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!storeNavItems) {
    return (
      <div className="bg-white w-full h-[90vh] flex justify-center items-center">
        <div className="relative hidden lg:flex justify-center items-center border-b h-12">
          <p className="text-red-600">Something went wrong!</p>
        </div>
      </div>
    );
  }

  if (!storeNavItems || storeNavItems?.length === 0) return null;

  return (
    <div>
      <div className="border-b border-gray-100 pb-3">
        <ul className="space-y-0.5">
          {storeNavItems?.slice(0, 7)?.map((navItem) => (
            <li key={navItem?.type_name}>
              <button
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-start text-[15px] font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                onClick={() =>
                  setActiveMenu(
                    activeMenu === navItem?.type_name
                      ? null
                      : navItem?.type_name
                  )
                }
              >
                {navItem?.type_name}
                <BsChevronDown
                  className={`transition-transform duration-300 ${
                    activeMenu === navItem?.type_name ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeMenu === navItem?.type_name
                    ? "max-h-[2000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="mb-2 ml-4 space-y-0.5 border-l border-gray-200 pl-2">
                  {navItem?.categories?.map((cat) => (
                    <div key={cat?.name}>
                      <button
                        onClick={() =>
                          setActiveCatMenu(
                            activeCatMenu === cat?.name ? null : cat?.name
                          )
                        }
                        className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-start text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                      >
                        {cat?.name}
                        <BsChevronDown
                          className={`transition-transform duration-300 ${
                            activeCatMenu === cat?.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          activeCatMenu === cat?.name
                            ? "max-h-[2000px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <ul className="mb-1 ml-3 space-y-0.5 border-l border-gray-100 pl-2">
                          {cat?.subcategories?.map((subcat) => (
                            <li key={subcat?.id}>
                              <Link
                                href={`/fashion-lifestyle/shop/${shopSlugId}/category/${slugify(
                                  navItem?.type_name
                                )}_${cat?.type_id}_${slugify(cat?.name)}_${
                                  cat?.category_id
                                }_${slugify(subcat?.name)}_${subcat?.id}`}
                                onClick={() => onClose()}
                                className="block rounded-lg px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#D9481C] dark:hover:text-[#FF8A5B]"
                              >
                                {subcat?.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-3">
        <div className="flex flex-col space-y-0.5">
          <Link href="/fashion-lifestyle/user/profile">
            <button
              onClick={() => onClose()}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <BsPerson className="text-lg" />
              <span>Account</span>
            </button>
          </Link>

          <Link href="/fashion-lifestyle/wishlist">
            <button
              onClick={() => onClose()}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <IoMdHeartEmpty className="text-lg" />
              <span>Wishlist</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoreSidebarItems;
