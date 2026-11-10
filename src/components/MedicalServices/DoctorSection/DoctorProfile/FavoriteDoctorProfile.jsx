"use client";

import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import { handleDoctorReducer } from "@/redux/doctorReducer";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import DoctorProfileView from "./DoctorProfileView";

const FavoriteDoctorProfile = () => {
  const [profileInfo, setProfileInfo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getProfileOfDoctor, progressing } = useDoctor();

  const router = useRouter();
  const params = useParams();

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);

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
  }, []);

  return (
    <>
      {progressing ? (
        <Loader />
      ) : (
        <DoctorProfileView
          doctorInfo={profileInfo[0]?.doctorInfo}
          chambers={profileInfo}
          canBook={(profile) => !!profile?.book_an_appointment}
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
