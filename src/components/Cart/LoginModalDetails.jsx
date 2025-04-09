"use client";

import { toast } from "react-toastify";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import OtpSection from "../LoginSection/OtpSection";
import UserInfoInputs from "../UserInfoSection/UserInfoInputs";

const LoginModalDetails = ({ onClose, type = "login" }) => {
  const [phone, setPhone] = useState("");
  const [contentType, setContentType] = useState("otp");

  const currentModule = useSelector((state) => state.dashboard.currentModule);
  const module = currentModule.toLowerCase();

  const handleOtp = () => {
    if (phone?.length < 1) {
      return toast.info("মোবাইল নম্বর প্রদান করা আবশ্যক।", {
        position: "top-center",
      });
    } else if (phone?.length < 11) {
      return toast.info("মোবাইল নম্বরটি অবশ্যই সঠিক ১১টি ডিজিট হতে হবে!", {
        position: "top-center",
      });
    }

    setContentType("userInfo");
  };

  const getPrimaryClass = () => {
    if (module === "medicine") return "bg-primaryMedicine";
    if (module === "grocery") return "bg-primaryGrocery";
    if (module === "food") return "bg-primaryFood";
    return "bg-primary";
  };

  return (
    <>
      {contentType === "otp" ? (
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
