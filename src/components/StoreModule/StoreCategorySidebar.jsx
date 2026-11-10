"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdPlayArrow } from "react-icons/md";
import { RiArrowRightSLine } from "react-icons/ri";
import { useParams, useRouter } from "next/navigation";
import { getStoreModule, toSlug } from "./storeModules";

// Per-module look of the sidebar (full class strings for the Tailwind scanner).
const SIDEBAR_THEMES = {
  grocery: {
    typeImage: (idx) => `/images/grocery/type/type${idx + 1}.jpg`,
    active: "bg-blue-50 text-primaryGrocery",
    hoverText: "hover:text-primaryGrocery",
    activeText: "text-primaryGrocery",
  },
  medicine: {
    typeImage: (idx) => `/images/medicine/type/type${idx + 1}.webp`,
    active: "bg-green-50 text-secondaryMedicine",
    hoverText: "hover:text-primaryMedicine",
    activeText: "text-primaryMedicine",
  },
};

// Category list on the left of every grocery / medicine store page (lg+).
// It sits under the fixed navbar (75px) and scrolls on its own; every type
// row has the same height (two-line clamp) so the list reads as a clean column.
const StoreCategorySidebar = ({ moduleName }) => {
  const [isOpen, setIsOpen] = useState(null);
  const [activeSubtype, setActiveSubtype] = useState("");

  const params = useParams();
  const router = useRouter();
  const { basePath } = getStoreModule(moduleName);
  const theme = SIDEBAR_THEMES[moduleName];
  const storePath = `${basePath}/${params?.store}/${params?.storeId}/${params?.customStoreId}`;

  const typeInfo = useSelector((state) => state.dashboard.typeInfo);

  const handleType = (index, data) => {
    setIsOpen((prev) => (prev === index ? null : index));

    if (data?.subtype?.length > 0) {
      router.push(`${storePath}/type/${toSlug(data?.name)}_${data?.id}`);
    } else {
      router.push(`${storePath}/custom-type/${data?.id}`);
    }
  };

  const handleSubtype = (subTypeId, sub) => {
    setActiveSubtype(subTypeId);
    router.push(
      `${storePath}/sub-type/${toSlug(sub?.sub_type_name)}_${subTypeId}`,
    );
  };

  return (
    <aside className="hidden lg:flex flex-col h-full pt-[75px] bg-white border-e border-gray-200">
      <nav className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-3 xl:px-4 py-4">
        <ul className="space-y-1">
          {typeInfo?.map((data, idx) =>
            data?.parent === null ? (
              <li key={data?.id}>
                <button
                  type="button"
                  onClick={() => handleType(idx, data)}
                  className={`w-full h-14 px-2 rounded-lg flex items-center gap-3 text-left transition-colors ${
                    isOpen === idx
                      ? theme.active
                      : `text-deepGray hover:bg-gray-50 ${theme.hoverText}`
                  }`}
                >
                  <Image
                    width={40}
                    height={40}
                    src={data?.image ? theme.typeImage(idx) : "/png/dummyImage.png"}
                    alt=""
                    className="size-10 shrink-0 rounded-md object-contain"
                  />
                  <span className="flex-1 min-w-0 text-sm font-medium leading-snug line-clamp-2">
                    {data?.name}
                  </span>
                  {data?.subtype?.length > 0 && (
                    <RiArrowRightSLine
                      size={18}
                      className={`shrink-0 transition-transform duration-300 ${
                        isOpen === idx ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </button>

                {data?.subtype?.length > 0 && (
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen === idx
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <ul className="overflow-hidden ps-6">
                      {data?.subtype?.map((sub) => {
                        const isActive = sub?.subtypeInfo?._id === activeSubtype;
                        return (
                          <li key={sub?._id}>
                            <button
                              type="button"
                              onClick={() =>
                                handleSubtype(sub?.subtypeInfo?._id, sub)
                              }
                              className={`w-full h-10 px-2 flex items-center gap-2 text-left text-sm font-medium rounded-md ${
                                isActive ? theme.activeText : "text-deepGray"
                              } ${theme.hoverText}`}
                            >
                              <MdPlayArrow className="shrink-0" />
                              <span className="truncate">
                                {sub?.sub_type_name}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            ) : null,
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default StoreCategorySidebar;
