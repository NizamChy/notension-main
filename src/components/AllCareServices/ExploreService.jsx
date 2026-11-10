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
  const [popularInfo, setPopularInfo] = useState([]);
  const [nearestInfo, setNearestInfo] = useState([]);

  const params = useParams();
  const serviceId = params?.serviceId || null;

  const { exploreCareProvider, progressing } = useAllCareService();
  const { currentService } = useSelector((state) => state.allCare);
  const districtId = useSelector((state) => state.user.districtId);

  const slider = currentService?.sliderInfo?.service_slider;

  // Providers are per district: refetch when the user's location changes.
  useEffect(() => {
    return exploreCareProvider(
      serviceId,
      setPopularInfo,
      setNearestInfo,
      pageNo
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, districtId, pageNo]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 md:py-8 flex flex-col gap-6 md:gap-10">
      {currentService?.service_name_eng && (
        <h1 className="text-lg md:text-2xl font-semibold text-[#0C3F8E] bg-gray-50 text-center py-2.5 rounded-lg">
          {currentService.service_name_eng}
        </h1>
      )}

      {slider?.length > 0 && (
        <div className="flex justify-center">
          <div className="w-full max-w-[816px] rounded-2xl shadow-md overflow-hidden bg-white p-2">
            <ServiceBannerSlider slider={slider} />
          </div>
        </div>
      )}

      <PopularInfoSlider slider={popularInfo} />

      {progressing ? (
        <Loader />
      ) : (
        <div>
          {nearestInfo?.length > 0 && (
            <h2 className="text-lg md:text-2xl font-semibold mb-3 md:mb-5 text-[#0C3F8E]">
              Nearest Information
            </h2>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
