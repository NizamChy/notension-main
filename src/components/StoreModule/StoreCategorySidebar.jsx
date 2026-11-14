"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { HiChevronRight } from "react-icons/hi";
import { useParams, useRouter } from "next/navigation";
import { getStoreModule, toSlug } from "./storeModules";
import { getCategoryIcon } from "./categoryIcons";

// Category tree of a grocery / medicine store. Used by the desktop sidebar
// and the mobile drawer. `onNavigate` runs after a leaf is picked.
export const StoreCategoryList = ({ moduleName, onNavigate }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeSubtype, setActiveSubtype] = useState("");

  const params = useParams();
  const router = useRouter();
  const { basePath } = getStoreModule(moduleName);
  const storePath = `${basePath}/${params?.store}/${params?.storeId}/${params?.customStoreId}`;

  const typeInfo = useSelector((state) => state.dashboard.typeInfo);

  const handleType = (index, data) => {
    setOpenIndex((prev) => (prev === index ? null : index));

    if (data?.subtype?.length > 0) {
      router.push(`${storePath}/type/${toSlug(data?.name)}_${data?.id}`);
    } else {
      router.push(`${storePath}/custom-type/${data?.id}`);
      onNavigate?.();
    }
  };

  const handleSubtype = (subTypeId, sub) => {
    setActiveSubtype(subTypeId);
    router.push(
      `${storePath}/sub-type/${toSlug(sub?.sub_type_name)}_${subTypeId}`,
    );
    onNavigate?.();
  };

  return (
    <ul className="space-y-0.5">
      {typeInfo?.map((data, idx) => {
        if (data?.parent !== null) return null;
        const open = openIndex === idx;
        const hasSub = data?.subtype?.length > 0;
        const { Icon, tone } = getCategoryIcon(data?.name);

        return (
          <li key={data?.id}>
            <button
              type="button"
              onClick={() => handleType(idx, data)}
              aria-expanded={hasSub ? open : undefined}
              className={`flex h-14 w-full items-center gap-3 rounded-xl px-2 text-left transition-colors ${
                open
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span
                aria-hidden
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tone}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="line-clamp-2 min-w-0 flex-1 text-sm font-medium leading-snug">
                {data?.name}
              </span>
              {hasSub && (
                <HiChevronRight
                  className={`shrink-0 text-gray-400 transition-transform duration-300 ${
                    open ? "rotate-90" : ""
                  }`}
                />
              )}
            </button>

            {hasSub && (
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  open
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <ul className="ml-7 overflow-hidden border-l border-gray-200 pl-3">
                  {data.subtype.map((sub) => {
                    const isActive = sub?.subtypeInfo?._id === activeSubtype;
                    return (
                      <li key={sub?._id}>
                        <button
                          type="button"
                          onClick={() =>
                            handleSubtype(sub?.subtypeInfo?._id, sub)
                          }
                          className={`flex h-10 w-full items-center rounded-lg px-2 text-left text-sm transition-colors ${
                            isActive
                              ? "font-semibold text-[#D9481C] dark:text-[#FF8A5B]"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <span className="truncate">{sub?.sub_type_name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

// Category list on the left of every grocery / medicine store page (lg+).
// It sits under the fixed navbar (72px) and scrolls on its own.
const StoreCategorySidebar = ({ moduleName }) => (
  <aside className="hidden h-full flex-col border-e border-gray-200 bg-white pt-[72px] lg:flex">
    <p className="px-5 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">
      Categories
    </p>
    <nav className="flex-1 overflow-y-auto px-3 pb-4 [scrollbar-width:none] xl:px-4 [&::-webkit-scrollbar]:hidden">
      <StoreCategoryList moduleName={moduleName} />
    </nav>
  </aside>
);

export default StoreCategorySidebar;
