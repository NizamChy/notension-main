"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

const BannerByStore = ({ storeInfo }) => {
  const params = useParams();

  return (
    <div className="pt-5">
      <div className="relative w-full h-56 md:h-[500px] overflow-hidden shadow-xl">
        <Image
          src={storeInfo?.store_banner}
          alt="Shopping store banner"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        <div className="relative z-10 flex flex-col items-start justify-center h-full px-8 text-white max-w-7xl mx-auto">
          <span className="text-sm md:text-xl font-medium mb-2">
            Products by
          </span>
          <h1 className="text-xl md:text-6xl font-bold mb-2 md:mb-4">
            {storeInfo?.store_name}
          </h1>
          <p className="text-xs md:text-xl mb-4 md:mb-8 max-w-lg">
            {storeInfo?.store_description}
          </p>

          {!params?.storeId && (
            <div className="flex gap-4">
              <Link
                href={`/visit/${storeInfo?.store_id}`}
                className="px-6 py-2 md:px-8 md:py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition duration-300"
              >
                Visit Store
              </Link>
              <Link
                href={`/visit/${storeInfo?.store_id}`}
                className="px-6 py-2 md:px-8 md:py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-gray-900 transition duration-300"
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>

        {/* <div className="absolute top-8 right-8 bg-red-600 text-white px-4 py-2 rounded-full font-bold animate-pulse">
          50% OFF
        </div> */}
      </div>
    </div>
  );
};

export default BannerByStore;
