"use client";

import toast from "react-hot-toast";
import { isLengthBetween } from "@/utils/validation";
import React, { useState } from "react";
import RoundLoader from "../common/RoundLoader";
import OtpInput from "../LoginSection/OtpInput";
import { useAfterLogin } from "@/hooks/useAfterLogin";
import { TextField } from "@/components/shared/Checkout/CheckoutUI";
import { PrimaryButton } from "@/components/shared/CartUI/CartUI";

const ButtonSpinner = () => (
  <span
    aria-hidden="true"
    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
  />
);

const UserInfoInputs = ({
  onClose,
  type = "login",
  phone,
  userInfo,
  otpGenerated,
  sendSms,
  progressing,
  handleDataChange,
  registerUser,
}) => {
  const [otp, setOtp] = useState("");

  const afterLogin = useAfterLogin(type, onClose);

  const resendOTP = () => {
    sendSms();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLengthBetween(userInfo?.customer_name, 3, 50)) {
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

    if (!isLengthBetween(userInfo?.customer_address, 5, 200)) {
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
      return toast.error("OTP টি সঠিক হয়নি!", {
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
    const loggedIn = await registerUser(success_message);
    if (!loggedIn) return;

    afterLogin();
  };

  return (
    <>
      {progressing ? (
        <div className="flex min-h-80 items-center justify-center rounded-2xl bg-gray-50">
          <RoundLoader />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="pr-6">
            <h2 className="text-lg font-bold tracking-tight text-gray-900 md:text-xl">
              Verify and finish
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {phone ? (
                <>
                  We sent a code to{" "}
                  <span className="font-semibold tabular-nums text-gray-900">
                    {phone}
                  </span>
                  .
                </>
              ) : (
                "Enter the code we sent to your phone."
              )}
            </p>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-gray-700">
              One-time code
            </span>
            <OtpInput
              value={otp}
              onChange={setOtp}
              length={otpGenerated?.length || 4}
            />
            <p className="mt-2 text-center text-sm text-gray-500">
              Didn&apos;t get it?{" "}
              <button
                type="button"
                onClick={resendOTP}
                disabled={progressing}
                className="inline-flex min-h-10 items-center font-semibold text-[#0C3F8E] hover:underline disabled:opacity-60 dark:text-[#7FB2FF]"
              >
                Resend OTP
              </button>
            </p>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-5">
            <p className="text-sm font-semibold text-gray-900">
              Your information
            </p>
            <TextField
              label="Name"
              id="customer_name"
              required
              autoComplete="name"
              value={userInfo?.customer_name || ""}
              onChange={(e) =>
                handleDataChange(e.target.value, "customer_name")
              }
            />
            <TextField
              label="Address"
              id="customer_address"
              required
              multiline
              autoComplete="street-address"
              value={userInfo?.customer_address || ""}
              onChange={(e) =>
                handleDataChange(e.target.value, "customer_address")
              }
            />
            <TextField
              label="Alternative number"
              id="alternative_contact_no"
              type="tel"
              inputMode="tel"
              placeholder="Optional"
              value={userInfo?.alternative_contact_no || ""}
              onChange={(e) =>
                handleDataChange(e.target.value, "alternative_contact_no")
              }
            />
          </div>

          <PrimaryButton onClick={(e) => handleLogin(e)} disabled={progressing}>
            {progressing ? (
              <>
                <ButtonSpinner />
                Please wait
              </>
            ) : (
              "Log in"
            )}
          </PrimaryButton>
        </div>
      )}
    </>
  );
};

export default UserInfoInputs;
