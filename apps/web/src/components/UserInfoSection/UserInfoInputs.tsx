"use client";

import notify from "@/utils/notify";
import React, { useEffect, useMemo, useState } from "react";
import RoundLoader from "@/components/shared/RoundLoader/BarsLoader";
import OtpInput from "../LoginSection/OtpInput";
import { useAfterLogin } from "@/hooks/useAfterLogin";
import { TextField } from "@/components/shared/Checkout/CheckoutUI";
import { PrimaryButton } from "@/components/shared/CartUI/CartUI";
import { useZodForm } from "@/lib/forms/useZodForm";
import {
  loginDetailsSchema,
  toastFirstError,
  type LoginDetailsForm,
  type LoginStage,
  type ProfileForm,
} from "@/lib/forms/customerForms";

const ButtonSpinner = () => (
  <span
    aria-hidden="true"
    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
  />
);

/** The profile fields this form edits (prefilled from useUser's userInfo). */
export type ProfileInfo = Partial<ProfileForm>;

type Props = {
  onClose?: () => void;
  type?: string;
  redirectTo?: string;
  phone: string;
  userInfo: ProfileInfo;
  otpGenerated?: string;
  sendSms: () => void;
  progressing: boolean;
  /** Saves the account with these details; resolves to whether it was saved. */
  registerUser: (profile: ProfileForm, successMessage: string) => Promise<boolean>;
  verifyOtp?: (contactNo: string, otp: string) => Promise<{ ok: boolean; isNew: boolean }>;
};

const FIELD_ORDER: (keyof LoginDetailsForm)[] = ["customer_name", "customer_address", "otp"];

const UserInfoInputs = ({
  onClose,
  type = "login",
  redirectTo,
  phone,
  userInfo,
  otpGenerated,
  sendSms,
  progressing,
  registerUser,
  // Live login (new API): the code is checked on the server first; only new
  // accounts then fill in name and address.
  verifyOtp,
}: Props) => {
  const live = Boolean(verifyOtp);
  const [stage, setStage] = useState<LoginStage>(live ? "code" : "all");
  const showCode = stage !== "profile";
  const showProfile = stage !== "code";

  const schema = useMemo(() => loginDetailsSchema(stage), [stage]);
  const form = useZodForm(schema, {
    defaultValues: {
      customer_name: userInfo?.customer_name || "",
      customer_address: userInfo?.customer_address || "",
      alternative_contact_no: userInfo?.alternative_contact_no || "",
      otp: "",
    },
  });
  const { errors } = form.formState;
  const otp = form.watch("otp");

  // The account found by send-otp / verify-otp fills in what the visitor
  // has not typed yet.
  const { customer_name = "", customer_address = "", alternative_contact_no = "" } = userInfo ?? {};
  const { reset, getValues } = form;
  useEffect(() => {
    reset(
      { ...getValues(), customer_name, customer_address, alternative_contact_no },
      { keepDirtyValues: true, keepErrors: true },
    );
  }, [reset, getValues, customer_name, customer_address, alternative_contact_no]);

  const afterLogin = useAfterLogin(type, onClose, redirectTo);

  const resendOTP = () => {
    sendSms();
  };

  const submit = async (values: LoginDetailsForm) => {
    if (stage === "code") {
      // The "code" stage only exists in live login, which passes verifyOtp.
      const { ok, isNew } = await verifyOtp!(phone, values.otp);
      if (!ok) return;
      if (isNew) setStage("profile");
      else afterLogin();
      return;
    }

    if (!live && otpGenerated !== values.otp) {
      return notify.error("The verification code is incorrect. Please try again.");
    }

    const { customer_name, customer_address, alternative_contact_no } = values;
    const success_message = "Logged in successfully";
    const loggedIn = await registerUser(
      { customer_name, customer_address, alternative_contact_no },
      success_message,
    );
    if (!loggedIn) return;

    afterLogin();
  };

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit(submit, toastFirstError<LoginDetailsForm>(FIELD_ORDER))();
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
              {stage === "profile" ? "Tell us about you" : "Verify and finish"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {stage === "profile" ? (
                "Your number is verified. Add your name and delivery address."
              ) : phone ? (
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

          {showCode && (
          <div>
            <span className="mb-2 block text-sm font-medium text-gray-700">
              One-time code
            </span>
            <OtpInput
              value={otp}
              onChange={(code) =>
                form.setValue("otp", code, { shouldValidate: form.formState.isSubmitted })
              }
              length={live ? 6 : otpGenerated?.length || 4}
            />
            {errors.otp?.message && (
              <span role="alert" className="mt-1 block text-center text-sm text-[#D92D20]">
                {errors.otp.message}
              </span>
            )}
            <p className="mt-2 text-center text-sm text-gray-500">
              Didn&apos;t get it?{" "}
              <button
                type="button"
                onClick={resendOTP}
                disabled={progressing}
                className="inline-flex min-h-10 items-center font-semibold text-primary hover:underline disabled:opacity-60 dark:text-[#7FB2FF]"
              >
                Resend OTP
              </button>
            </p>
          </div>
          )}

          {showProfile && (
          <div className="space-y-4 border-t border-gray-100 pt-5">
            <p className="text-sm font-semibold text-gray-900">
              Your information
            </p>
            <TextField
              label="Name"
              id="customer_name"
              required
              autoComplete="name"
              error={errors.customer_name?.message}
              {...form.register("customer_name")}
            />
            <TextField
              label="Address"
              id="customer_address"
              required
              multiline
              autoComplete="street-address"
              error={errors.customer_address?.message}
              {...form.register("customer_address")}
            />
            <TextField
              label="Alternative number"
              id="alternative_contact_no"
              type="tel"
              inputMode="tel"
              placeholder="Optional"
              {...form.register("alternative_contact_no")}
            />
          </div>
          )}

          <PrimaryButton onClick={handleLogin} disabled={progressing}>
            {progressing ? (
              <>
                <ButtonSpinner />
                Please wait
              </>
            ) : stage === "code" ? (
              "Verify"
            ) : stage === "profile" ? (
              "Save and continue"
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
