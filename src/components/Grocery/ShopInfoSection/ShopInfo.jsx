"use client";
import { IMAGE_URL } from "@/api-endpoints/secret";
import React from "react";
import { useSelector } from "react-redux";
import { IoCallOutline, IoLocationOutline } from "react-icons/io5";
import { BsShop } from "react-icons/bs";
import Image from "next/image";

const ShopInfo = () => {
  const visitedGroceryStore = useSelector(
    (state) => state.dashboard.visitedGroceryStore
  );

  return (
    <>
      {visitedGroceryStore?._id && (
        <div className="p-2 md:p-4 w-full h-full border border-gray-200 rounded-2xl shadow-sm transition-shadow duration-300 flex flex-col items-center bg-white">
          <Image
            width={500}
            height={300}
            alt="shop banner"
            src={`${IMAGE_URL}/grocery-store-docs/${visitedGroceryStore?.shop_banner_web}`}
            className="rounded-lg overflow-hidden border w-full h-full object-cover"
          />
          <div className="mt-1 md:mt-6 space-y-1 w-full text-gray-700">
            <div className="flex items-center gap-2 text-xs md:text-base lg:text-lg">
              <BsShop className="text-indigo-600 text-base md:text-xl" />
              <span className="font-medium md:font-semibold text-gray-900 text-nowrap">
                Shop Name:
              </span>
              <span className="truncate font-medium">
                {visitedGroceryStore?.shop_name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-base lg:text-lg">
              <IoCallOutline className="text-indigo-600 text-base md:text-xl" />
              <span className="font-medium md:font-semibold text-gray-900">
                Contact:
              </span>
              <span className="truncate font-medium">
                {visitedGroceryStore?.contact_no},{" "}
                {visitedGroceryStore?.alternative_contact_no}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-base lg:text-lg">
              <IoLocationOutline className="text-indigo-600 text-base md:text-xl" />
              <span className="font-medium md:font-semibold text-gray-900">
                Location:
              </span>
              <span className="truncate font-medium">
                {visitedGroceryStore?.district_area_name},{" "}
                {visitedGroceryStore?.district_name}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopInfo;
