"use client";

import React, { type MouseEvent } from "react";
import DoctorCardView from "./DoctorCardView";
import { useParams, useRouter } from "next/navigation";
import type { Chamber } from "@/lib/api/healthCare";

/** A chamber as the doctor cards read it (nearest-doctor rows add `distance`). */
export type DoctorChamber = Chamber & {
  distance?: number;
  doctorInfo: Chamber["doctorInfo"] & { rating?: number };
};

type Props = {
  doctor: DoctorChamber;
  isVisited?: boolean;
};

const DoctorInfoCard = ({ doctor, isVisited = false }: Props) => {
  const router = useRouter();

  const params = useParams<{ id?: string; centerId?: string }>();
  // visit/[id] names the param `id`, dept/[deptId]/center/[centerId] names
  // it `centerId`; otherwise fall back to the doctor's own center.
  const centerId =
    params?.id ||
    params?.centerId ||
    doctor?.consultationCenterInfo?._id ||
    null;

  const handleDoctorClick = (e: MouseEvent<HTMLElement>, doctor: DoctorChamber) => {
    e.preventDefault();
    e.stopPropagation();

    router.push(
      centerId
        ? `/medical-services/doctor/consultation-center/visit/${centerId}/doctor-profile/${doctor?.doctorInfo?._id}`
        : `/medical-services/doctor/profile/${doctor?.doctorInfo?._id}`
    );
  };

  const info = doctor?.doctorInfo;

  return (
    <DoctorCardView
      onClick={(e) => handleDoctorClick(e, doctor)}
      info={info}
      name={info?.doctor_name}
      speciality={info?.speciality}
      qualifications={info?.qualifications}
      experience={info?.experience_years}
      rating={info?.rating}
      fee={doctor?.consultation_fee ?? info?.consultation_fee}
      center={isVisited ? null : doctor?.consultationCenterInfo?.center_name}
      distance={doctor?.distance}
    />
  );
};

export default DoctorInfoCard;
