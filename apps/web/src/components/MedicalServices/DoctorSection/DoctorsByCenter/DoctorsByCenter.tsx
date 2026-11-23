"use client";

import { useParams } from "next/navigation";
import React from "react";
import { LuStethoscope } from "react-icons/lu";
import { useDoctorsByCenter, useFindDoctor } from "@/hooks/healthCare/useDoctors";
import { useConsultationCenter } from "@/hooks/healthCare/useCenters";
import { EmptyState } from "@/components/StoreModule/legacyViews";
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
  const params = useParams<{ deptId?: string; centerId?: string }>();
  const deptId = params?.deptId;
  const centerId = params?.centerId;

  const {
    doctors: doctorsInfo,
    isLoading,
    hasMore,
    loadMore,
  } = useDoctorsByCenter(centerId, deptId);
  const { departments } = useFindDoctor();
  const { center } = useConsultationCenter(centerId);

  // The department and centre in the URL; the doctors' chambers fill in
  // while those load.
  const dept =
    departments.find((d) => d?._id === deptId) || doctorsInfo?.[0]?.deptInfo;
  const chamberCenter = doctorsInfo?.[0]?.consultationCenterInfo;
  const shownCenter =
    center || (chamberCenter?._id === centerId ? chamberCenter : null);

  return (
    <MedicalPageBody className="min-h-content">
      <ExploreConsultationCenterInfo center={shownCenter} />

      <section>
        <MedicalSectionTitle
          subtitle={
            doctorsInfo?.length > 0
              ? `${doctorsInfo.length}${hasMore ? "+" : ""} doctors at this centre`
              : null
          }
        >
          {dept?.dept_name ? `${dept.dept_name} specialists` : "Doctors"}
        </MedicalSectionTitle>

        {isLoading && (
          <SkeletonGrid count={3} item={DoctorCardSkeleton} />
        )}

        {doctorsInfo && doctorsInfo?.length > 0 ? (
          <InfiniteScroll
            dataLength={doctorsInfo?.length}
            next={loadMore}
            hasMore={hasMore}
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

        {!isLoading && doctorsInfo?.length < 1 && (
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
