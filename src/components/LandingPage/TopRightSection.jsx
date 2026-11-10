"use client";

import HomeBannerCard from "./HomeBannerCard";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { LuCalendarDays, LuShoppingCart } from "react-icons/lu";
import { IoFastFoodOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import MapModal from "../shared/LocationModal/MapModal";

const TopRightSection = () => {
  const [openMapModal, setOpenMapModal] = useState(false);

  const router = useRouter();

  const currentUserLocation = useSelector(
    (state) => state.user.currentUserLocation
  );

  const handleOpenMapModal = () => setOpenMapModal(true);
  const handleCloseMapModal = () => setOpenMapModal(false);

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

    if (type === "medicine") {
      router.push("/medicine/home");
    } else if (type === "food") {
      router.push("/food");
    } else if (type === "fashionLifestyle") {
      router.push("/fashion-lifestyle");
    } else if (type === "doctor") {
      router.push("/medical-services/doctor");
    }
  };

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-col gap-3 md:gap-4">
        <HomeBannerCard
          onClick={(e) => handleStoreClick(e, "doctor")}
          className="lg:hidden"
          width={632}
          height={300}
          image="/images/home/home-banner-3.webp"
          alt="home-banner-3"
          title="Find Doctors"
          actionText="Book Appointment"
          ActionIcon={LuCalendarDays}
        />

        <HomeBannerCard
          onClick={(e) => handleStoreClick(e, "fashionLifestyle")}
          position="top"
          width={632}
          height={300}
          image="/images/home/fashion-lifestyle-banner.jpeg"
          alt="fashion-lifestyle-banner1"
          title="Fashion & Lifestyle"
          actionText="Shop Now"
          ActionIcon={LuShoppingCart}
        />

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <HomeBannerCard
            onClick={(e) => handleStoreClick(e, "medicine")}
            size="sm"
            width={308}
            height={470}
            image="/images/home/medicine-shop.jpg"
            alt="home-banner-4"
            title="Medicine Store"
            actionText="Shop Now"
            ActionIcon={MdOutlineShoppingBag}
          />

          <HomeBannerCard
            onClick={(e) => handleStoreClick(e, "food")}
            size="sm"
            width={308}
            height={470}
            image="/images/home/home-banner-5-6.jpg"
            alt="home-banner-5"
            title="Food Store"
            actionText="Order Now"
            ActionIcon={IoFastFoodOutline}
          />
        </div>
      </div>

      {openMapModal && (
        <MapModal isOpen={openMapModal} onCloseModal={handleCloseMapModal} />
      )}
    </>
  );
};

export default TopRightSection;

// "use client";

// const TopRightSection = () => {
//   const [openMapModal, setOpenMapModal] = useState(false);

//   const router = useRouter();

//   const currentUserLocation = useSelector(
//     (state) => state.user.currentUserLocation
//   );

//   const handleOpenMapModal = () => setOpenMapModal(true);
//   const handleCloseMapModal = () => setOpenMapModal(false);

//   const handleStoreClick = (e, type) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const isMobileDevice = window.innerWidth < 768;

// export default TopRightSection;
