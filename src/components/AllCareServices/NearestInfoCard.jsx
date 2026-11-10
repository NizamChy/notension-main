"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { FaLocationDot } from "react-icons/fa6";
import { handleAllCareReducer } from "@/redux/allCareReducer";
import { SERVICE_PROVIDER_IMAGES } from "@/api-endpoints/api-endpoint";

const NearestInfoCard = ({ provider }) => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const handleProviderClick = () => {
    dispatch(
      handleAllCareReducer({
        type: "SAVE_CURRENT_PROVIDER_DETAILS",
        data: provider,
      })
    );

    // The ids let the details page load the provider on a direct link.
    router.push(
      `/all-care-services/provider-details?serviceId=${params?.serviceId}&id=${provider?._id}`
    );
  };

  return (
    <div
      onClick={handleProviderClick}
      className="group h-full flex flex-col bg-white border border-gray-100 shadow-sm cursor-pointer rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative aspect-[2/1] overflow-hidden bg-gray-50">
        <Image
          src={`${SERVICE_PROVIDER_IMAGES}/${provider?.provider_banner_app}`}
          alt={`${provider?.provider_name} banner`}
          width={500}
          height={250}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base md:text-lg font-semibold mb-2 text-deepGray line-clamp-1">
          {provider?.provider_name}
        </h3>
        <p className="text-sm text-gray-700 mb-2 flex gap-1.5">
          <FaLocationDot className="shrink-0 text-blue-600 mt-0.5" />
          <span className="line-clamp-2">{provider?.address}</span>
        </p>

        {provider?.distance != null && (
          <p className="mt-auto text-xs md:text-sm text-primary ps-5">
            Distance: {(provider?.distance / 1000).toFixed(2)} km
          </p>
        )}
      </div>
    </div>
  );
};

export default NearestInfoCard;
