"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { SERVICES } from "@/utils/constant";
import { handleAllCareReducer } from "@/redux/allCareReducer";

const ServiceCard = ({ service, imageKey, imageWidth, imageHeight, index }) => {
  const router = useRouter();
  const dispatch = useDispatch();

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
        className="lg:m-3 rounded-lg shadow-md hover:shadow-lg cursor-pointer text-mediumGray hover:text-primary bg-white w-full flex justify-center"
      >
        <div>
          <Image
            className="mx-auto"
            src={SERVICES[index].image}
            alt={service?.service_name_eng}
            width={200}
            height={200}
          />

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
