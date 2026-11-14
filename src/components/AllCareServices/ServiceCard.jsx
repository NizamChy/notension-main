"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { MdHomeRepairService } from "react-icons/md";
import { handleAllCareReducer } from "@/redux/allCareReducer";
import { getAllCareServiceIcon } from "@/utils/allCareServiceIcon";

// Service category tile: illustration on a soft tile, name underneath.
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
    <button
      type="button"
      onClick={handleServiceClick}
      className="group flex h-full w-full flex-col items-center rounded-2xl p-1 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F] sm:p-1.5"
    >
      <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-[#FFFFFF] transition duration-300 group-hover:-translate-y-0.5 group-hover:border-gray-300 group-hover:shadow-lg group-hover:shadow-gray-900/5">
        {icon ? (
          <Image
            className="object-contain p-1 transition-transform duration-300 group-hover:scale-105 sm:p-2"
            src={icon}
            alt=""
            fill
            sizes="(min-width: 1024px) 180px, (min-width: 640px) 22vw, 30vw"
          />
        ) : (
          <MdHomeRepairService
            aria-hidden="true"
            className="h-1/2 w-1/2 text-[#0C3F8E]/60"
          />
        )}
      </span>

      <span className="mt-2 line-clamp-2 text-xs font-semibold leading-snug text-gray-800 transition-colors group-hover:text-[#0C3F8E] dark:group-hover:text-[#7FB2FF] sm:text-sm">
        {service?.service_name_eng}
      </span>
    </button>
  );
};

export default ServiceCard;
