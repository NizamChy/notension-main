"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { IoTrashOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { handleDoctorReducer } from "@/redux/doctorReducer";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";
import { useFavouriteList } from "@/hooks/fetch-data/favorite-list";

const FavoriteConsultationCenter = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { removeFromfavoriteList } = useFavouriteList();

  const favouriteConsultationCentre = useSelector(
    (state) => state.userChoice.favouriteConsultationCentre
  );

  let merchantType = 3;

  const handleMedicalCenterClick = (e, center) => {
    e.preventDefault();
    e.stopPropagation();

    const centerInfo = {
      _id: center?.mongodbId,
      address: center?.address,
      center_name: center?.center_name,
      center_type: "Consultation Center",
      medical_center_banner_app: center?.medical_center_banner_app,
    };

    dispatch(
      handleDoctorReducer({
        type: "SAVE_CENTER_INFO",
        data: centerInfo,
      })
    );

    router.push(
      `/medical-services/doctor/consultation-center/visit/${center?.mongodbId}`
    );
  };

  const handleRemoveFromFavorite = (event, center) => {
    event.preventDefault();
    event.stopPropagation();

    removeFromfavoriteList(center, merchantType);
  };

  return (
    <div className="container pt-20">
      <div>
        {favouriteConsultationCentre?.length > 0 && (
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold md:mt-3 mb-5 text-deepGray">
            Favourite Consultation Center
          </h1>
        )}

        {favouriteConsultationCentre?.length < 1 && (
          <p className="text-center text-deepGray">
            No Favourite Consultation Center added.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {favouriteConsultationCentre?.map((center) => (
            <div
              key={center?.mongodbId}
              onClick={(e) => handleMedicalCenterClick(e, center)}
              className="relative bg-white border rounded-lg shadow-md overflow-hidden cursor-pointer"
            >
              <div className="relative w-full">
                <Image
                  src={
                    center?.medical_center_banner_app
                      ? `${HEALTH_CARE_IMAGES}/${center?.medical_center_banner_app}`
                      : "/png/dummyImage.png"
                  }
                  width={390}
                  height={190}
                  alt={center?.center_name}
                  className="rounded-t-lg object-cover w-full h-48"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm md:text-base lg:text-lg font-semibold text-[#A93356] mb-2">
                  {center?.center_name}
                </h3>
                <p className="flex gap-1 items-start text-xs md:text-sm text-mediumGray">
                  <span>
                    <FaLocationDot className="text-primary mt-1" />
                  </span>
                  <span className="line-clamp-4">{center?.address}</span>
                </p>

                {center?.distance && (
                  <p className="text-xs pt-1 font-medium md:text-sm text-secondary">
                    Distance: {(center?.distance / 1000).toFixed(2)} km
                  </p>
                )}
              </div>

              <button
                onClick={(e) => handleRemoveFromFavorite(e, center)}
                className="absolute bg-primaryBg top-3 right-2 md:right-4 text-deepGray opacity-75 hover:text-primaryFood rounded-full hover:bg-white flex justify-center items-center"
              >
                <IoTrashOutline className="size-7 p-1 text-xl rounded-full text-primaryFood" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavoriteConsultationCenter;
