"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { handleAllCareReducer } from "@/redux/allCareReducer";
import { SERVICE_PROVIDER_IMAGES } from "@/api-endpoints/api-endpoint";

const NearestInfoCard = ({ provider }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleProviderClick = () => {
    dispatch(
      handleAllCareReducer({
        type: "SAVE_CURRENT_PROVIDER_DETAILS",
        data: provider,
      })
    );

    router.push("/all-care-services/provider-details");
  };

  return (
    <div
      onClick={handleProviderClick}
      className="group card bg-white shadow-md cursor-pointer rounded-lg mb-4 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={`${SERVICE_PROVIDER_IMAGES}/${provider?.provider_banner_app}`}
          alt={`${provider?.provider_name} banner`}
          width={500}
          height={300}
          className="w-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h2 className="md:text-xl font-semibold mb-2 text-deepGray">
          {provider?.provider_name}
        </h2>
        <p className="text-sm md:text-base text-gray-700 mb-2 flex gap-1">
          <span className="text-blue-600 mt-1">
            <FaLocationDot />
          </span>
          {provider?.address}
        </p>

        {provider?.distance && (
          <p className="text-xs md:text-base text-primary ps-4">
            Distance: {(provider?.distance / 1000).toFixed(2)} km
          </p>
        )}
      </div>
    </div>
  );
};

export default NearestInfoCard;
