"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuBuilding2, LuTrash2 } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { handleDoctorReducer } from "@/redux/doctorReducer";
import { useFavouriteList } from "@/hooks/fetch-data/favorite-list";
import {
  EmptyState,
  PageHeader,
  PRIMARY_BUTTON,
} from "@/components/shared/UI/UI";
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
    <MedicalContainer className="pb-12 pt-24 md:pt-28">
      <PageHeader
        title="Favourite consultation centres"
        subtitle={
          favouriteConsultationCentre?.length > 0
            ? `${favouriteConsultationCentre.length} saved ${favouriteConsultationCentre.length === 1 ? "centre" : "centres"}`
            : "Centres you save appear here."
        }
      />

      {favouriteConsultationCentre?.length < 1 && (
        <EmptyState
          icon={<LuBuilding2 />}
          title="No favourite centres yet"
          text="Open a consultation centre and tap “Add to favourites” to save it here."
          action={
            <Link
              href="/medical-services/doctor/consultation-center"
              className={PRIMARY_BUTTON}
            >
              Browse centres
            </Link>
          }
        />
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
              aria-label={`Remove ${center?.center_name || "centre"} from favourites`}
              title="Remove from favourites"
              onClick={(e) => handleRemoveFromFavorite(e, center)}
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFFFF]/95 text-[#344054] shadow-sm transition-colors hover:bg-[#FFFFFF] hover:text-[#D92D20]"
            >
              <LuTrash2 className="text-base" />
            </button>
          </MedicalCenterCard>
        ))}
      </MedicalCardGrid>
    </MedicalContainer>
  );
};

export default FavoriteConsultationCenter;
