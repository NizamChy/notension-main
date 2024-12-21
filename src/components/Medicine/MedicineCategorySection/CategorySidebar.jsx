"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { MdPlayArrow } from "react-icons/md";
import { useParams, useRouter } from "next/navigation";
import { useMedicine } from "@/hooks/fetch-data/useMedicine";

const CategorySidebar = () => {
  const [isOpen, setIsOpen] = useState(null);
  const [activeSubtype, setActiveSubtype] = useState("");

  const router = useRouter();

  const params = useParams();

  // const { exploreStore } = useMedicine();

  const typeInfo = useSelector((state) => state.dashboard.typeInfo);

  const handleToggle = (index, data) => {
    setIsOpen((prev) => (prev === index ? null : index));
    // router.push(`/type/${data.id}`);
    router.push(`/medicine/${params?.store}/type/${data.id}`);
  };

  const handleSubtype = (subTypeId) => {
    // router.push(`/sub-type/${subTypeId}`);
    router.push(`/medicine/${params?.store}/sub-type/${subTypeId}`);
    setActiveSubtype(subTypeId);
  };

  const handleCustomtype = (customTypeId) => {
    router.push(`/custom-type/${customTypeId}`);
  };

  // useEffect(() => {
  //   exploreStore();
  // }, []);

  return (
    <div className="max-w-screen-md hidden lg:block">
      <div className="h-full border-e ps-10 pe-4 max-w-screen-md py-16 bg-white">
        <div className="overflow-y-auto h-[85vh] no-scrollbar mt-10">
          {typeInfo?.map((data, idx) => (
            <div className="border-b border-gray-400/10" key={data.id}>
              {data.parent === null && (
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
                      ? "bg-green-100 text-secondary"
                      : "text-deepGray"
                  } ${
                    idx === typeInfo.length - 1
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
                          ? `/png/type/type${idx + 1}.webp`
                          : "/png/dummyImage.png"
                      }
                      alt="medicine category"
                      className="w-10 h-10"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-base hover:text-primary">
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
                      onClick={() => handleSubtype(sub?.subtypeInfo?._id)}
                      key={sub._id}
                    >
                      <div
                        className={`cursor-pointer ${
                          idx === data.subtype.length - 1
                            ? "border-none"
                            : "border-b border-gray-400/10"
                        } py-4 flex items-center justify-between gap-4 ml-6`}
                      >
                        <div>
                          <MdPlayArrow
                            className={`font-medium text-base ${
                              sub?.subtypeInfo?._id === activeSubtype
                                ? "text-primary"
                                : "text-deepGray"
                            } hover:text-primary`}
                          />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium text-base ${
                              sub?.subtypeInfo?._id === activeSubtype
                                ? "text-primary"
                                : "text-deepGray"
                            } hover:text-primary`}
                          >
                            {sub.sub_type_name}
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
