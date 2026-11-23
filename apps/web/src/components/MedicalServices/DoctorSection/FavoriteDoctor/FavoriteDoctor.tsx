"use client";

import React, { type MouseEvent } from "react";
import Link from "next/link";
import { useFavouriteEntries, type Favourite } from "@/stores/favouritesStore";
import { useRouter } from "next/navigation";
import { LuHeart, LuTrash2 } from "react-icons/lu";
import { useFavouriteList } from "@/hooks/fetch-data/favorite-list";
import { PRIMARY_BUTTON } from "@/components/shared/UI/UI";
import { EmptyState, PageHeader } from "@/components/StoreModule/legacyViews";
import DoctorCardView from "../DoctorCard/DoctorCardView";
import {
  MedicalCardGrid,
  MedicalContainer,
} from "../../Layout/MedicalLayout";

// The doctor snapshot useFavouriteList saves (see addToFavouriteList).
type FavouriteDoctor = Favourite & {
  mongodbId?: string;
  doctor_name?: string;
  qualifications?: string;
  speciality?: string;
  gender?: string | null;
  profile_pic?: string | null;
};

const FavoriteDoctor = () => {
  const router = useRouter();
  const { removeFromfavoriteList } = useFavouriteList();

  const favouriteDoctors = useFavouriteEntries("list", 4);

  let merchantType = 4;

  const handleDoctorClick = (e: MouseEvent<HTMLElement>, doctor: FavouriteDoctor) => {
    e.preventDefault();
    e.stopPropagation();

    router.push(`/medical-services/doctor/profile/${doctor?.mongodbId}`);
  };

  const handleRemoveFromFavorite = (
    event: MouseEvent<HTMLButtonElement>,
    doctor: FavouriteDoctor,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    removeFromfavoriteList(doctor, merchantType);
  };

  return (
    <MedicalContainer className="pb-12 pt-24 md:pt-28">
      <PageHeader
        title="Favourite doctors"
        subtitle={
          favouriteDoctors?.length > 0
            ? `${favouriteDoctors.length} saved ${favouriteDoctors.length === 1 ? "doctor" : "doctors"}`
            : "Doctors you save appear here for quick booking."
        }
      />

      {favouriteDoctors?.length < 1 && (
        <EmptyState
          icon={<LuHeart />}
          title="No favourite doctors yet"
          text="Tap the heart on a doctor's profile to save them here."
          action={
            <Link href="/medical-services/doctor" className={PRIMARY_BUTTON}>
              Find a doctor
            </Link>
          }
        />
      )}

      <MedicalCardGrid>
        {favouriteDoctors?.map((doctor: FavouriteDoctor) => (
          <DoctorCardView
            key={doctor?.mongodbId}
            onClick={(e) => handleDoctorClick(e, doctor)}
            info={doctor}
            name={doctor?.doctor_name}
            speciality={doctor?.speciality}
            qualifications={doctor?.qualifications}
            ctaLabel="View profile"
            action={
              <button
                type="button"
                aria-label={`Remove ${doctor?.doctor_name || "doctor"} from favourites`}
                title="Remove from favourites"
                onClick={(e) => handleRemoveFromFavorite(e, doctor)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-[#D92D20]/30 hover:bg-[#D92D20]/10 hover:text-[#D92D20]"
              >
                <LuTrash2 className="text-base" />
              </button>
            }
          />
        ))}
      </MedicalCardGrid>
    </MedicalContainer>
  );
};

export default FavoriteDoctor;
