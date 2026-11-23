"use client";

import { useSessionStore } from "@/stores/sessionStore";
import Loader from "@/components/shared/Loader/Loader";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { bookingPath, useDoctorProfile } from "@/hooks/healthCare/useDoctors";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import DoctorProfileView from "./DoctorProfileView";
import DoctorNotFound from "./DoctorNotFound";

const FavoriteDoctorProfile = () => {
  // The booking page of the chamber the login modal was opened for.
  const [bookingHref, setBookingHref] = useState(null);

  const router = useRouter();
  const params = useParams();

  const userInfo = useSessionStore((s) => s.userInfo);

  const doctorId = params?.id || null;
  const { chambers: profileInfo, isLoading: progressing } = useDoctorProfile(doctorId);

  const isModalOpen = !!bookingHref;
  const closeModal = () => setBookingHref(null);

  const handleBookAppointment = (e, profile) => {
    e.preventDefault();
    e.stopPropagation();

    // The booking page reads the doctor and centre from its URL.
    const href = bookingPath(profile?.doctorInfo?._id, profile?.consultationCenterInfo?._id);
    if (!userInfo?._id) {
      return setBookingHref(href);
    } else {
      router.push(href);
    }
  };

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
          <LoginModalDetails
            onClose={closeModal}
            type="appointment"
            redirectTo={bookingHref}
          />
        </CommonModal>
      )}
    </>
  );
};

export default FavoriteDoctorProfile;
