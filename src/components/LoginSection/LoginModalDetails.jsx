"use client";

import toast from "react-hot-toast";
import OtpSection from "./OtpSection";
import React, { useState, useSyncExternalStore } from "react";
import { isDemoMode } from "@/demo/demoMode";
import { useUser } from "@/hooks/fetch-data/useUser";
import { useAfterLogin } from "@/hooks/useAfterLogin";
import { DEMO_USER_CONTACT, DEMO_USER_NAME } from "@/demo/demoUser";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { PrimaryButton } from "@/components/shared/CartUI/CartUI";
import { SECONDARY_BUTTON } from "@/components/shared/UI/UI";
import UserInfoInputs from "../UserInfoSection/UserInfoInputs";

const noopSubscribe = () => () => {};

const ButtonSpinner = () => (
  <span
    aria-hidden="true"
    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
  />
);

// `showHeading` is off on the /login page, which renders its own heading.
const LoginModalDetails = ({
  onClose = () => {},
  type = "login",
  showHeading = true,
}) => {
  const [phone, setPhone] = useState("");
  const [otpGenerated, setOtpGenerated] = useState("");
  const [contentType, setContentType] = useState("otp");

  const {
    progressing,
    userInfo,
    handleDataChange,
    getOtp,
    registerUser,
    loginAsDemoUser,
  } = useUser();

  const afterLogin = useAfterLogin(type, onClose);
  const demoOn = useSyncExternalStore(noopSubscribe, isDemoMode, () => false);

  const handleDemoLogin = async () => {
    if (await loginAsDemoUser()) afterLogin();
  };

  const sendSms = async () => {
    const generatedOtp = Math.floor(Math.random() * 8999 + 1000);

    let cleanedPhone = phone
      ?.toString()
      .trim()
      .replace(/\s+/g, "")
      .replace(/[-]/g, "")
      .replace(/^\+?88/, "");

    const sent = await getOtp({
      contact_no: cleanedPhone,
      otp: generatedOtp,
      smsKey: process.env.NEXT_PUBLIC_SMS_KEY,
    });

    setOtpGenerated(generatedOtp.toString());

    if (sent) setContentType("userInfo");
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
        <div className="w-full">
          {showHeading && (
            <div className="pr-6 pt-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0C3F8E]/10 text-xl text-[#0C3F8E] dark:text-[#7FB2FF]">
                <HiOutlineDevicePhoneMobile />
              </span>
              <h2 className="mt-3 text-lg font-bold tracking-tight text-gray-900 md:text-xl">
                Log in to NoTension
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Enter your mobile number to get a one-time code.
              </p>
            </div>
          )}
          <OtpSection phone={phone} setPhone={setPhone} />

          <PrimaryButton onClick={handleOtp} disabled={progressing}>
            {progressing ? (
              <>
                <ButtonSpinner />
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </PrimaryButton>

          {demoOn && (
            <>
              <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
                <span className="h-px flex-1 bg-gray-200" />
                or
                <span className="h-px flex-1 bg-gray-200" />
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={progressing}
                className={`${SECONDARY_BUTTON} h-12 w-full disabled:cursor-not-allowed disabled:opacity-60`}
              >
                Log in as Demo User
              </button>
              <p className="mt-2 text-center text-xs text-gray-500">
                Demo mode: signs in as {DEMO_USER_NAME} ({DEMO_USER_CONTACT}),
                no OTP needed
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="w-full">
          <UserInfoInputs
            onClose={onClose}
            type={type}
            phone={phone}
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
