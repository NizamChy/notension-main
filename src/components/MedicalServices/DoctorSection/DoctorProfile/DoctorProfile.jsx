"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFavouriteList } from "@/hooks/fetch-data/favorite-list";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import DoctorProfileView from "./DoctorProfileView";

const DoctorProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { addToFavouriteList, isAddedToFavouriteList } = useFavouriteList();
  const { currentDoctor } = useSelector((state) => state.doctorInfo);

  let merchantType = 4;
  let isExists = null;

  const userInfo = useSelector((state) => state.user.userInfo);

  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToFavouriteList(currentDoctor?.doctorInfo, merchantType);
  };

  const handleBookAppointment = () => {
    if (!userInfo?._id) {
      return openModal();
    } else {
      router.push("/medical-services/doctor/book-appointment");
    }
  };

  useEffect(() => {
    isExists = isAddedToFavouriteList(
      currentDoctor?.doctorInfo?._id,
      merchantType
    );
    setIsFavoriteAdded(isExists);
  }, [currentDoctor, handleAddToFavorite]);

  return (
    <>
      <DoctorProfileView
        doctorInfo={currentDoctor?.doctorInfo}
        chambers={currentDoctor ? [currentDoctor] : []}
        canBook={(profile) =>
          !!profile?.book_an_appointment && !profile?.is_chamber_off
        }
        onBook={handleBookAppointment}
        favorite={{ isAdded: isFavoriteAdded, onAdd: handleAddToFavorite }}
      />

      {isModalOpen && (
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <LoginModalDetails onClose={closeModal} type="appointment" />
        </CommonModal>
      )}
    </>
  );
};

export default DoctorProfile;
