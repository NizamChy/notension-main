"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import RoundLoader from "../shared/Loader/RoundLoader";
import FloatingInput from "../LoginSection/FloatingInput";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const UserInfoInputs = ({
  onClose,
  type = "login",
  userInfo,
  otpGenerated,
  sendSms,
  progressing,
  handleDataChange,
  registerUser,
}) => {
  const [otp, setOtp] = useState("");

  const resendOTP = () => {
    sendSms();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();

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

    const success_message = "Login successful";
    registerUser(success_message);

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <>
      {progressing ? (
        <div className="flex justify-center items-center min-h-80 text-mediumGray bg-gray-100 animate-pulse rounded-md">
          <RoundLoader />
        </div>
      ) : (
        <>
          <p className="text-center font-medium text-primary text-2xl mb-3">
            Your Information
          </p>
          <div className="py-2 md:py-4">
            <FloatingInput
              label="Name"
              id="customer_name"
              value={userInfo?.customer_name || ""}
              onChange={(e) =>
                handleDataChange(e.target.value, "customer_name")
              }
            />
          </div>
          <div className="py-2 md:py-4">
            <FloatingInput
              label="Address"
              id="customer_address"
              multiline={true}
              value={userInfo?.customer_address || ""}
              onChange={(e) =>
                handleDataChange(e.target.value, "customer_address")
              }
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
              className={`mt-4 px-4 bg-primary text-white rounded-md w-full`}
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
              className="text-primary underline font-medium"
              disabled={progressing}
            >
              Resend OTP
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default UserInfoInputs;
