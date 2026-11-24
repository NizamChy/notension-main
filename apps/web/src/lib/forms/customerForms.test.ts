import { describe, expect, it } from "vitest";
import {
  cleanPhone,
  fashionCheckoutSchema,
  loginDetailsSchema,
  patientFormSchema,
  phoneLoginSchema,
  profileFormSchema,
} from "./customerForms";

const firstMessage = (r: { success: boolean; error?: { issues: { message: string }[] } }) =>
  r.success ? undefined : r.error?.issues[0]?.message;

describe("customer form schemas keep the old rules and messages", () => {
  it("login number", () => {
    expect(firstMessage(phoneLoginSchema.safeParse({ phone: "" }))).toBe("Please enter your mobile number.");
    expect(firstMessage(phoneLoginSchema.safeParse({ phone: "0171" }))).toBe(
      "Please enter a valid 11-digit mobile number.",
    );
    expect(phoneLoginSchema.safeParse({ phone: "+8801711000000" }).success).toBe(true);
    expect(cleanPhone(" +88 017-1100 0000 ")).toBe("01711000000");
  });

  it("profile: trimmed name 3-50, address 5-200, values kept as typed", () => {
    const ok = { customer_name: " Rina ", customer_address: "Dhaka 1", alternative_contact_no: "" };
    expect(profileFormSchema.parse(ok)).toEqual(ok);
    expect(firstMessage(profileFormSchema.safeParse({ ...ok, customer_name: "  ab  " }))).toBe(
      "Name must be between 3 and 50 characters.",
    );
    expect(firstMessage(profileFormSchema.safeParse({ ...ok, customer_address: "x".repeat(201) }))).toBe(
      "Address must be between 5 and 200 characters.",
    );
  });

  it("login details per stage", () => {
    const empty = { customer_name: "", customer_address: "", alternative_contact_no: "", otp: "" };
    expect(loginDetailsSchema("code").safeParse({ ...empty, otp: "123456" }).success).toBe(true);
    expect(firstMessage(loginDetailsSchema("code").safeParse({ ...empty, otp: "12345" }))).toBe(
      "Please enter the 6-digit verification code.",
    );
    const details = { ...empty, customer_name: "Rina", customer_address: "Dhaka 1" };
    expect(loginDetailsSchema("profile").safeParse(details).success).toBe(true);
    expect(firstMessage(loginDetailsSchema("all").safeParse(details))).toBe("Please enter the verification code.");
  });

  it("patient and fashion checkout", () => {
    const patient = {
      patient_name: "Rin",
      contact: "01711000000",
      alternative_contact: "",
      date_of_birth: "",
      gender: "",
      email: "",
      address: "",
    };
    expect(patientFormSchema.safeParse(patient).success).toBe(true);
    expect(firstMessage(patientFormSchema.safeParse({ ...patient, patient_name: "Ri" }))).toBe(
      "Name must be between 3 and 99 characters.",
    );
    expect(firstMessage(patientFormSchema.safeParse({ ...patient, contact: "0171" }))).toBe(
      "Please enter a valid 11-digit mobile number.",
    );
    expect(
      firstMessage(fashionCheckoutSchema.safeParse({ name: "A", phone: "", address: "B", paymentOption: "Cash" })),
    ).toBe("Please fill in all required fields.");
  });
});
