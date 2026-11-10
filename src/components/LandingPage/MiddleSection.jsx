"use client";

import HomeBannerCard from "./HomeBannerCard";
// import HomeSlider from "./HomeSlider";
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

  // const handleSectionClick = (e, type) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   setRouteType(type);

  //   const isMobileDevice = window.innerWidth < 768;

  //   // if (!userInfo?._id) {
  //   //   return openModal();
  //   // }

  //   if (type === "medicalService") {
  //     router.push("/medical-services");
  //   }
  // };
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

    if (type === "medicalService") {
      router.push("/medical-services");
    } else if (type === "allCareServices") {
      router.push("/all-care-services");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 w-full">
        <HomeBannerCard
          onClick={(e) => handleSectionClick(e, "medicalService")}
          width={632}
          height={300}
          image="/images/home/find-medical-services.jpg"
          alt="find-medical-services.jpg"
          title="Find Medical Services"
          actionText="Contact Now"
          ActionIcon={BsTelephone}
        />

        <HomeBannerCard
          onClick={(e) => handleSectionClick(e, "allCareServices")}
          width={632}
          height={300}
          image="/images/home/all-care-services.jpg"
          alt="home-banner-2"
          title="All Care Services"
          actionText="Contact Now"
          ActionIcon={BsTelephone}
        />
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
