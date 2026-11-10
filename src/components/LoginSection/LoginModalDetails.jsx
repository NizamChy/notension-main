"use client";

import toast from "react-hot-toast";
import OtpSection from "./OtpSection";
import React, { useState, useSyncExternalStore } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { isDemoMode } from "@/demo/demoMode";
import { useUser } from "@/hooks/fetch-data/useUser";
import { useAfterLogin } from "@/hooks/useAfterLogin";
import { DEMO_USER_CONTACT, DEMO_USER_NAME } from "@/demo/demoUser";

const noopSubscribe = () => () => {};
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import UserInfoInputs from "../UserInfoSection/UserInfoInputs";

const LoginModalDetails = ({ onClose = () => {}, type = "login" }) => {
  const [phone, setPhone] = useState("");
  const [otpGenerated, setOtpGenerated] = useState("");
  const [contentType, setContentType] = useState("otp");

  const pathname = usePathname();
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

  const currentModule = useSelector((state) => state.dashboard.currentModule);
  const moduleName = currentModule.toLowerCase();

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

  const getPrimaryClass = () => {
    if (moduleName === "medicine" && category === "medicine")
      return "bg-primaryMedicine";
    if (moduleName === "grocery" && category === "grocery")
      return "bg-primaryGrocery";
    if (moduleName === "food" && category === "food") return "bg-primaryFood";
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
              className={`md:mt-1 px-4 ${getPrimaryClass()} text-white rounded-md w-full`}
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

          {demoOn && (
            <>
              <div className="my-3 flex items-center gap-3 text-xs text-gray-400">
                <span className="h-px flex-1 bg-gray-200" />
                or
                <span className="h-px flex-1 bg-gray-200" />
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={progressing}
                className="w-full rounded-md border border-gray-300 py-2 text-deepGray hover:bg-gray-50 disabled:opacity-60"
              >
                Login as Demo User
              </button>
              <p className="mt-1 text-center text-xs text-gray-400">
                Demo mode: signs in as {DEMO_USER_NAME} ({DEMO_USER_CONTACT}),
                no OTP needed
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="md:border-2 rounded-md p-3 md:p-6">
          <UserInfoInputs
            onClose={onClose}
            type={type}
            getPrimaryClass={getPrimaryClass}
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
