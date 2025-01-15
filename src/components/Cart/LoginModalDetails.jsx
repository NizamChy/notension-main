"use client";
import React, { useState } from "react";
import OtpSection from "../LoginSection/OtpSection";
import UserInfoInputs from "../UserInfoSection/UserInfoInputs";
import { useSelector } from "react-redux";

const LoginModalDetails = ({ onClose, type }) => {
  const [tab, setTab] = useState(true);
  const [phone, setPhone] = useState("");

  const currentModule = useSelector((state) => state.dashboard.currentModule);

  const module = currentModule.toLowerCase();

  const handleOtp = () => {
    setTab(false);
  };

  const getPrimaryClass = () => {
    if (module === "medicine") return "bg-primaryMedicine";
    if (module === "grocery") return "bg-primaryGrocery";
    if (module === "food") return "bg-primaryFood";
    return "bg-primary";
  };

  const getSecondaryClass = () => {
    if (module === "medicine") return "bg-secondaryMedicine";
    if (module === "grocery") return "bg-secondaryGrocery";
    if (module === "food") return "bg-secondaryFood";
    return "bg-secondary";
  };

  return (
    <>
      {tab ? (
        <div className="md:border-2 rounded-md p-3 md:p-6">
          <OtpSection setPhone={setPhone} />
          <div className="flex justify-center">
            <button
              onClick={handleOtp}
              className={`md:mt-4 px-4 py-2 ${getPrimaryClass()} text-white rounded-md w-full`}
            >
              LOGIN WITH OTP
            </button>
          </div>
        </div>
      ) : (
        <div className="md:border-2 rounded-md p-3 md:p-6">
          <UserInfoInputs
            phone={phone}
            onClose={onClose}
            type={type}
            getPrimaryClass={getPrimaryClass}
          />
        </div>
      )}
    </>
  );
};

export default LoginModalDetails;
