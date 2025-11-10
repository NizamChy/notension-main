"use client";

import Image from "next/image";
import HomeSlider from "./HomeSlider";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { BsTelephone } from "react-icons/bs";
import MapModal from "../shared/LocationModal/MapModal";
import CommonModal from "../shared/CommonModal/CommonModal";
import LoginModalDetails from "../LoginSection/LoginModalDetails";

const MiddleSection = () => {
  const [routeType, setRouteType] = useState("");
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

    setRouteType(type);

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

    if (type === "medicalService") {
      router.push("/medical-services/medical-service");
    }
  };

  return (
    <>
      <div className="lg:flex gap-4">
        <div
          onClick={(e) => handleSectionClick(e, "medicalService")}
          className="group overflow-hidden relative mb-4 lg:mb-0 cursor-pointer"
        >
          <Image
            width={632}
            height={300}
            className="w-full transition-transform duration-300 group-hover:scale-105"
            src="/images/home/find-medical-services.jpg"
            alt="find-medical-services.jpg"
          />

          <div className="absolute bottom-3 left-4 md:bottom-10 md:left-8">
            <h3
              className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
            >
              Find Medical Services
            </h3>
            <p className="flex items-center gap-1 text-xs md:text-base tracking-wider font-semibold text-gray-500">
              <span>
                <BsTelephone className="text-xs md:text-sm text-mediumGray" />
              </span>
              <span>Contact Now</span>
            </p>
          </div>
        </div>

        <HomeSlider />
      </div>

      {isModalOpen && routeType && (
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <LoginModalDetails onClose={closeModal} type={routeType} />
        </CommonModal>
      )}

      {openMapModal && (
        <MapModal isOpen={openMapModal} onCloseModal={handleCloseMapModal} />
      )}
    </>
  );
};

export default MiddleSection;
