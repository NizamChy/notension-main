"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";

const AppointmentModalDetails = ({ selectedPatient }) => {
  const [profileInfo, setProfileInfo] = useState([]);

  const { getProfileOfDoctor, progressing } = useDoctor();

  const params = useParams();
  const doctorId = params?.id || null;

  //   let bookAppoinmentData = {
  //     doctor_info: appoinmentData?.doctorId,
  //     doctor_name: appoinmentData?.doctor_name,
  //     doctor_speciality: appoinmentData?.speciality,
  //     consultation_center_info: appoinmentData?.consultationCenterId,
  //     consultation_center_name: appoinmentData?.center_name,
  //     consultation_limit: appoinmentData?.slot_limit,
  //     appointment_date: '',
  //     appointment_day: '',
  //     time_slot: '',
  //     patient_info: {
  //         id: appoinmentData?.patientId,
  //         patient_name: appoinmentData?.patient_name,
  //     }
  // }

  const formatDateOfBirth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    getProfileOfDoctor(doctorId, setProfileInfo);
  }, []);

  console.log("params : ", params);

  console.log("selected patient : ", selectedPatient);

  console.log("doctor profileInfo : ", profileInfo);

  return (
    <div>
      <div className="border border-primary rounded-lg p-4 my-5 shadow-md hover:shadow-lg transition-shadow duration-300">
        <p className="text-lg font-semibold text-primary">
          Name: {selectedPatient?.patient_name}
        </p>
        <p className="text-deepGray">Contact: {selectedPatient?.contact}</p>
        <p className="text-deepGray">
          Date of Birth: {formatDateOfBirth(selectedPatient?.date_of_birth)}
        </p>
      </div>
    </div>
  );
};

export default AppointmentModalDetails;
