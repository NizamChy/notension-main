"use client";

import { useSelector } from "react-redux";
import { FaLocationDot } from "react-icons/fa6";

const LocationButton = ({ onOpenModal }) => {
  const currentUserLocation = useSelector(
    (state) => state.user.currentUserLocation.districtName
  );

  return (
    <>
      <button
        onClick={onOpenModal}
        className="text-primary font-medium w-full justify-center items-center gap-1 bg-white rounded-lg hidden md:flex"
      >
        <span>
          <FaLocationDot className="text-primary" />
        </span>
        {!currentUserLocation && <span>Select Location</span>}

        {currentUserLocation && (
          <span className="flex items-center gap-1">{currentUserLocation}</span>
        )}
      </button>
    </>
  );
};

export default LocationButton;
