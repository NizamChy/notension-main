"use client";
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";

const LocationButton = ({ onOpenModal }) => {
  const router = useRouter();

  const currentUserLocation = useSelector(
    (state) => state.user.currentUserLocation.districtName
  );

  const handleMobileLocation = () => {
    router.push("/get-mobile-location");
  };

  return (
    <>
      <button
        onClick={onOpenModal}
        className="px-5 py-3 text-xl text-white font-medium w-full justify-center items-center gap-1 shadow-md bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition duration-300 hidden md:flex"
      >
        <span>
          <FaLocationDot />
        </span>
        <span>Select Location</span>
        {currentUserLocation && (
          <span className="flex items-center gap-1">
            : {currentUserLocation} <IoIosArrowDown />
          </span>
        )}
      </button>

      <button
        onClick={handleMobileLocation}
        className="px-5 py-3 text-xl text-white font-medium w-full justify-center items-center gap-1 shadow-md bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition duration-300 md:hidden flex"
      >
        <span>
          <FaLocationDot />
        </span>
        <span>Select Location</span>
        {currentUserLocation && (
          <span className="flex items-center gap-1">
            : {currentUserLocation} <IoIosArrowDown />
          </span>
        )}
      </button>
    </>
  );
};

export default LocationButton;
