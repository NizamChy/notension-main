"use client";

import Image from "next/image";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";
import { useServiceProvider } from "@/hooks/fetch-data/useServiceProvider";
import DoctorCommonSlider from "../DoctorSection/DoctorCommonSlider/DoctorCommonSlider";
import { MedicalPageBody } from "../Layout/MedicalLayout";

const MedicalService = () => {
  const [slider, setSlider] = useState([]);
  const [providerBanner, setProviderBanner] = useState([]);
  const [medicalServices, setMedicalServices] = useState([]);

  const { exploreMedicalServiceProvider, progressing } = useServiceProvider();

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
    <>
      {progressing ? (
        <Loader />
      ) : (
        <div className="min-h-screen pt-16 md:pt-20 bg-gray-50">
          <MedicalPageBody>
            <DoctorCommonSlider slider={slider} wide />

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {medicalServices?.map((service) => (
                <div
                  key={service?._id}
                  className="group bg-white border border-gray-200 shadow-sm rounded-xl p-2 lg:p-3 hover:shadow-md hover:border-primary transition-all duration-300 cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={`${HEALTH_CARE_IMAGES}/${service?.file_name}`}
                      alt={service?.title || "Medical Service"}
                      fill
                      sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </MedicalPageBody>
        </div>
      )}
    </>
  );
};

export default MedicalService;
