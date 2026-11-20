"use client";

import Link from "next/link";
import notify from "@/utils/notify";
import OtpSection from "./OtpSection";
import React, { useState } from "react";
import { isLiveLogin, useUser } from "@/hooks/fetch-data/useUser";
import { useAfterLogin } from "@/hooks/useAfterLogin";
import { DEMO_USER_CONTACT, DEMO_USER_NAME } from "@/demo/demoUser";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { PrimaryButton } from "@/components/shared/CartUI/CartUI";
import { SECONDARY_BUTTON } from "@/components/shared/UI/UI";
import UserInfoInputs from "../UserInfoSection/UserInfoInputs";

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
  redirectTo,
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
    verifyOtp,
  } = useUser();

  const afterLogin = useAfterLogin(type, onClose, redirectTo);

  const handleDemoLogin = async () => {
    if (await loginAsDemoUser()) afterLogin();
  };

  const sendSms = async () => {
    let cleanedPhone = phone
      ?.toString()
      .trim()
      .replace(/\s+/g, "")
      .replace(/[-]/g, "")
      .replace(/^\+?88/, "");

    // Live login: the API makes, sends and checks the code.
    if (isLiveLogin()) {
      if (await getOtp({ contact_no: cleanedPhone })) setContentType("userInfo");
      return;
    }

    const generatedOtp = Math.floor(Math.random() * 8999 + 1000);
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
      return notify.warning("Please enter your mobile number.");
    } else if (phone?.length < 11) {
      return notify.warning("Please enter a valid 11-digit mobile number.");
    }

    sendSms();
  };

  return (
    <>
      {contentType === "otp" ? (
        <div className="w-full">
          {showHeading && (
            <div className="pr-6 pt-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-xl text-primary dark:text-[#7FB2FF]">
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
            Signs in as {DEMO_USER_NAME} ({DEMO_USER_CONTACT}), no OTP
            needed
          </p>
          <Link
            href="/admin/login"
            onClick={() => onClose()}
            className={`${SECONDARY_BUTTON} mt-3 h-12 w-full`}
          >
            Log in as Admin
          </Link>
          <p className="mt-3 text-center text-xs">
            <Link
              href="/demo-accounts"
              onClick={() => onClose()}
              className="font-medium text-primary hover:underline"
            >
              Demo accounts for every role (admin, store, rider…)
            </Link>
          </p>
        </div>
      ) : (
        <div className="w-full">
          <UserInfoInputs
            onClose={onClose}
            type={type}
            redirectTo={redirectTo}
            phone={phone}
            userInfo={userInfo}
            otpGenerated={otpGenerated}
            sendSms={sendSms}
            progressing={progressing}
            handleDataChange={handleDataChange}
            registerUser={registerUser}
            verifyOtp={isLiveLogin() ? verifyOtp : undefined}
          />
        </div>
      )}
    </>
  );
};

export default LoginModalDetails;
