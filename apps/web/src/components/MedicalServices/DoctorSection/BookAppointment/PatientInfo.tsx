"use client";

import React, { useState, type MouseEvent } from "react";
import { LuChevronRight, LuUsers } from "react-icons/lu";
import { usePatients } from "@/hooks/healthCare/usePatients";
import { parseLocalYMD } from "@/utils/date";
import { SECONDARY_BUTTON, Skeleton } from "@/components/shared/UI/UI";
import AppointmentModalDetails, { type PatientRecord } from "./AppointmentModalDetails";
import { CommonModal } from "@/components/StoreModule/legacyViews";

const PatientInfo = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  // The account's saved patients, refreshed from the server.
  const { patients: patientInfo, isLoading: progressing } = usePatients();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePatientClick = (e: MouseEvent<HTMLButtonElement>, patient: PatientRecord) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedPatient(patient);
    openModal();
  };

  const formatDateOfBirth = (dateString: string) => {
    const date = parseLocalYMD(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSeeMore = () => setVisibleCount(patientInfo.length);

  return (
    <>
      {progressing ? (
        <div className="space-y-3">
          <Skeleton className="h-[72px] w-full" />
          <Skeleton className="h-[72px] w-full" />
        </div>
      ) : (
        <>
          {patientInfo?.length < 1 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center">
              <LuUsers className="text-2xl text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">
                No patient registered yet
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                Register a patient below to book an appointment.
              </p>
            </div>
          )}

          <ul className="space-y-3">
            {[...patientInfo]
              ?.slice()
              ?.reverse()
              ?.slice(0, visibleCount)
              ?.map((patient: PatientRecord) => (
                <li key={patient?._id}>
                  <button
                    type="button"
                    onClick={(e) => handlePatientClick(e, patient)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/3 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#EB5C2F]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold uppercase text-primary dark:text-[#7FB2FF]">
                      {patient?.patient_name?.trim()?.charAt(0) || "?"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block wrap-break-word font-semibold text-gray-900">
                        {patient?.patient_name}
                      </span>
                      <span className="mt-0.5 block text-xs text-gray-500">
                        <span className="tabular-nums">{patient?.contact}</span>
                        {patient?.date_of_birth && (
                          <>
                            {" · "}DOB {formatDateOfBirth(patient.date_of_birth)}
                          </>
                        )}
                      </span>
                    </span>
                    <span className="hidden shrink-0 text-sm font-semibold text-primary sm:inline dark:text-[#7FB2FF]">
                      Book
                    </span>
                    <LuChevronRight className="shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </li>
              ))}
          </ul>

          {visibleCount < patientInfo.length && (
            <button
              type="button"
              onClick={handleSeeMore}
              className={`${SECONDARY_BUTTON} mt-4 w-full sm:w-auto`}
            >
              Show all {patientInfo.length} patients
            </button>
          )}
        </>
      )}

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
