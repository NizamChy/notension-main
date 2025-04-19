"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdPlayArrow } from "react-icons/md";
import { RiArrowRightSLine } from "react-icons/ri";
import { useParams, useRouter } from "next/navigation";

const CategorySidebar = () => {
  const [isOpen, setIsOpen] = useState(null);
  const [activeSubtype, setActiveSubtype] = useState("");

  const params = useParams();
  const router = useRouter();

  const typeInfo = useSelector((state) => state.dashboard.typeInfo);

  const handleToggle = (index, data) => {
    setIsOpen((prev) => (prev === index ? null : index));

    const formattedTypeName = data?.name
      ?.trim()
      .toLowerCase()
      .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
      .replace(/\s+/g, "-");

    const typeSlugId = `${formattedTypeName}_${data.id}`;

    router.push(
      `/medicine/${params?.store}/${params?.storeId}/${params?.customStoreId}/type/${typeSlugId}`
    );
  };

  const handleSubtype = (subTypeId, sub) => {
    setActiveSubtype(subTypeId);

    const formattedSubTypeName = sub?.sub_type_name
      ?.trim()
      .toLowerCase()
      .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
      .replace(/\s+/g, "-");

    const subTypeSlugId = `${formattedSubTypeName}_${subTypeId}`;

    router.push(
      `/medicine/${params?.store}/${params?.storeId}/${params?.customStoreId}/sub-type/${subTypeSlugId}`
    );
  };

  const handleCustomtype = (customTypeId) => {
    router.push(`/medicine/${params?.store}/custom-type/${customTypeId}`);
  };

  return (
    <div className="max-w-screen-md hidden lg:block">
      <div className="h-full border-e ps-7 max-w-screen-md py-16 bg-white">
        <div className="overflow-y-auto h-[85vh] no-scrollbar mt-10">
          {typeInfo?.map((data, idx) => (
            <div className="border-b border-gray-400/10" key={data?.id}>
              {data?.parent === null && (
                <div
                  onClick={() => {
                    if (data?.subtype?.length > 0) {
                      handleToggle(idx, data);
                    } else {
                      handleToggle(idx, data);
                      handleCustomtype(data.id);
                    }
                  }}
                  className={`transition-all duration-300 cursor-pointer px-2 ${
                    isOpen === idx
                      ? "bg-green-100 text-secondaryMedicine"
                      : "text-deepGray"
                  } ${
                    idx === typeInfo?.length - 1
                      ? "border-none"
                      : "border-b border-gray-100/10"
                  } py-2 flex items-center gap-4`}
                >
                  <div>
                    <Image
                      width={500}
                      height={500}
                      src={
                        data?.image
                          ? `/images/medicine/type/type${idx + 1}.webp`
                          : "/png/dummyImage.png"
                      }
                      alt="medicine category"
                      className="w-10 h-10"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-base hover:text-primaryMedicine">
                      {data.name}
                    </p>
                  </div>
                  {data?.subtype?.length > 0 && (
                    <div
                      className={`duration-300 ease-in-out ${
                        isOpen === idx ? "rotate-90 " : ""
                      }`}
                    >
                      <RiArrowRightSLine size={20} />
                    </div>
                  )}
                </div>
              )}
              <div
                className={`grid overflow-hidden transition-all duration-300 ease-in-out text-slate-600 ${
                  isOpen === idx
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden ps-4">
                  {data?.subtype?.map((sub, idx) => (
                    <div
                      onClick={() => handleSubtype(sub?.subtypeInfo?._id, sub)}
                      key={sub?._id}
                    >
                      <div
                        className={`cursor-pointer ${
                          idx === data?.subtype?.length - 1
                            ? "border-none"
                            : "border-b border-gray-400/10"
                        } py-4 flex items-center justify-between gap-4 ml-6`}
                      >
                        <div>
                          <MdPlayArrow
                            className={`font-medium text-base ${
                              sub?.subtypeInfo?._id === activeSubtype
                                ? "text-primaryMedicine"
                                : "text-deepGray"
                            } hover:text-primaryMedicine`}
                          />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium text-base ${
                              sub?.subtypeInfo?._id === activeSubtype
                                ? "text-primaryMedicine"
                                : "text-deepGray"
                            } hover:text-primaryMedicine`}
                          >
                            {sub?.sub_type_name}
                          </p>
                        </div>
                        {sub?.subtype?.length > 0 && (
                          <>
                            <RiArrowRightSLine size={20} />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
