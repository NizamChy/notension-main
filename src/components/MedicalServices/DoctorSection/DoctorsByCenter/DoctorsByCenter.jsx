"use client";

import { useDispatch, useSelector } from "react-redux";
import { handleDoctorReducer } from "@/redux/doctorReducer";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuStethoscope } from "react-icons/lu";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import { EmptyState } from "@/components/shared/UI/UI";
import DoctorInfoCard from "../DoctorCard/DoctorInfoCard";
import InfiniteScroll from "react-infinite-scroll-component";
import ExploreConsultationCenterInfo from "../ConsultationCenter/ExploreConsultationCenterInfo";
import {
  MedicalCardGrid,
  MedicalPageBody,
  MedicalSectionTitle,
} from "../../Layout/MedicalLayout";
import {
  DoctorCardSkeleton,
  InlineSpinner,
  SkeletonGrid,
} from "../../Layout/MedicalUI";

const DoctorsByCenter = () => {
  const [pageNo, setPageNo] = useState(1);
  const [doctorsInfo, setDoctorsInfo] = useState([]);

  const { getDoctorsInfoByCenter, loadingMore, allLoaded } = useDoctor();
  const { currentDept, currentCenter } = useSelector((state) => state.doctorInfo);
  const dispatch = useDispatch();

  const params = useParams();
  const deptId = params?.deptId;
  const centerId = params?.centerId;

  // Saved department/centre only count when they match the URL; otherwise
  // take them from the doctors' chambers (direct links, other tabs).
  const dept =
    currentDept?._id === deptId ? currentDept : doctorsInfo?.[0]?.deptInfo;
  const chamberCenter = doctorsInfo?.[0]?.consultationCenterInfo;

  useEffect(() => {
    getDoctorsInfoByCenter(centerId, deptId, setDoctorsInfo, pageNo, setPageNo);
    // getDoctorsInfoByCenter is recreated on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [centerId, deptId]);

  useEffect(() => {
    if (chamberCenter?._id === centerId && currentCenter?._id !== centerId) {
      dispatch(handleDoctorReducer({ type: "SAVE_CENTER_INFO", data: chamberCenter }));
    }
  }, [chamberCenter, centerId, currentCenter?._id, dispatch]);

  return (
    <MedicalPageBody className="min-h-content">
      <ExploreConsultationCenterInfo />

      <section>
        <MedicalSectionTitle
          subtitle={
            doctorsInfo?.length > 0
              ? `${doctorsInfo.length}${loadingMore && !allLoaded ? "+" : ""} doctors at this centre`
              : null
          }
        >
          {dept?.dept_name ? `${dept.dept_name} specialists` : "Doctors"}
        </MedicalSectionTitle>

        {!allLoaded && doctorsInfo?.length < 1 && (
          <SkeletonGrid count={3} item={DoctorCardSkeleton} />
        )}

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
            loader={<InlineSpinner />}
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
          <EmptyState
            icon={<LuStethoscope />}
            title="No doctor found in this department"
            text="This centre has no doctors listed for this department yet."
          />
        )}
      </section>
    </MedicalPageBody>
  );
};

export default DoctorsByCenter;
