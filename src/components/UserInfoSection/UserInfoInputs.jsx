"use client";
import React, { useEffect, useRef, useState } from "react";
import FloatingInput from "../LoginSection/FloatingInput";
import { useUser } from "@/hooks/fetch-data/useUser";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const UserInfoInputs = ({ phone, onClose, type, getPrimaryClass }) => {
  const { progressing, userInfo, handleDataChange, getOtp, registerUser } =
    useUser();

  const router = useRouter();

  const params = useParams();

  const otpSentRef = useRef(false);
  const [otp, setOtp] = useState("");

  const currentModule = useSelector((state) => state.dashboard.currentModule);

  const module = currentModule.toLowerCase();

  const sendSms = () => {
    // console.log("sendSms triggered");
    const generatedOtp = Math.floor(Math.random() * 8999 + 1000);
    // console.log("Generated OTP:", generatedOtp);
    getOtp({
      contact_no: phone,
      otp: generatedOtp,
      smsKey: "fZtUYT1",
    });
  };

  const resendOTP = () => {
    // console.log("Resending OTP...");
    sendSms();
  };

  const handleLogin = () => {
    // console.log("Handling login...");
    registerUser();
    onClose();
    if (type === "cart") {
      // router.push("/checkout");

      if (module === "food") {
        router.push(`/${module}/store/checkout`);
      } else {
        router.push(`/${module}/${params?.store}/checkout`);
      }
    } else if (type === "login") {
      router.push("/");
    }
  };

  useEffect(() => {
    if (!otpSentRef.current) {
      // console.log("Sending OTP for the first time...");
      sendSms();
      otpSentRef.current = true;
    }
  }, []);

  return (
    <>
      <p className="text-center font-medium text-secondary text-2xl mb-3">
        Your Information
      </p>

      <div className="py-4">
        <FloatingInput
          label="Name"
          id="customer_name"
          value={userInfo?.customer_name || ""}
          onChange={(e) => handleDataChange(e.target.value, "customer_name")}
        />
      </div>

      <div className="py-4">
        <FloatingInput
          label="Address"
          id="customer_address"
          multiline={true}
          value={userInfo?.customer_address || ""}
          onChange={(e) => handleDataChange(e.target.value, "customer_address")}
        />
      </div>

      <div className="py-4">
        <FloatingInput
          label="Alternative number"
          id="alternative_contact_no"
          value={userInfo?.alternative_contact_no || ""}
          onChange={(e) =>
            handleDataChange(e.target.value, "alternative_contact_no")
          }
        />
      </div>

      <div className="py-4">
        <FloatingInput
          label="Enter OTP"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleLogin}
          className={`mt-4 px-4 py-2 ${getPrimaryClass()} text-white rounded-md w-full`}
        >
          LOGIN
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={resendOTP}
          className="text-secondary underline"
          disabled={progressing}
        >
          Resend OTP
        </button>
      </div>
    </>
  );
};

export default UserInfoInputs;
