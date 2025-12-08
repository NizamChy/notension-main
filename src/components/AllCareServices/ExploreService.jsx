"use client";

import Loader from "../common/Loader";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import NearestInfoCard from "./NearestInfoCard";
import React, { useEffect, useState } from "react";
import PopularInfoSlider from "./PopularInfoSlider";
import ServiceBannerSlider from "./ServiceBannerSlider";
import { useAllCareService } from "@/hooks/fetch-data/useAllCareService";

const ExploreService = () => {
  const [pageNo, setPageNo] = useState(1);
  const [slider, setSlider] = useState([]);
  const [popularInfo, setPopularInfo] = useState([]);
  const [nearestInfo, setNearestInfo] = useState([]);

  const params = useParams();
  const serviceId = params?.serviceId || null;

  const { exploreCareProvider, progressing } = useAllCareService();
  const { currentService } = useSelector((state) => state.allCare);

  useEffect(() => {
    setSlider(currentService?.sliderInfo?.service_slider);
    exploreCareProvider(serviceId, setPopularInfo, setNearestInfo, pageNo);
  }, []);

  return (
    <div className="p-4 md:py-5">
      <p className="md:text-2xl font-semibold text-[#0C3F8E] bg-gray-50 flex justify-center items-center py-2 mb-5 rounded-lg">
        {currentService?.service_name_eng}
      </p>

      {slider?.length > 0 && (
        <div className="flex justify-center">
          <div className="w-full p-4">
            <div className="rounded-2xl shadow-lg overflow-hidden bg-white p-2">
              <ServiceBannerSlider slider={slider} />
            </div>
          </div>
        </div>
      )}

      <PopularInfoSlider slider={popularInfo} />

      {progressing ? (
        <Loader />
      ) : (
        <div className="py-4">
          {nearestInfo?.length > 0 && (
            <p className="md:text-2xl font-semibold pb-2 md:pb-5 text-[#0C3F8E]">
              Nearest Information
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
            {nearestInfo?.map((provider) => (
              <NearestInfoCard key={provider?._id} provider={provider} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreService;
