"use client";

import toast from "react-hot-toast";
import OtpSection from "./OtpSection";
import React, { useState } from "react";
import { useUser } from "@/hooks/fetch-data/useUser";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import UserInfoInputs from "../UserInfoSection/UserInfoInputs";

const LoginModalDetails = ({ onClose = () => {}, type = "login" }) => {
  const [phone, setPhone] = useState("");
  const [otpGenerated, setOtpGenerated] = useState("");
  const [contentType, setContentType] = useState("otp");

  const { progressing, userInfo, handleDataChange, getOtp, registerUser } =
    useUser();

  const sendSms = () => {
    const generatedOtp = Math.floor(Math.random() * 8999 + 1000);

    let cleanedPhone = phone
      ?.toString()
      .trim()
      .replace(/\s+/g, "")
      .replace(/[-]/g, "")
      .replace(/^\+?88/, "");

    getOtp({
      contact_no: cleanedPhone,
      otp: generatedOtp,
      smsKey: "fZtUYT1",
    });

    setOtpGenerated(generatedOtp.toString());

    if (!progressing) {
      setTimeout(() => {
        setContentType("userInfo");
      }, 1000);
    }
  };

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

    sendSms();
  };

  return (
    <>
      {contentType === "otp" ? (
        <div className="md:border-2 rounded-md p-3 md:p-6">
          <OtpSection setPhone={setPhone} />
          <div className="flex justify-center">
            <button
              onClick={handleOtp}
              className={`md:mt-1 px-4 bg-primary text-white rounded-md w-full`}
              disabled={progressing}
            >
              {progressing ? (
                <div className="flex justify-center items-center">
                  <p>Sending OTP...</p>
                  <DotLottieReact
                    src="https://lottie.host/6958d316-ea05-4122-9dff-1d526f59b3ca/ZilAm5yZWu.lottie"
                    loop
                    autoplay
                    className="size-10"
                  />
                </div>
              ) : (
                <>
                  <p className="py-2">LOGIN WITH OTP</p>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="md:border-2 rounded-md p-3 md:p-6">
          <UserInfoInputs
            onClose={onClose}
            type={type}
            userInfo={userInfo}
            otpGenerated={otpGenerated}
            sendSms={sendSms}
            progressing={progressing}
            handleDataChange={handleDataChange}
            registerUser={registerUser}
          />
        </div>
      )}
    </>
  );
};

export default LoginModalDetails;
