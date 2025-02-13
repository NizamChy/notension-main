"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { IoTrashOutline } from "react-icons/io5";
import { useFavouriteList } from "@/hooks/fetch-data/favorite-list";

const FavoriteDoctor = () => {
  const router = useRouter();
  const { removeFromfavoriteList } = useFavouriteList();

  const favouriteDoctors = useSelector(
    (state) => state.userChoice.favouriteDoctors
  );

  let merchantType = 4;

  const handleDoctorClick = (e, doctor) => {
    e.preventDefault();
    e.stopPropagation();

    router.push(`/medical-services/doctor/profile/${doctor?.mongodbId}`);
  };

  const handleRemoveFromFavorite = (event, doctor) => {
    event.preventDefault();
    event.stopPropagation();

    removeFromfavoriteList(doctor, merchantType);
  };

  return (
    <div className="container pt-20">
      <div>
        {favouriteDoctors?.length > 0 && (
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold md:mt-3 mb-3 text-deepGray">
            Favourite Doctor
          </h1>
        )}

        {favouriteDoctors?.length < 1 && (
          <p className="text-center text-deepGray">
            No Favourite Doctor added.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-5 lg:gap-10 justify-center items-center">
          {favouriteDoctors?.map((doctor) => (
            <div
              key={doctor?.mongodbId}
              onClick={(e) => handleDoctorClick(e, doctor)}
              className="relative bg-white w-full min-h-60 flex flex-col justify-center items-center border rounded-lg shadow-sm cursor-pointer py-3 my-2"
            >
              <div className="flex gap-2 px-3 lg:px-8 justify-center items-center">
                <div className="w-1/3">
                  <Image
                    src={
                      doctor?.gender === "Female"
                        ? "/images/medical-services/doctor-female.png"
                        : "/images/medical-services/doctor-male.png"
                    }
                    alt={doctor?.doctor_name || "Doctor"}
                    width={110}
                    height={140}
                    className="object-cover w-full md:w-[110px] md:h-[140px]"
                  />
                </div>
                <div className="w-2/3 flex flex-col justify-start items-start">
                  <h3 className="mt-3 text-sm md:text-base font-semibold text-[#A93356]">
                    {doctor?.doctor_name}
                  </h3>

                  <div className="mt-1 mb-2">
                    <p className="text-xs md:text-sm line-clamp-4 text-mediumGray">
                      {doctor?.qualifications}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#CCB8F7] mt-3 py-1 w-full">
                <p className="line-clamp-1 w-full text-white font-semibold text-sm md:text-base px-3">
                  {doctor?.speciality}
                </p>
              </div>

              <button
                onClick={(e) => handleRemoveFromFavorite(e, doctor)}
                className="absolute top-3 right-2 md:right-4 text-deepGray opacity-65 hover:text-primaryFood rounded-full hover:bg-white flex justify-center items-center"
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

export default FavoriteDoctor;
