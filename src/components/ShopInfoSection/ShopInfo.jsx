"use client";

import React from "react";
import Image from "next/image";
import { BsShop } from "react-icons/bs";
import { useSelector } from "react-redux";
import { IMAGE_URL } from "@/api-endpoints/secret";
import { IoCallOutline, IoLocationOutline } from "react-icons/io5";

const ShopInfo = () => {
  const visitedMedicineStore = useSelector(
    (state) => state.dashboard.visitedMedicineStore
  );

  return (
    <>
      {visitedMedicineStore?._id && (
        <div className="p-2 md:p-4 w-full h-full border border-gray-200 rounded-2xl shadow-sm transition-shadow duration-300 flex flex-col items-center bg-white">
          <Image
            width={500}
            height={300}
            alt="shop banner"
            src={`${IMAGE_URL}/medicine-store-docs/${visitedMedicineStore?.shop_banner_web}`}
            className="rounded-lg overflow-hidden border w-full h-full object-cover"
          />
          <div className="mt-1 md:mt-6 space-y-1 w-full text-gray-700">
            <div className="flex items-center gap-2 text-xs md:text-base lg:text-lg">
              <span>
                <BsShop className="text-indigo-600 md:text-xl" />
              </span>

              <span className="font-semibold text-gray-900 text-nowrap">
                Shop Name:
              </span>
              <span className="truncate font-medium">
                {visitedMedicineStore?.shop_name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-base lg:text-lg">
              <span>
                <IoCallOutline className="text-indigo-600 md:text-xl" />
              </span>

              <span className="font-semibold text-gray-900">Contact:</span>
              <span className="truncate font-medium">
                {visitedMedicineStore?.contact_no},{" "}
                {visitedMedicineStore?.alternative_contact_no}
              </span>
            </div>
            <div className="flex items-start gap-2 text-xs md:text-base lg:text-lg">
              <span>
                <IoLocationOutline className="text-indigo-600 md:text-xl" />
              </span>

              <span className="font-semibold text-gray-900">Location:</span>
              <span className="font-medium line-clamp-2 lg:line-clamp-1">
                {visitedMedicineStore?.district_area_name},{" "}
                {visitedMedicineStore?.district_name}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopInfo;
