"use client";

import Image from "next/image";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import { useCenter } from "@/hooks/fetch-data/useCenter";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";
import LocationMobile from "@/components/shared/LocationModal/LocationMobile";

const NearestHospital = () => {
  const [centerInfo, setCenterInfo] = useState([]);

  const { getNearestCenterInfo, progressing } = useCenter();

  const centerType = "Hospital";

  useEffect(() => {
    getNearestCenterInfo(centerType, setCenterInfo);
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <LocationMobile />
        <p className="text-center py-3 lg:text-xl text-primaryFood bg-[#FFF1EA]">
          Nearest Hospital
        </p>
        {progressing ? (
          <Loader />
        ) : (
          <>
            <div className="flex justify-center px-4 lg:px-28 py-5 lg:py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {centerInfo?.map((center) => (
                  <div
                    key={center?._id}
                    className="bg-white border rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="relative w-full h-48">
                      <Image
                        src={
                          center?.medical_center_banner_app
                            ? `${HEALTH_CARE_IMAGES}/${center?.medical_center_banner_app}`
                            : "/png/dummyImage.png"
                        }
                        alt={center?.center_name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm md:text-base lg:text-lg font-semibold text-[#A93356] mb-2">
                        {center?.center_name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">
                        {center?.address}
                      </p>

                      {center?.distance && (
                        <p className="text-xs md:text-sm text-secondary">
                          Distance: {(center?.distance / 1000).toFixed(2)} km
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default NearestHospital;
