"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { FaMapMarkerAlt, FaPhone, FaWhatsapp } from "react-icons/fa";
import { SERVICE_PROVIDER_IMAGES } from "@/api-endpoints/api-endpoint";

const ServiceProviderDetails = () => {
  const { currentProviderDetails } = useSelector((state) => state.allCare);

  console.log("currentProviderDetails : ", currentProviderDetails);

  return (
    <div>
      <div className="mx-auto p-4 max-w-4xl gap-5">
        <div className="p-6">
          <Image
            src={`${SERVICE_PROVIDER_IMAGES}/${currentProviderDetails?.provider_banner_app}`}
            alt={`${currentProviderDetails?.provider_name} banner`}
            width={864}
            height={432}
            className="w-full rounded-lg"
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-semibold">
            {currentProviderDetails?.provider_name}
          </h2>
          <p className="flex items-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-primary" />
            {currentProviderDetails?.address}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-semibold">যোগাযোগ</h2>
          <p className="flex items-center gap-2 text-gray-700 mt-2">
            <CgProfile className="text-primary" />
            {currentProviderDetails?.contact_person_name}
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <FaPhone className="text-primary" />
            {currentProviderDetails?.alternative_contact_no}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-semibold">যোগাযোগ</h2>
          <p className="flex items-center gap-2 text-gray-700">
            <FaPhone className="text-primary" />
            {currentProviderDetails?.contact_no}
          </p>
          <p className="flex items-center gap-2 text-gray-700 mt-2">
            <FaWhatsapp className="text-primary" />
            {currentProviderDetails?.contact_no}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-semibold">পরিসেবার বিবরণ</h2>

          <p>{currentProviderDetails?.service_details}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDetails;
