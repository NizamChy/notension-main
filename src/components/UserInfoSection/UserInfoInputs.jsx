"use client";

import toast from "react-hot-toast";
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
  // const { currentUserLocation } = useSelector((state) => state.user);

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
      return toast("নাম কমপক্ষে ৩ অক্ষরের এবং সর্বাধিক ৫০ অক্ষরের হতে পারে!", {
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

    if (userInfo?.customer_address < 5) {
      return toast(
        "ঠিকানা কমপক্ষে ৫ অক্ষরের এবং সর্বোচ্চ ২০০ অক্ষরের মধ্যে হতে হবে!",
        {
          style: {
            border: "1px solid #FC8F1E",
          },
          icon: "ℹ️",
          iconTheme: {
            primary: "#FC8F1E",
            secondary: "#FFFAEE",
          },
        }
      );
    }

    if (otp.length < 1) {
      return toast("অনুগ্রহ করে OTP প্রদান করুন!", {
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

    if (otpGenerated !== otp) {
      return toast.error("OTP টি সঠিক হয়নি!", {
        style: {
          border: "1px solid #FC8F1E",
        },

        iconTheme: {
          primary: "#FC8F1E",
          secondary: "#FFFAEE",
        },
      });
    }

    registerUser();

    setTimeout(() => {
      onClose();
      if (!progressing) {
        if (type === "cart") {
          if (module === "food") {
            router.push(
              `/${module}/store/${params?.store}/${params?.storeId}/${params?.customStoreId}/checkout`
            );
          } else {
            router.push(
              `/${module}/${params?.store}/${params?.storeId}/${params?.customStoreId}/checkout`
            );
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
        } else if (type === "appointment") {
          router.push("/medical-services/doctor/book-appointment");
        }
      }
    }, 1000);
  };

  useEffect(() => {
    if (!otpSentRef.current) {
      // console.log("Sending OTP for the first time...");
      sendSms();
      otpSentRef.current = true;
    }
  }, []);

  // console.log("otpGenerated", otpGenerated);
  // console.log("userInfo from login", userInfo);
  // console.log("currentUserLocation", currentUserLocation);

  return (
    <>
      <p className="text-center font-medium text-secondary text-2xl mb-3">
        Your Information
      </p>

      <div className="py-2 md:py-4">
        <FloatingInput
          label="Name"
          id="customer_name"
          value={userInfo?.customer_name || ""}
          onChange={(e) => handleDataChange(e.target.value, "customer_name")}
        />
      </div>

      <div className="py-2 md:py-4">
        <FloatingInput
          label="Address"
          id="customer_address"
          multiline={true}
          value={userInfo?.customer_address || ""}
          onChange={(e) => handleDataChange(e.target.value, "customer_address")}
        />
      </div>

      <div className="py-2 md:py-4">
        <FloatingInput
          label="Alternative number"
          id="alternative_contact_no"
          value={userInfo?.alternative_contact_no || ""}
          onChange={(e) =>
            handleDataChange(e.target.value, "alternative_contact_no")
          }
        />
      </div>

      <div className="py-2 md:py-4">
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
