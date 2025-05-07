"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import MapModal from "../shared/LocationModal/MapModal";
import LoginModalDetails from "../LoginSection/LoginModalDetails";
import CommonModal from "../shared/CommonModal/CommonModal";
import { LuCalendarDays, LuShoppingCart } from "react-icons/lu";

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
      return;
    }

    if (!userInfo?._id) {
      return openModal();
    }

    if (type === "doctor") {
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
      <div className="space-y-4">
        <div
          onClick={(e) => handleStoreClick(e, "grocery")}
          className="group overflow-hidden relative cursor-pointer"
        >
          <Image
            width={632}
            height={463}
            className="transition-transform duration-300 group-hover:scale-105"
            src="/images/home/home-banner-1.webp"
            alt="home-banner-1"
          />

          <div className="absolute bottom-10 left-4 md:bottom-10 md:left-8">
            <h3
              className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
            >
              Grocery Store
            </h3>
            <p className="flex items-center gap-2 text-xs md:text-base tracking-wider font-semibold text-gray-500">
              <span>
                <LuShoppingCart className="text-sm md:text-lg text-mediumGray" />
              </span>
              <span>Shop Now</span>
            </p>
          </div>
        </div>

        <div
          onClick={(e) => handleSectionClick(e, "doctor")}
          className="group overflow-hidden relative cursor-pointer"
        >
          <Image
            width={632}
            height={300}
            className="transition-transform duration-300 group-hover:scale-105"
            src="/images/home/home-banner-3.webp"
            alt="home-banner-3"
          />

          <div className="absolute bottom-5 left-3 md:bottom-10 md:left-8">
            <h3
              className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
            >
              Find Doctors
            </h3>
            <p className="flex items-center gap-2 text-xs md:text-base tracking-wider font-semibold text-gray-500">
              <span>
                <LuCalendarDays className="text-sm md:text-lg text-mediumGray" />
              </span>
              <span>Book Appointment</span>
            </p>
          </div>
        </div>
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
