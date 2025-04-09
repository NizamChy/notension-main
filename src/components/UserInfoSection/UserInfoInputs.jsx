"use client";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useUser } from "@/hooks/fetch-data/useUser";
import { useParams, useRouter } from "next/navigation";
import FloatingInput from "../LoginSection/FloatingInput";
import React, { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const UserInfoInputs = ({
  phone,
  onClose,
  type = "login",
  getPrimaryClass,
}) => {
  const [otp, setOtp] = useState("");
  const [otpGenerated, setOtpGenerated] = useState("");

  const { progressing, userInfo, handleDataChange, getOtp, registerUser } =
    useUser();

  const router = useRouter();
  const params = useParams();
  const otpSentRef = useRef(false);

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

    setOtpGenerated(generatedOtp.toString());
  };

  const resendOTP = () => {
    // console.log("Resending OTP...");
    sendSms();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // console.log("Handling login...");

    if (userInfo?.customer_name < 3) {
      return toast.info(
        "নাম কমপক্ষে ৩ অক্ষরের এবং সর্বাধিক ৯৯ অক্ষরের হতে পারে!",
        {
          position: "top-center",
        }
      );
    }

    if (otp.length < 1) {
      return toast.info("Please provide valid OTP!", {
        position: "top-center",
      });
    }

    if (otpGenerated !== otp) {
      return toast.error("OTP does not mached!", {
        position: "top-center",
      });
    }

    registerUser();
    onClose();

    if (type === "cart") {
      if (module === "food") {
        router.push(`/${module}/store/checkout`);
      } else {
        router.push(`/${module}/${params?.store}/checkout`);
      }
    } else if (type === "login") {
      router.push("/");
    } else if (type === "doctor") {
      router.push("/medical-services/doctor");
    } else if (type === "eyeCareCenter") {
      router.push("/medical-services/eye-care-center");
    } else if (type === "dentalCareCenter") {
      router.push("/medical-services/dental-care-center");
    } else if (type === "hospital") {
      router.push("/medical-services/hospital");
    } else if (type === "diagnostic") {
      router.push("/medical-services/diagnostic");
    } else if (type === "medicalService") {
      router.push("/medical-services/medical-service");
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
          onClick={(e) => handleLogin(e)}
          className={`mt-4 px-4 ${getPrimaryClass()} text-white rounded-md w-full`}
          disabled={progressing}
        >
          {/* {progressing ? "Please wait..." : "LOGIN"}  */}
          {progressing ? (
            <div className="flex justify-center items-center">
              <p>Please wait</p>
              <DotLottieReact
                src="https://lottie.host/6958d316-ea05-4122-9dff-1d526f59b3ca/ZilAm5yZWu.lottie"
                loop
                autoplay
                className="size-10"
              />
            </div>
          ) : (
            <>
              <p className="py-2">LOGIN</p>
            </>
          )}
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={resendOTP}
          className="text-secondary underline font-medium"
          disabled={progressing}
        >
          Resend OTP
        </button>
      </div>
    </>
  );
};

export default UserInfoInputs;
