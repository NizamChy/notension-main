"use client";

import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useCenter } from "@/hooks/fetch-data/useCenter";
import InfiniteScroll from "react-infinite-scroll-component";
import MedicalCenterCard from "../../MedicalCenterCard/MedicalCenterCard";

const ConsultationCenter = () => {
  const [pageNo, setPageNo] = useState(1);
  const [centerInfo, setCenterInfo] = useState([]);

  const { getCenterInfoByDistrict, loadingMore, allLoaded } = useCenter();

  const centerType = "Consultation Center";

  useEffect(() => {
    getCenterInfoByDistrict(centerType, setCenterInfo, pageNo, setPageNo);
  }, []);

  return (
    <>
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

export default ConsultationCenter;
