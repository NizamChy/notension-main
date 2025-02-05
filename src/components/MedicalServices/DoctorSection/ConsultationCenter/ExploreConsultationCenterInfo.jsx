"use client";

import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { useSelector } from "react-redux";
import { FaLocationDot } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";
import { useFavouriteList } from "@/hooks/fetch-data/favorite-list";

const ExploreConsultationCenterInfo = () => {
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { addToFavouriteList, isAddedToFavouriteList } = useFavouriteList();
  const { currentCenter } = useSelector((state) => state.doctorInfo);

  let merchantType = 3;
  let isExists = null;

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToFavouriteList(currentCenter, merchantType);
  };

  useEffect(() => {
    isExists = isAddedToFavouriteList(currentCenter?._id, merchantType);
    setIsFavoriteAdded(isExists);
  }, [currentCenter, handleAddToFavorite]);

  return (
    <div className="relative m-4 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
        <div className="relative h-48 md:h-64 lg:h-72 rounded-lg overflow-hidden">
          <Image
            src={
              currentCenter?.medical_center_banner_app
                ? `${HEALTH_CARE_IMAGES}/${currentCenter?.medical_center_banner_app}`
                : "/png/dummyImage.png"
            }
            alt={currentCenter?.center_name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center space-y-3">
          <h3 className="text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-[#A93356]">
            {currentCenter?.center_name}
          </h3>

          <p className="flex items-start gap-2 text-sm md:text-base lg:text-lg text-gray-600">
            <span>
              <FaLocationDot className="text-primary mt-1" />
            </span>
            <span className="line-clamp-3">{currentCenter?.address}</span>
          </p>

          {[1, 2, 3].map((index) => {
            const contact = currentCenter?.[`apointment_contact_${index}`];
            return (
              contact && (
                <p
                  key={index}
                  className="flex items-center gap-2 text-sm md:text-base lg:text-lg text-primary"
                >
                  <span>
                    <IoCall className="text-primary" />
                  </span>
                  <span>{contact}</span>
                </p>
              )
            );
          })}
        </div>
      </div>

      {!isFavoriteAdded && (
        <button
          onClick={handleAddToFavorite}
          className="absolute top-5 right-5 md:top-8 md:right-6 text-deepGray bg-primaryBg opacity-80 hover:text-primaryFood border hover:border-primaryFood rounded-full hover:bg-white px-1 pe-2 flex justify-center items-center"
        >
          <FaHeart className="size-7 p-1 text-xl rounded-full text-primaryFood" />
          <span className="text-xs font-medium">Add to Favorite</span>
        </button>
      )}

      {isFavoriteAdded && (
        <button className="absolute top-5 right-5 md:top-8 md:right-6 opacity-65 rounded-full flex justify-center items-center">
          <FaHeart className="size-7 p-1 text-xl rounded-full text-primaryFood" />
        </button>
      )}
    </div>
  );
};

export default ExploreConsultationCenterInfo;
