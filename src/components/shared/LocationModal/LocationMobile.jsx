"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { HiChevronRight } from "react-icons/hi";

// Phone-only location bar shown under the navbar.
const LocationMobile = () => {
  const router = useRouter();

  const districtName = useSelector(
    (state) => state.user.currentUserLocation.districtName
  );

  return (
    <button
      type="button"
      onClick={() => router.push("/get-mobile-location")}
      className="flex w-full items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm md:hidden"
    >
      <FaLocationDot className="shrink-0 text-[#EB5C2F]" />
      <span className="text-gray-500">
        {districtName ? "Delivering to" : "Set your location"}
      </span>
      <span className="truncate font-semibold text-gray-900">
        {districtName || "Select district"}
      </span>
      <HiChevronRight className="ml-auto shrink-0 text-gray-400" />
    </button>
  );
};

export default LocationMobile;
