"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { IoTrashOutline } from "react-icons/io5";
import { useFavouriteList } from "@/hooks/fetch-data/favorite-list";
import DoctorCardView from "../DoctorCard/DoctorCardView";
import {
  MedicalCardGrid,
  MedicalContainer,
} from "../../Layout/MedicalLayout";

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
    <MedicalContainer className="pt-20 md:pt-24 pb-8">
      {favouriteDoctors?.length > 0 && (
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 md:mb-6 text-deepGray">
          Favourite Doctor
        </h1>
      )}

      {favouriteDoctors?.length < 1 && (
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <Image
            className="max-w-xl w-full h-auto"
            src="/images/favorite/fav-doctor-not-found.jpg"
            alt="favourite-doctor-not-found"
            width={1867}
            height={1179}
          />
        </div>
      )}

      <MedicalCardGrid>
        {favouriteDoctors?.map((doctor) => (
          <DoctorCardView
            key={doctor?.mongodbId}
            onClick={(e) => handleDoctorClick(e, doctor)}
            name={doctor?.doctor_name}
            gender={doctor?.gender}
            speciality={doctor?.speciality}
            qualifications={doctor?.qualifications}
          >
            <button
              type="button"
              aria-label="Remove from favourite"
              onClick={(e) => handleRemoveFromFavorite(e, doctor)}
              className="absolute top-2 right-2 flex items-center justify-center rounded-full bg-white/90 p-1 text-primaryFood shadow-sm hover:bg-primaryBg"
            >
              <IoTrashOutline className="size-5" />
            </button>
          </DoctorCardView>
        ))}
      </MedicalCardGrid>
    </MedicalContainer>
  );
};

export default FavoriteDoctor;
