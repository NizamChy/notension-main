"use client";

import { useSelector } from "react-redux";
import { FaCalendarAlt } from "react-icons/fa";
import Loader from "@/components/common/Loader";
import React, { useEffect, useState } from "react";
import { usePatient } from "@/hooks/fetch-data/usePatient";
import AppointmentModalDetails from "./AppointmentModalDetails";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const PatientInfo = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { getPatientInfo, progressing } = usePatient();
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

  useEffect(() => {
    getPatientInfo();
  }, []);

  return (
    <>
      <div className="cursor-pointer mt-7 px-4">
        <p className="text-2xl font-bold mb-3 text-primary">
          Patient Information
        </p>

        {progressing ? (
          <Loader />
        ) : (
          <>
            {[...patientInfo]
              ?.slice()
              ?.reverse()
              ?.slice(0, visibleCount)
              ?.map((patient) => (
                <div
                  onClick={(e) => handlePatientClick(e, patient)}
                  key={patient?._id}
                  className="border border-gray-100 rounded-lg p-4 my-5 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <p className="text-lg font-semibold text-primary">
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
