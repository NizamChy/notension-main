"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import DoctorInfoCard from "../DoctorCard/DoctorInfoCard";
import InfiniteScroll from "react-infinite-scroll-component";
import ExploreConsultationCenterInfo from "../ConsultationCenter/ExploreConsultationCenterInfo";
import {
  MedicalCardGrid,
  MedicalPageBody,
  MedicalSectionTitle,
} from "../../Layout/MedicalLayout";

const DoctorsByCenter = () => {
  const [pageNo, setPageNo] = useState(1);
  const [doctorsInfo, setDoctorsInfo] = useState([]);

  const { getDoctorsInfoByCenter, loadingMore, allLoaded } = useDoctor();
  const { currentDept } = useSelector((state) => state.doctorInfo);

  const params = useParams();
  const deptId = params?.deptId;
  const centerId = params?.centerId;

  useEffect(() => {
    getDoctorsInfoByCenter(centerId, deptId, setDoctorsInfo, pageNo, setPageNo);
  }, [centerId]);

  return (
    <MedicalPageBody className="min-h-content">
      <ExploreConsultationCenterInfo />

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
            style={{ overflow: "visible" }}
          >
            <MedicalCardGrid>
              {doctorsInfo?.map((doctor) => (
                <DoctorInfoCard
                  key={doctor?._id}
                  doctor={doctor}
                  isVisited={true}
                />
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

export default DoctorsByCenter;
