"use client";

import { useSelector } from "react-redux";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { usePatient } from "@/hooks/fetch-data/usePatient";
import AppointmentModalDetails from "./AppointmentModalDetails";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const PatientInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { getPatientInfo, progressing } = usePatient();
  const { patientInfo, bookedAppoinmentInfo } = useSelector(
    (state) => state.user
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePatientClick = (e, patient) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedPatient(patient);
    openModal();
  };

  const formatDateOfBirth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    getPatientInfo();
  }, []);

  console.log("patientInfo : ", patientInfo);
  console.log("bookedAppoinmentInfo : ", bookedAppoinmentInfo);

  return (
    <>
      <div className="cursor-pointer mt-7 px-4">
        <h1 className="text-2xl font-bold mb-5 text-primary">
          Patient Information
        </h1>

        {progressing ? (
          <Loader />
        ) : (
          <>
            {patientInfo?.map((patient) => (
              <div
                onClick={(e) => handlePatientClick(e, patient)}
                key={patient?._id}
                className="border border-primary rounded-lg p-4 my-5 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <p className="text-lg font-semibold text-primary">
                  Name: {patient?.patient_name}
                </p>
                <p className="text-gray-600">Contact: {patient?.contact}</p>
                <p className="text-gray-600">
                  Date of Birth: {formatDateOfBirth(patient?.date_of_birth)}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {isModalOpen && selectedPatient && (
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <AppointmentModalDetails selectedPatient={selectedPatient} />
        </CommonModal>
      )}
    </>
  );
};

export default PatientInfo;
