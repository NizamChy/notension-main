"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import DoctorInfoCard from "../DoctorCard/DoctorInfoCard";
import InfiniteScroll from "react-infinite-scroll-component";
import ExploreConsultationCenterInfo from "../ConsultationCenter/ExploreConsultationCenterInfo";

const DoctorsByCenter = () => {
  const [pageNo, setPageNo] = useState(1);
  const [doctorsInfo, setDoctorsInfo] = useState([]);

  const { getDoctorsInfoByCenter, loadingMore, allLoaded } = useDoctor();

  const { currentCenter, currentDept } = useSelector(
    (state) => state.doctorInfo
  );

  const params = useParams();

  const deptId = params?.deptId;
  const centerId = params?.centerId;

  useEffect(() => {
    getDoctorsInfoByCenter(centerId, deptId, setDoctorsInfo, pageNo, setPageNo);
  }, [centerId]);

  console.log("params", params);
  console.log("deptId", params?.deptId);
  console.log("centerId", params?.centerId);
  console.log("doctorsInfo: ", doctorsInfo);
  console.log("currentDept: ", currentDept);

  return (
    <div className="container min-h-content">
      <div>
        <ExploreConsultationCenterInfo />

        <p className="md:text-2xl ps-3 md:ps-5 font-semibold py-1 md:py-5 text-[#0C3F8E]">
          Doctors Info ({currentDept?.dept_name})
        </p>

        <div className="px-2 md:px-4">
          {!allLoaded && doctorsInfo?.length < 1 && <Loader />}

          {doctorsInfo && doctorsInfo?.length > 0 ? (
            <InfiniteScroll
              dataLength={doctorsInfo?.length}
              next={() => {
                getDoctorsInfoByCenter(
                  centerId,
                  deptId,
                  setDoctorsInfo,
                  pageNo,
                  setPageNo
                );
              }}
              hasMore={loadingMore}
              loader={<Loader />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-5 lg:gap-10 justify-center items-center">
                {doctorsInfo?.map((doctor) => (
                  <DoctorInfoCard key={doctor?._id} doctor={doctor} />
                ))}
              </div>
            </InfiniteScroll>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DoctorsByCenter;
