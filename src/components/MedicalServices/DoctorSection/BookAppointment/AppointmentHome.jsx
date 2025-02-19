"use client";

import React, { useState } from "react";
import PatientInfo from "./PatientInfo";
import RegisterPatient from "./RegisterPatient";
import { FaRegAddressCard } from "react-icons/fa";

const AppointmentHome = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center gap-7 lg:gap-20 min-h-content">
        <div>
          {showForm ? (
            <RegisterPatient setShowForm={setShowForm} />
          ) : (
            <div className="flex justify-center items-center mt-5 mx-4">
              <div>
                <p className="text-primary text-lg my-4 font-semibold">
                  লিস্টে রোগীর নাম না পেলে "Register Patient" রোগীর নিবন্ধন করুন
                  ৷
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex justify-center items-center gap-2 p-4 bg-primary hover:bg-[#264066] text-white rounded-lg shadow-md  transition-colors duration-300"
                >
                  <span>
                    <FaRegAddressCard className="text-xl" />
                  </span>
                  <span>Register Patient</span>
                </button>
              </div>
            </div>
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
