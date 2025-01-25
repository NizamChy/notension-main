"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";
import { useServiceProvider } from "@/hooks/fetch-data/useServiceProvider";
import DoctorCommonSlider from "../DoctorSection/DoctorCommonSlider/DoctorCommonSlider";

const MedicalService = () => {
  const [slider, setSlider] = useState([]);
  const [providerBanner, setProviderBanner] = useState([]);
  const [medicalServices, setMedicalServices] = useState([]);

  const { exploreMedicalServiceProvider } = useServiceProvider();

  useEffect(() => {
    exploreMedicalServiceProvider(setProviderBanner);
  }, []);

  useEffect(() => {
    if (providerBanner && providerBanner?.length > 1) {
      setSlider(providerBanner?.slice(0, providerBanner?.length - 4));
      setMedicalServices(providerBanner?.slice(4, providerBanner?.length));
    }
  }, [providerBanner]);

  return (
    <div className="min-h-content pt-16 md:pt-20">
      <div className="flex justify-center">
        <div className="w-full lg:w-1/2 p-4 lg:p-10">
          <DoctorCommonSlider slider={slider} />
        </div>
      </div>

      <div className="flex justify-center items-center px-4 lg:px-20 xl:px-28 py-5 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-10">
          {medicalServices?.map((service) => (
            <div key={service?._id}>
              <Image
                src={`${HEALTH_CARE_IMAGES}/${service?.file_name}`}
                alt="find-medical-service"
                width={384}
                height={384}
                className="rounded-lg w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalService;
