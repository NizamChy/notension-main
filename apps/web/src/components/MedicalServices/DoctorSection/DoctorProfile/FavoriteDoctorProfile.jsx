"use client";

import { useSessionStore } from "@/stores/sessionStore";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import { handleDoctorReducer } from "@/redux/doctorReducer";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import DoctorProfileView from "./DoctorProfileView";
import DoctorNotFound from "./DoctorNotFound";

const FavoriteDoctorProfile = () => {
  // null until the profile request has finished.
  const [profileInfo, setProfileInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getProfileOfDoctor, progressing } = useDoctor();

  const router = useRouter();
  const params = useParams();

  const dispatch = useDispatch();
  const userInfo = useSessionStore((s) => s.userInfo);

  const doctorId = params?.id || null;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleBookAppointment = (e, profile) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      handleDoctorReducer({
        type: "SAVE_CURRENT_DOCTOR_INFO",
        data: profile,
      })
    );

    if (!userInfo?._id) {
      return openModal();
    } else {
      router.push("/medical-services/doctor/book-appointment");
    }
  };

  useEffect(() => {
    getProfileOfDoctor(doctorId, setProfileInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the page remounts for another doctor
  }, []);

  return (
    <>
      {progressing || !profileInfo ? (
        <Loader />
      ) : !profileInfo[0]?.doctorInfo ? (
        <DoctorNotFound />
      ) : (
        <DoctorProfileView
          doctorInfo={profileInfo[0]?.doctorInfo}
          chambers={profileInfo}
          canBook={(profile) =>
            !!profile?.book_an_appointment && !profile?.is_chamber_off
          }
          onBook={handleBookAppointment}
        />
      )}

      {isModalOpen && (
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <LoginModalDetails onClose={closeModal} type="appointment" />
        </CommonModal>
      )}
    </>
  );
};

export default FavoriteDoctorProfile;
