"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import DoctorInfoCard from "../DoctorCard/DoctorInfoCard";
import InfiniteScroll from "react-infinite-scroll-component";
import NearestDoctorSlider from "../NearestDoctor/NearestDoctorSlider";

const DoctorInfoByDept = () => {
  const [pageNo, setPageNo] = useState(1);
  const [doctorsInfo, setDoctorsInfo] = useState([]);

  const params = useParams();
  const { getDoctorsInfoByDistrict, loadingMore, allLoaded } = useDoctor();

  const { currentDept } = useSelector((state) => state.doctorInfo);

  const deptId = params?.deptId || null;

  useEffect(() => {
    getDoctorsInfoByDistrict(deptId, setDoctorsInfo, pageNo, setPageNo);
  }, []);

  return (
    <div className="px-2 md:px-4 lg:px-10 xl:px-20 2xl:px-28">
      <div>
        <div className="lg:flex justify-center my-10 gap-5 px-4 lg:px-0">
          <NearestDoctorSlider />
        </div>

        <p className="md:text-2xl ps-3 md:ps-5 font-semibold py-1 md:py-5 text-[#0C3F8E]">
          Doctors Info ({currentDept?.dept_name})
        </p>

        {!allLoaded && doctorsInfo?.length < 1 && <Loader />}

        {doctorsInfo && doctorsInfo?.length > 0 ? (
          <InfiniteScroll
            dataLength={doctorsInfo?.length}
            next={() => {
              getDoctorsInfoByDistrict(
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
  );
};

export default DoctorInfoByDept;
