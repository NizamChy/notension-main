"use client";

import { useSelector } from "react-redux";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";

const LocationButton = ({ onOpenModal }) => {
  const currentUserLocation = useSelector(
    (state) => state.user.currentUserLocation.districtName
  );

  console.log("location", currentUserLocation);

  return (
    <>
      <button
        onClick={onOpenModal}
        className="px-5 lg:text-xl text-secondary font-medium w-full justify-center items-center gap-1 bg-white rounded-lg hidden md:flex"
      >
        <span>
          <FaLocationDot className="text-primary" />
        </span>
        {!currentUserLocation && <span>Select Location</span>}

        {currentUserLocation && (
          <span className="flex items-center gap-1">
            Current Location: {currentUserLocation} <IoIosArrowDown />
          </span>
        )}
      </button>
    </>
  );
};

export default LocationButton;
