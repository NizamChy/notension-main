"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import DoctorInfoCard from "../DoctorCard/DoctorInfoCard";
import InfiniteScroll from "react-infinite-scroll-component";
import NearestDoctorSlider from "../NearestDoctor/NearestDoctorSlider";
import {
  MedicalCardGrid,
  MedicalPageBody,
  MedicalSectionTitle,
} from "../../Layout/MedicalLayout";

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
    <MedicalPageBody>
      <NearestDoctorSlider hideWhenEmpty wide />

      <section>
        <MedicalSectionTitle>
          Doctors Info
          {currentDept?.dept_name ? ` (${currentDept.dept_name})` : ""}
        </MedicalSectionTitle>

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
            style={{ overflow: "visible" }}
          >
            <MedicalCardGrid>
              {doctorsInfo?.map((doctor) => (
                <DoctorInfoCard key={doctor?._id} doctor={doctor} />
              ))}
            </MedicalCardGrid>
          </InfiniteScroll>
        ) : null}

        {allLoaded && doctorsInfo?.length < 1 && (
          <p className="py-16 text-center text-mediumGray">
            No doctor found in this department.
          </p>
        )}
      </section>
    </MedicalPageBody>
  );
};

export default DoctorInfoByDept;
