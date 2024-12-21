"use client";
import React, { useState } from "react";
import OtpSection from "../LoginSection/OtpSection";
import UserInfoInputs from "../UserInfoSection/UserInfoInputs";

const LoginModalDetails = ({ onClose, type }) => {
  const [tab, setTab] = useState(true);
  const [phone, setPhone] = useState("");

  const handleOtp = () => {
    setTab(false);
  };

  return (
    <>
      {tab ? (
        <div className="border-2 rounded-md p-6">
          <OtpSection setPhone={setPhone} />
          <div className="flex justify-center">
            <button
              onClick={handleOtp}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md w-full"
            >
              LOGIN WITH OTP
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 rounded-md p-6">
          <UserInfoInputs phone={phone} onClose={onClose} type={type} />
        </div>
      )}
    </>
  );
};

export default LoginModalDetails;
