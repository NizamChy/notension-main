"use client";

import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useCenter } from "@/hooks/fetch-data/useCenter";
import InfiniteScroll from "react-infinite-scroll-component";
import MedicalCenterCard from "../MedicalCenterCard/MedicalCenterCard";
import DoctorCommonSlider from "../DoctorSection/DoctorCommonSlider/DoctorCommonSlider";

const DentalCareCenter = () => {
  const [pageNo, setPageNo] = useState(1);
  const [slider, setSlider] = useState([]);
  const [centerInfo, setCenterInfo] = useState([]);

  const { getCenterInfoByDistrict, loadingMore, allLoaded, banner } =
    useCenter();

  const centerType = "Deltal Care Centre";

  useEffect(() => {
    getCenterInfoByDistrict(centerType, setCenterInfo, pageNo, setPageNo);
  }, []);

  useEffect(() => {
    if (banner && banner?.length > 1) {
      setSlider(banner?.slice(0, banner?.length - 1));
    }
  }, [banner]);

  return (
    <>
      <div className="lg:flex justify-center items-center gap-5 my-10 px-4 lg:px-20 space-y-5 lg:space-y-0">
        <div className="w-full lg:w-1/2 lg:p-10">
          <DoctorCommonSlider slider={slider} />
        </div>

        <div className="w-full lg:w-1/2 flex justify-center items-center lg:p-10">
          <Link href="/medical-services/dental-care-center/nearest-dental-care-center">
            <Image
              src="/images/medical-services/find-near-dental-care-center.jpg"
              alt="find-near-consultation"
              width={800}
              height={400}
              className="rounded-lg w-full"
            />
          </Link>
        </div>
      </div>

      {!allLoaded && centerInfo.length < 1 && <Loader />}

      {centerInfo && centerInfo.length > 0 ? (
        <InfiniteScroll
          dataLength={centerInfo?.length}
          next={() => {
            getCenterInfoByDistrict(
              centerType,
              setCenterInfo,
              pageNo,
              setPageNo
            );
          }}
          hasMore={loadingMore}
          loader={<Loader />}
        >
          <div className="flex justify-center px-4 lg:px-20 xl:px-28 py-5 lg:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {centerInfo?.map((center) => (
                <MedicalCenterCard key={center?._id} center={center} />
              ))}
            </div>
          </div>
        </InfiniteScroll>
      ) : null}
    </>
  );
};

export default DentalCareCenter;
