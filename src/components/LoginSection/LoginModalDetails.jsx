"use client";

import toast from "react-hot-toast";
import OtpSection from "./OtpSection";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import UserInfoInputs from "../UserInfoSection/UserInfoInputs";

const LoginModalDetails = ({ onClose = () => {}, type = "login" }) => {
  const [phone, setPhone] = useState("");
  const [contentType, setContentType] = useState("otp");

  const pathname = usePathname();

  const currentModule = useSelector((state) => state.dashboard.currentModule);
  const module = currentModule.toLowerCase();

  let category = "";

  if (pathname.includes("/grocery")) {
    category = "grocery";
  } else if (pathname.includes("/medicine")) {
    category = "medicine";
  } else if (pathname.includes("/food")) {
    category = "food";
  } else if (pathname.includes("/all-care-services")) {
    category = "all-care-services";
  }

  const handleOtp = () => {
    if (phone?.length < 1) {
      return toast("মোবাইল নম্বর প্রদান করা আবশ্যক।", {
        style: {
          border: "1px solid #FC8F1E",
        },
        icon: "ℹ️",
        iconTheme: {
          primary: "#FC8F1E",
          secondary: "#FFFAEE",
        },
      });
    } else if (phone?.length < 11) {
      return toast("মোবাইল নম্বরটি অবশ্যই সঠিক ১১টি ডিজিট হতে হবে!", {
        style: {
          border: "1px solid #FC8F1E",
        },
        icon: "ℹ️",
        iconTheme: {
          primary: "#FC8F1E",
          secondary: "#FFFAEE",
        },
      });
    }

    setContentType("userInfo");
  };

  const getPrimaryClass = () => {
    if (module === "medicine" && category === "medicine")
      return "bg-primaryMedicine";
    if (module === "grocery" && category === "grocery")
      return "bg-primaryGrocery";
    if (module === "food" && category === "food") return "bg-primaryFood";
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
              className={`md:mt-1 px-4 py-2 ${getPrimaryClass()} text-white rounded-md w-full`}
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
