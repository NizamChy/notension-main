import { z } from "zod";
import type { FieldErrors, FieldValues } from "react-hook-form";
import notify from "@/utils/notify";

// Zod schemas for the customer forms. Messages and limits are the ones the
// forms showed as toasts before. Checks look at the trimmed text but the
// values are sent as typed, as before.

/** True when the trimmed text length is within [min, max]. */
const lengthBetween = (min: number, max: number, message: string) =>
  z.string().refine((v) => {
    const length = v.trim().length;
    return length >= min && length <= max;
  }, message);

/** The login form's number; cleaned (spaces, dashes, +88) before sending. */
export const phoneLoginSchema = z.object({
  phone: z
    .string()
    .min(1, "Please enter your mobile number.")
    .min(11, "Please enter a valid 11-digit mobile number."),
});
export type PhoneLoginForm = z.infer<typeof phoneLoginSchema>;

/** "01 7-11 22 33 44" or "+8801711223344" → "01711223344". */
export const cleanPhone = (phone: string) =>
  phone.trim().replace(/\s+/g, "").replace(/[-]/g, "").replace(/^\+?88/, "");

const profileFields = {
  customer_name: lengthBetween(3, 50, "Name must be between 3 and 50 characters."),
  customer_address: lengthBetween(5, 200, "Address must be between 5 and 200 characters."),
  alternative_contact_no: z.string(),
};

/** Name, address and backup number (update address, and new accounts). */
export const profileFormSchema = z.object(profileFields);
export type ProfileForm = z.infer<typeof profileFormSchema>;

/**
 * The login step after the number: "code" checks only the code (new API,
 * 6 digits), "profile" only the details, "all" both (old flow; whether the
 * code matches is checked on submit).
 */
export type LoginStage = "code" | "profile" | "all";
export const loginDetailsSchema = (stage: LoginStage) =>
  stage === "code"
    ? z.object({
        customer_name: z.string(),
        customer_address: z.string(),
        alternative_contact_no: z.string(),
        otp: z.string().min(6, "Please enter the 6-digit verification code."),
      })
    : z.object({
        ...profileFields,
        otp: stage === "all" ? z.string().min(1, "Please enter the verification code.") : z.string(),
      });
export type LoginDetailsForm = ProfileForm & { otp: string };

/** Register a patient (book an appointment). */
export const patientFormSchema = z.object({
  patient_name: z.string().min(3, "Name must be between 3 and 99 characters."),
  contact: z.string().min(11, "Please enter a valid 11-digit mobile number."),
  alternative_contact: z.string(),
  date_of_birth: z.string(),
  gender: z.string(),
  email: z.string(),
  address: z.string(),
});
export type PatientForm = z.infer<typeof patientFormSchema>;

const required = z.string().min(1, "Please fill in all required fields.");
/** Fashion checkout: delivery details and payment method. */
export const fashionCheckoutSchema = z.object({
  name: required,
  phone: required,
  address: required,
  paymentOption: z.string(),
});
export type FashionCheckoutForm = z.infer<typeof fashionCheckoutSchema>;

/**
 * handleSubmit's invalid handler: toasts the first error, in field order,
 * as the forms did before they showed errors under the fields.
 */
export const toastFirstError =
  <T extends FieldValues>(order: (keyof T & string)[]) =>
  (errors: FieldErrors<T>) => {
    const field = order.find((name) => errors[name]);
    const message = field ? errors[field]?.message : undefined;
    if (typeof message === "string") notify.warning(message);
  };
