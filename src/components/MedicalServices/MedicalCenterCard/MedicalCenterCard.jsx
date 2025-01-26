import React from "react";
import Image from "next/image";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";

const MedicalCenterCard = ({ center }) => {
  return (
    <div className="bg-white border rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full">
        <Image
          src={
            center?.medical_center_banner_app
              ? `${HEALTH_CARE_IMAGES}/${center?.medical_center_banner_app}`
              : "/png/dummyImage.png"
          }
          width={390}
          height={190}
          alt={center?.center_name}
          className="rounded-t-lg object-cover w-full h-48"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm md:text-base lg:text-lg font-semibold text-[#A93356] mb-2">
          {center?.center_name}
        </h3>
        <p className="text-xs md:text-sm text-mediumGray line-clamp-4">
          {center?.address}
        </p>

        {center?.distance && (
          <p className="text-xs pt-1 font-medium md:text-sm text-secondary">
            Distance: {(center?.distance / 1000).toFixed(2)} km
          </p>
        )}
      </div>
    </div>
  );
};

export default MedicalCenterCard;
