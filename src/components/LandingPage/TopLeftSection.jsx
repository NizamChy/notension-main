"use client";

import HomeBannerCard from "./HomeBannerCard";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import MapModal from "../shared/LocationModal/MapModal";
import CommonModal from "../shared/CommonModal/CommonModal";
import { LuCalendarDays, LuShoppingCart } from "react-icons/lu";
import LoginModalDetails from "../LoginSection/LoginModalDetails";

const TopLeftSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMapModal, setOpenMapModal] = useState(false);

  const router = useRouter();

  const userInfo = useSelector((state) => state.user.userInfo);
  const currentUserLocation = useSelector(
    (state) => state.user.currentUserLocation
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleOpenMapModal = () => setOpenMapModal(true);
  const handleCloseMapModal = () => setOpenMapModal(false);

  const handleSectionClick = (e, type) => {
    e.preventDefault();
    e.stopPropagation();

    const isMobileDevice = window.innerWidth < 768;

    if (!currentUserLocation?.districtId) {
      if (isMobileDevice) {
        router.push("/get-mobile-location");
      } else {
        handleOpenMapModal();
      }
      // return;
    }

    // if (!userInfo?._id) {
    //   return openModal();
    // }

    if (currentUserLocation?.districtId && type === "doctor") {
      router.push("/medical-services/doctor");
    }
  };

  const handleStoreClick = (e, type) => {
    e.preventDefault();
    e.stopPropagation();

    const isMobileDevice = window.innerWidth < 768;

    if (!currentUserLocation?.districtId) {
      if (isMobileDevice) {
        router.push("/get-mobile-location");
      } else {
        handleOpenMapModal();
      }
      return;
    }

    if (type === "grocery") {
      router.push("/grocery/home");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 md:gap-4">
        <HomeBannerCard
          onClick={(e) => handleStoreClick(e, "grocery")}
          width={632}
          height={463}
          priority
          image="/images/home/home-banner-1.webp"
          alt="home-banner-1"
          title="Grocery Store"
          actionText="Shop Now"
          ActionIcon={LuShoppingCart}
        />

        {/* On desktop this tile stretches so both columns end on the same line */}
        <HomeBannerCard
          onClick={(e) => handleSectionClick(e, "doctor")}
          className="hidden lg:block lg:flex-1"
          fill
          width={632}
          height={300}
          image="/images/home/home-banner-3.webp"
          alt="home-banner-3"
          title="Find Doctors"
          actionText="Book Appointment"
          ActionIcon={LuCalendarDays}
        />
      </div>

      {isModalOpen && (
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <LoginModalDetails onClose={closeModal} type="doctor" />
        </CommonModal>
      )}

      {openMapModal && (
        <MapModal isOpen={openMapModal} onCloseModal={handleCloseMapModal} />
      )}
    </>
  );
};

export default TopLeftSection;
