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
import DoctorNotFound from "./DoctorNotFound";

const VisitedDoctorProfile = () => {
  // null until the profile request has finished.
  const [profileInfo, setProfileInfo] = useState(null);
  // What the login modal was opened for: "appointment" or "favourite".
  const [loginType, setLoginType] = useState(null);

  const { getProfileOfDoctor, progressing } = useDoctor();
  const { addToFavouriteList, isAddedToFavouriteList } = useFavouriteList();

  const userInfo = useSelector((state) => state.user.userInfo);

  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const centerId = params?.id || null;
  const doctorId = params?.doctorId || null;

  const merchantType = 4;

  const isModalOpen = !!loginType;
  const closeModal = () => setLoginType(null);

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userInfo?._id) return setLoginType("favourite");

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
      return setLoginType("appointment");
    } else {
      router.push("/medical-services/doctor/book-appointment");
    }
  };

  const visitedDoctor =
    centerId !== "null"
      ? profileInfo?.find(
          (profile) => profile?.consultationCenterInfo?._id === centerId
        )
      : profileInfo?.[0];

  const isFavoriteAdded =
    !!visitedDoctor &&
    isAddedToFavouriteList(visitedDoctor?.doctorInfo?._id, merchantType);

  useEffect(() => {
    getProfileOfDoctor(doctorId, setProfileInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the page remounts for another doctor
  }, []);

  if (progressing || !profileInfo) return <Loader />;
  if (!visitedDoctor?.doctorInfo) return <DoctorNotFound />;

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
          <LoginModalDetails onClose={closeModal} type={loginType} />
        </CommonModal>
      )}
    </>
  );
};

export default VisitedDoctorProfile;
