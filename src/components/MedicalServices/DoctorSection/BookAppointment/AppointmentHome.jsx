"use client";

import React, { useState } from "react";
import PatientInfo from "./PatientInfo";
import RegisterPatient from "./RegisterPatient";
import { FaRegAddressCard } from "react-icons/fa";
import { MedicalContainer } from "../../Layout/MedicalLayout";

const AppointmentHome = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <MedicalContainer className="py-6 md:py-8 min-h-content">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
        <div>
          {showForm ? (
            <RegisterPatient setShowForm={setShowForm} />
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
              <p className="text-primary text-base md:text-lg mb-4 font-semibold">
                লিস্টে রোগীর নাম না পেলে &ldquo;Register Patient&rdquo; রোগীর
                নিবন্ধন করুন ৷
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex justify-center items-center gap-2 px-5 py-3 bg-primary hover:bg-[#264066] text-white rounded-lg shadow-sm transition-colors duration-300"
              >
                <FaRegAddressCard className="text-xl" />
                <span>Register Patient</span>
              </button>
            </div>
          )}
        </div>
        <div>
          <PatientInfo />
        </div>
      </div>
    </MedicalContainer>
  );
};

export default AppointmentHome;
