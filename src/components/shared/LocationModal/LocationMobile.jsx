"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";

const LocationMobile = () => {
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
        onClick={handleMobileLocation}
        className="px-5 py-3 text-sm md:text-xl text-white font-medium w-full justify-center items-center gap-1 shadow-md bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 transition duration-300 md:hidden flex outline-none"
      >
        {/* bg-[#FC8F1E] hover:bg-[#fb9d3a] transition duration-300 */}
        <span>
          <FaLocationDot />
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

export default LocationMobile;
