"use client";

import React, { useState } from "react";
import PatientInfo from "./PatientInfo";
import RegisterPatient from "./RegisterPatient";

const AppointmentHome = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row justify-center gap-7 lg:gap-20">
        <div>
          {showForm ? (
            <RegisterPatient />
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 p-4 bg-primary text-white rounded-lg shadow-md hover:bg-[#264066] transition-colors duration-300"
            >
              Register Patient
            </button>
          )}
        </div>
        <div>
          <PatientInfo />
        </div>
      </div>
    </>
  );
};

export default AppointmentHome;
