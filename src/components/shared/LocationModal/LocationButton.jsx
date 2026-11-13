"use client";

import { useSelector } from "react-redux";
import { FaLocationDot } from "react-icons/fa6";
import { HiChevronDown } from "react-icons/hi";

const LocationButton = ({ onOpenModal }) => {
  const districtName = useSelector(
    (state) => state.user.currentUserLocation.districtName
  );

  return (
    <button
      type="button"
      onClick={onOpenModal}
      className="group flex items-center gap-2.5 rounded-full border border-gray-200 bg-white py-1.5 pl-2 pr-3 text-left transition-colors hover:border-gray-300 hover:bg-gray-50"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EB5C2F]/10 text-[#EB5C2F]">
        <FaLocationDot className="text-sm" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[11px] text-gray-500">
          {districtName ? "Delivering to" : "Set your location"}
        </span>
        <span className="max-w-[150px] truncate text-sm font-semibold text-gray-900">
          {districtName || "Select district"}
        </span>
      </span>
      <HiChevronDown className="text-gray-400 transition-transform group-hover:translate-y-0.5" />
    </button>
  );
};

export default LocationButton;
