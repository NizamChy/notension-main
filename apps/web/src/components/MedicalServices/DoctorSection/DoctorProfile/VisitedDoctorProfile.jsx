"use client";

import { useSessionStore } from "@/stores/sessionStore";
import Loader from "@/components/common/Loader";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { bookingPath, chamberAt, useDoctorProfile } from "@/hooks/healthCare/useDoctors";
import { useFavouriteList } from "@/hooks/fetch-data/favorite-list";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import DoctorProfileView from "./DoctorProfileView";
import DoctorNotFound from "./DoctorNotFound";

const VisitedDoctorProfile = () => {
  // What the login modal was opened for: "appointment" or "favourite".
  const [loginType, setLoginType] = useState(null);

  const { addToFavouriteList, isAddedToFavouriteList } = useFavouriteList();

  const userInfo = useSessionStore((s) => s.userInfo);

  const params = useParams();
  const router = useRouter();

  const centerId = params?.id || null;
  const doctorId = params?.doctorId || null;
  const { chambers: profileInfo, isLoading: progressing } = useDoctorProfile(doctorId);

  const merchantType = 4;

  const isModalOpen = !!loginType;
  const closeModal = () => setLoginType(null);

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userInfo?._id) return setLoginType("favourite");

    addToFavouriteList(visitedDoctor?.doctorInfo, merchantType);
  };

  const visitedDoctor = chamberAt(profileInfo, centerId);
  // The booking page reads the doctor and centre from its URL.
  const bookingHref = bookingPath(
    visitedDoctor?.doctorInfo?._id,
    visitedDoctor?.consultationCenterInfo?._id,
  );

  const handleBookAppointment = () => {
    if (!userInfo?._id) {
      return setLoginType("appointment");
    } else {
      router.push(bookingHref);
    }
  };

  const isFavoriteAdded =
    !!visitedDoctor &&
    isAddedToFavouriteList(visitedDoctor?.doctorInfo?._id, merchantType);

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
          <LoginModalDetails
            onClose={closeModal}
            type={loginType}
            redirectTo={loginType === "appointment" ? bookingHref : undefined}
          />
        </CommonModal>
      )}
    </>
  );
};

export default VisitedDoctorProfile;
