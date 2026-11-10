"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { MdHomeRepairService } from "react-icons/md";
import { handleAllCareReducer } from "@/redux/allCareReducer";
import { getAllCareServiceIcon } from "@/utils/allCareServiceIcon";

const ServiceCard = ({ service }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const icon = getAllCareServiceIcon(service);

  const handleServiceClick = () => {
    dispatch(
      handleAllCareReducer({
        type: "SAVE_CURRENT_SERVICE_INFO",
        data: service,
      })
    );

    router.push(`/all-care-services/service/${service?._id}`);
  };

  return (
    <>
      <div
        onClick={handleServiceClick}
        className="h-full rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer text-mediumGray hover:bg-blue-500/10 hover:text-primary bg-white w-full flex flex-col"
      >
        <div className="w-full aspect-square p-2 flex items-center justify-center">
          {icon ? (
            <Image
              className="w-full h-full object-contain"
              src={icon}
              alt={service?.service_name_eng}
              width={200}
              height={200}
            />
          ) : (
            <MdHomeRepairService
              aria-hidden="true"
              className="w-1/2 h-1/2 text-[#0C3F8E]/60"
            />
          )}
        </div>

        <div className="flex-1 flex items-center justify-center pb-3 px-2 md:pb-4">
          <div>
            <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-snug text-center line-clamp-2">
              {service?.service_name_eng}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceCard;
