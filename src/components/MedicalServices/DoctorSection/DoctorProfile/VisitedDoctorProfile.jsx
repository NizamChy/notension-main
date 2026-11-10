"use client";

import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import { handleDoctorReducer } from "@/redux/doctorReducer";
import { useFavouriteList } from "@/hooks/fetch-data/favorite-list";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import DoctorProfileView from "./DoctorProfileView";

const VisitedDoctorProfile = () => {
  const [profileInfo, setProfileInfo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { getProfileOfDoctor, progressing } = useDoctor();
  const { addToFavouriteList, isAddedToFavouriteList } = useFavouriteList();

  const userInfo = useSelector((state) => state.user.userInfo);

  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const centerId = params?.id || null;
  const doctorId = params?.doctorId || null;

  let isExists = null;
  let merchantType = 4;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToFavouriteList(visitedDoctor?.doctorInfo, merchantType);
  };

  const handleBookAppointment = () => {
    dispatch(
      handleDoctorReducer({
        type: "SAVE_CURRENT_DOCTOR_INFO",
        data: visitedDoctor,
      })
    );

    if (!userInfo?._id) {
      return openModal();
    } else {
      router.push("/medical-services/doctor/book-appointment");
    }
  };

  const visitedDoctor =
    centerId !== "null"
      ? profileInfo?.find(
          (profile) => profile?.consultationCenterInfo?._id === centerId
        )
      : profileInfo[0];

  useEffect(() => {
    getProfileOfDoctor(doctorId, setProfileInfo);
  }, []);

  useEffect(() => {
    if (visitedDoctor) {
      isExists = isAddedToFavouriteList(
        visitedDoctor?.doctorInfo?._id,
        merchantType
      );
      setIsFavoriteAdded(isExists);
    }
  }, [visitedDoctor, handleAddToFavorite]);

  if (progressing) return <Loader />;
  if (!visitedDoctor) return null;

  return (
    <>
      <DoctorProfileView
        doctorInfo={visitedDoctor?.doctorInfo}
        chambers={[visitedDoctor]}
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

export default VisitedDoctorProfile;
