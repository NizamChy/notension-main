"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { BsTelephone } from "react-icons/bs";
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
      router.push("/medicine/all");
    } else if (type === "food") {
      router.push("/food");
    } else if (type === "allCareServices") {
      router.push("/all-care-services");
    }
  };

  return (
    <>
      <div className="space-y-4 flex flex-col-reverse lg:flex-col">
        <div
          onClick={(e) => handleStoreClick(e, "allCareServices")}
          className="group overflow-hidden relative mt-4 lg:mt-0 cursor-pointer"
        >
          <Image
            width={632}
            height={300}
            className="transition-transform duration-300 group-hover:scale-105"
            src="/images/home/all-care-services.jpg"
            alt="home-banner-2"
          />

          <div className="absolute bottom-16 left-3 md:bottom-10 md:left-4">
            <h3
              className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
            >
              All Care Services
            </h3>
            <p className="flex items-center gap-1 text-xs md:text-base tracking-wider font-semibold text-gray-500">
              <span>
                <BsTelephone className="text-xs md:text-sm text-mediumGray" />
              </span>
              <span>Contact Now</span>
            </p>
          </div>
        </div>

        <div className="flex justify-center lg:gap-4">
          <div
            onClick={(e) => handleStoreClick(e, "medicine")}
            className="group overflow-hidden relative cursor-pointer"
          >
            <Image
              width={308}
              height={470}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/medicine-shop.jpg"
              alt="home-banner-4"
            />

            <div className="absolute bottom-4 left-4 md:bottom-10 md:left-8">
              <h3
                className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
              >
                Medicine Store
              </h3>
              <p className="flex items-center gap-2 text-xs md:text-base tracking-wider font-semibold text-gray-500">
                <span>
                  <MdOutlineShoppingBag className="text-sm md:text-lg text-mediumGray" />
                </span>
                <span>Shop Now</span>
              </p>
            </div>
          </div>

          <div
            onClick={(e) => handleStoreClick(e, "food")}
            className="group overflow-hidden relative cursor-pointer"
          >
            <Image
              width={308}
              height={470}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/home-banner-5.webp"
              alt="home-banner-5"
            />

            <div className="absolute bottom-4 left-4 md:bottom-10 md:left-8">
              <h3
                className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
              >
                Find Restaurant
              </h3>
              <p className="flex items-center gap-2 text-xs md:text-base tracking-wider font-semibold text-gray-500">
                <span>
                  <IoFastFoodOutline className="text-sm md:text-lg text-mediumGray" />
                </span>
                <span>Order Now</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {openMapModal && (
        <MapModal isOpen={openMapModal} onCloseModal={handleCloseMapModal} />
      )}
    </>
  );
};

export default TopRightSection;
