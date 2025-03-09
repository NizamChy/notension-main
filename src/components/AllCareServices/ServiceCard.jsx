"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { SERVICE_BANNER_IMAGES } from "@/api-endpoints/api-endpoint";
import { useAllCareService } from "@/hooks/fetch-data/useAllCareService";

const ServiceCard = ({ service, imageKey, imageWidth, imageHeight }) => {
  const [pageNo, setPageNo] = useState(1);
  const [popularInfo, setPopularInfo] = useState([]);
  const [nearestInfo, setNearestInfo] = useState([]);

  const { exploreCareProvider } = useAllCareService();

  const handleServiceClick = () => {
    console.log("service : ", service);

    const serviceId = service?._id;

    exploreCareProvider(serviceId, setPopularInfo, setNearestInfo, pageNo);
  };

  return (
    <>
      <Link href={`/all-care-services/service/${service?._id}`}>
        <div
          className="lg:m-3 cursor-pointer"
          //   onClick={handleServiceClick}
        >
          <Image
            className="rounded-md shadow-lg"
            src={`${SERVICE_BANNER_IMAGES}/${service?.[imageKey]}`}
            alt={service?.service_name_eng}
            width={imageWidth}
            height={imageHeight}
          />
        </div>
      </Link>
    </>
  );
};

export default ServiceCard;
