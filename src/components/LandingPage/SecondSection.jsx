"use client";

// import Link from "next/link";
import HomeBannerCard from "./HomeBannerCard";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { BsTelephone } from "react-icons/bs";
import MapModal from "../shared/LocationModal/MapModal";
import CommonModal from "../shared/CommonModal/CommonModal";
import LoginModalDetails from "../LoginSection/LoginModalDetails";

const CARDS = [
  {
    type: "eyeCareCenter",
    title: "Find Eye Care Center",
    image: "/images/home/find-eye-care.jpg",
  },
  {
    type: "dentalCareCenter",
    title: "Find Dental Care Center",
    image: "/images/home/find-dental-care.jpg",
  },
  {
    type: "hospital",
    title: "Find Hospital",
    image: "/images/home/home-banner-6.webp",
  },
  {
    type: "diagnostic",
    title: "Find Diagnostic",
    image: "/images/home/home-banner-8.webp",
  },
];

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

    // if (!userInfo?._id) {
    //   return openModal();
    // }

    if (currentUserLocation?.districtId) {
      if (type === "eyeCareCenter") {
        router.push("/medical-services/eye-care-center");
      } else if (type === "dentalCareCenter") {
        router.push("/medical-services/dental-care-center");
      } else if (type === "hospital") {
        router.push("/medical-services/hospital");
      } else if (type === "diagnostic") {
        router.push("/medical-services/diagnostic");
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full">
        {CARDS.map(({ type, title, image }) => (
          <HomeBannerCard
            key={type}
            onClick={(e) => handleSectionClick(e, type)}
            size="sm"
            width={308}
            height={303}
            image={image}
            title={title}
            actionText="Contact Now"
            ActionIcon={BsTelephone}
          />
        ))}
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
