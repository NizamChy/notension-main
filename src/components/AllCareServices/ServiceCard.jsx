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
        className="lg:m-3 rounded-lg shadow-md hover:shadow-lg cursor-pointer text-mediumGray hover:bg-blue-500/10 hover:text-primary bg-white w-full flex justify-center"
      >
        <div>
          {icon ? (
            <Image
              className="mx-auto"
              src={icon}
              alt={service?.service_name_eng}
              width={200}
              height={200}
            />
          ) : (
            <div className="mx-auto w-[min(200px,100%)] aspect-square flex items-center justify-center">
              <MdHomeRepairService
                aria-hidden="true"
                className="w-1/2 h-1/2 text-[#0C3F8E]/60"
              />
            </div>
          )}

          <div className="pb-3 px-1 md:pb-4 md:px-2">
            <h3 className="text-xs md:text-lg lg:text-xl font-medium mb-2 text-center">
              {service?.service_name_eng}
            </h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceCard;
