"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaCalendarAlt } from "react-icons/fa";
import Loader from "@/components/common/Loader";
import { usePatient } from "@/hooks/fetch-data/usePatient";
import AppointmentModalDetails from "./AppointmentModalDetails";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const PatientInfo = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { progressing } = usePatient();
  const { patientInfo } = useSelector((state) => state.user);

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

  const handleSeeMore = () => setVisibleCount(patientInfo.length);

  return (
    <>
      <div>
        <h2 className="text-lg md:text-2xl font-bold mb-3 text-primary">
          Patient Information
        </h2>

        {progressing ? (
          <Loader />
        ) : (
          <>
            {patientInfo?.length < 1 && (
              <p className="h-32 rounded-xl border border-dashed border-gray-300 text-sm text-mediumGray flex justify-center items-center">
                No patient registered.
              </p>
            )}
            {[...patientInfo]
              ?.slice()
              ?.reverse()
              ?.slice(0, visibleCount)
              ?.map((patient) => (
                <div
                  onClick={(e) => handlePatientClick(e, patient)}
                  key={patient?._id}
                  className="cursor-pointer bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md hover:border-primary transition-all duration-300"
                >
                  <p className="text-base md:text-lg font-semibold text-primary break-words">
                    Name: {patient?.patient_name}
                  </p>
                  <p className="text-gray-600">Contact: {patient?.contact}</p>
                  <p className="text-gray-600">
                    Date of Birth: {formatDateOfBirth(patient?.date_of_birth)}
                  </p>

                  <button className="flex justify-center items-center gap-1.5 mt-3 px-4 py-1 bg-primary text-white rounded-lg shadow-md hover:bg-[#264066] transition-colors duration-300">
                    <span>
                      <FaCalendarAlt className="text-sm" />
                    </span>
                    <span>Book Appointment</span>
                  </button>
                </div>
              ))}

            {visibleCount < patientInfo.length && (
              <button
                onClick={handleSeeMore}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-[#264066] transition-colors duration-300"
              >
                See More
              </button>
            )}
          </>
        )}
      </div>

      {isModalOpen && selectedPatient && (
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <AppointmentModalDetails
            selectedPatient={selectedPatient}
            onClose={closeModal}
          />
        </CommonModal>
      )}
    </>
  );
};

export default PatientInfo;
