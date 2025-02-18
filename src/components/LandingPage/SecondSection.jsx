"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { BsTelephone } from "react-icons/bs";
import MapModal from "../shared/LocationModal/MapModal";
import LoginModalDetails from "../Cart/LoginModalDetails";
import CommonModal from "../shared/CommonModal/CommonModal";

const SecondSection = () => {
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

    if (type === "eyeCareCenter") {
      router.push("/medical-services/eye-care-center");
    } else if (type === "dentalCareCenter") {
      router.push("/medical-services/dental-care-center");
    } else if (type === "hospital") {
      router.push("/medical-services/hospital");
    } else if (type === "diagnostic") {
      router.push("/medical-services/diagnostic");
    }
  };

  return (
    <>
      <div className="lg:flex gap-4 space-y-4">
        <div className="flex justify-center lg:gap-4 mt-4">
          <div
            onClick={(e) => handleSectionClick(e, "eyeCareCenter")}
            className="group overflow-hidden relative cursor-pointer"
          >
            <Image
              width={308}
              height={303}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/find-eye-care.jpg"
              alt="find-eye-care.jpg"
            />

            <div className="absolute bottom-2 left-3 md:bottom-5 md:left-8">
              <h3
                className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
              >
                Find Eye Care Center
              </h3>
              <p className="flex items-center gap-1 text-xs md:text-base tracking-wider font-semibold text-gray-500">
                <span>
                  <BsTelephone className="text-xs md:text-sm text-mediumGray" />
                </span>
                <span>Contact Now</span>
              </p>
            </div>
          </div>

          <div
            onClick={(e) => handleSectionClick(e, "dentalCareCenter")}
            className="group overflow-hidden relative cursor-pointer"
          >
            <Image
              width={308}
              height={303}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/find-dental-care.jpg"
              alt="find-dental-care.jpg"
            />

            <div className="absolute bottom-2 left-3 md:bottom-5 md:left-8">
              <h3
                className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
              >
                Find Dental Care Center
              </h3>
              <p className="flex items-center gap-1 text-xs md:text-base tracking-wider font-semibold text-gray-500">
                <span>
                  <BsTelephone className="text-xs md:text-sm text-mediumGray" />
                </span>
                <span>Contact Now</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center lg:gap-4 mt-4">
          <div
            onClick={(e) => handleSectionClick(e, "hospital")}
            className="group overflow-hidden relative cursor-pointer"
          >
            <Image
              width={308}
              height={302}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/home-banner-6.webp"
              alt="home-banner-6"
            />

            <div className="absolute bottom-2 left-3 md:bottom-5 md:left-8">
              <h3 className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500">
                Find Hospital
              </h3>
              <p className="flex items-center gap-1 text-xs md:text-base tracking-wider font-semibold text-gray-500">
                <span>
                  <BsTelephone className="text-xs md:text-sm text-mediumGray" />
                </span>
                <span>Contact Now</span>
              </p>
            </div>
          </div>

          <div
            onClick={(e) => handleSectionClick(e, "diagnostic")}
            className="group overflow-hidden relative cursor-pointer"
          >
            <Image
              width={308}
              height={302}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/home-banner-8.webp"
              alt="home-banner-8"
            />

            <div className="absolute bottom-2 left-3 md:bottom-5 md:left-8">
              <h3 className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500">
                Find Diagnostic
              </h3>
              <p className="flex items-center gap-1 text-xs md:text-base tracking-wider font-semibold text-gray-500">
                <span>
                  <BsTelephone className="text-xs md:text-sm text-mediumGray" />
                </span>
                <span>Contact Now</span>
              </p>
            </div>
          </div>
        </div>
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

export default SecondSection;
