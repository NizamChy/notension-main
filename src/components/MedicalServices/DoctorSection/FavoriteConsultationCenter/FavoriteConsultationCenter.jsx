"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoTrashOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { handleDoctorReducer } from "@/redux/doctorReducer";
import { useFavouriteList } from "@/hooks/fetch-data/favorite-list";
import MedicalCenterCard from "../../MedicalCenterCard/MedicalCenterCard";
import {
  MedicalCardGrid,
  MedicalContainer,
} from "../../Layout/MedicalLayout";

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
    <MedicalContainer className="pt-20 md:pt-24 pb-8">
      <div>
        {favouriteConsultationCentre?.length > 0 && (
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 md:mb-6 text-deepGray">
            Favourite Consultation Center
          </h1>
        )}

        {favouriteConsultationCentre?.length < 1 && (
          <div className="flex flex-col justify-center items-center min-h-[60vh]">
            <Image
              className="max-w-xl w-full h-auto"
              src="/images/favorite/fav-consultation-not-found.jpg"
              alt="favourite-consultation-not-found"
              width={1867}
              height={1179}
            />
          </div>
        )}

        <MedicalCardGrid className="xl:grid-cols-4">
          {favouriteConsultationCentre?.map((center) => (
            <MedicalCenterCard
              key={center?.mongodbId}
              center={center}
              onClick={(e) => handleMedicalCenterClick(e, center)}
            >
              <button
                type="button"
                aria-label="Remove from favourite"
                onClick={(e) => handleRemoveFromFavorite(e, center)}
                className="absolute top-2 right-2 flex items-center justify-center rounded-full bg-white/90 p-1 text-primaryFood shadow-sm hover:bg-primaryBg"
              >
                <IoTrashOutline className="size-5" />
              </button>
            </MedicalCenterCard>
          ))}
        </MedicalCardGrid>
      </div>
    </MedicalContainer>
  );
};

export default FavoriteConsultationCenter;
