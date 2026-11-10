"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { handleDoctorReducer } from "@/redux/doctorReducer";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";

const MedicalCenterCard = ({ center, onClick, children }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleMedicalCenterClick = () => {
    dispatch(
      handleDoctorReducer({
        type: "SAVE_CENTER_INFO",
        data: center,
      })
    );

    router.push(
      `/medical-services/doctor/consultation-center/visit/${center?._id}`
    );
  };

  return (
    <div
      onClick={onClick || handleMedicalCenterClick}
      className="group relative h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="relative w-full aspect-[2/1] bg-gray-100">
        <Image
          src={
            center?.medical_center_banner_app
              ? `${HEALTH_CARE_IMAGES}/${center?.medical_center_banner_app}`
              : "/png/dummyImage.png"
          }
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
          alt={center?.center_name || "Medical center"}
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm md:text-base lg:text-lg font-semibold text-[#A93356] line-clamp-1">
          {center?.center_name}
        </h3>
        <p className="flex gap-1.5 items-start text-xs md:text-sm text-mediumGray">
          <FaLocationDot className="shrink-0 text-primary mt-0.5" />
          <span className="line-clamp-2">{center?.address}</span>
        </p>

        {center?.distance != null && (
          <p className="mt-auto text-xs font-medium md:text-sm text-secondary">
            Distance: {(center?.distance / 1000).toFixed(2)} km
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

export default MedicalCenterCard;
