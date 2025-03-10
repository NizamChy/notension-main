"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { handleAllCareReducer } from "@/redux/allCareReducer";
import { SERVICE_BANNER_IMAGES } from "@/api-endpoints/api-endpoint";

const ServiceCard = ({ service, imageKey, imageWidth, imageHeight }) => {
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
      <div onClick={handleServiceClick} className="lg:m-3 cursor-pointer">
        <Image
          className="rounded-md shadow-lg"
          src={`${SERVICE_BANNER_IMAGES}/${service?.[imageKey]}`}
          alt={service?.service_name_eng}
          width={imageWidth}
          height={imageHeight}
        />
      </div>
    </>
  );
};

export default ServiceCard;
