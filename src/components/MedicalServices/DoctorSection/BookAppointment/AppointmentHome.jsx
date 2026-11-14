"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { LuBuilding2, LuInfo, LuUserPlus } from "react-icons/lu";
import { CheckoutStep } from "@/components/shared/Checkout/CheckoutUI";
import { formatTaka } from "@/components/shared/CartUI/CartUI";
import {
  Badge,
  CARD,
  PageHeader,
  SECONDARY_BUTTON,
} from "@/components/shared/UI/UI";
import PatientInfo from "./PatientInfo";
import RegisterPatient from "./RegisterPatient";
import { MedicalContainer } from "../../Layout/MedicalLayout";
import { DoctorAvatar } from "../../Layout/MedicalUI";

// Doctor and chamber the user is booking with.
const DoctorSummary = ({ chamber }) => {
  const info = chamber?.doctorInfo;
  const center = chamber?.consultationCenterInfo;
  const fee = chamber?.consultation_fee ?? info?.consultation_fee;

  if (!info) return null;

  return (
    <section className={`${CARD} overflow-hidden`}>
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-base font-semibold text-gray-900">Your appointment</h2>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <DoctorAvatar info={info} className="h-14 w-14 rounded-full" sizes="56px" />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">{info?.doctor_name}</p>
            {info?.qualifications && (
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                {info.qualifications}
              </p>
            )}
            {info?.speciality && (
              <Badge tone="navy" className="mt-2">
                {info.speciality}
              </Badge>
            )}
          </div>
        </div>
        {center?.center_name && (
          <p className="flex items-start gap-2 text-sm text-gray-600">
            <LuBuilding2 className="mt-0.5 shrink-0 text-gray-400" />
            <span>
              <span className="font-medium text-gray-900">{center.center_name}</span>
              {center?.address && (
                <span className="block text-xs text-gray-500">{center.address}</span>
              )}
            </span>
          </p>
        )}
        {Number(fee) > 0 && (
          <div className="flex items-baseline justify-between border-t border-dashed border-gray-200 pt-4 text-sm">
            <span className="text-gray-600">Consultation fee</span>
            <span className="font-bold tabular-nums text-gray-900">
              {formatTaka(fee)}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

const AppointmentHome = () => {
  const [showForm, setShowForm] = useState(false);
  const { currentDoctor } = useSelector((state) => state.doctorInfo);

  return (
    <MedicalContainer className="min-h-content py-6 md:py-10">
      <PageHeader
        title="Book an appointment"
        subtitle="Choose who the appointment is for, then pick a date and time."
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        <div className="min-w-0 space-y-5">
          <CheckoutStep step={1} title="Select a patient">
            <PatientInfo />
          </CheckoutStep>

          <CheckoutStep
            step={2}
            title="Register a new patient"
            action={
              showForm ? (
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="inline-flex min-h-10 items-center px-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Cancel
                </button>
              ) : null
            }
          >
            {showForm ? (
              <RegisterPatient setShowForm={setShowForm} />
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2 text-sm text-gray-600">
                  <LuInfo className="mt-0.5 shrink-0 text-[#0C3F8E] dark:text-[#7FB2FF]" />
                  <span>
                    লিস্টে রোগীর নাম না পেলে রোগীর নিবন্ধন করুন। Not in the list?
                    Register the patient first.
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className={`${SECONDARY_BUTTON} shrink-0`}
                >
                  <LuUserPlus className="text-base" />
                  Register patient
                </button>
              </div>
            )}
          </CheckoutStep>
        </div>

        <div className="lg:sticky lg:top-[104px]">
          <DoctorSummary chamber={currentDoctor} />
        </div>
      </div>
    </MedicalContainer>
  );
};

export default AppointmentHome;
