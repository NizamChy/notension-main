"use client";

import React from "react";
import { LuInfo, LuUserPlus } from "react-icons/lu";
import { usePatients } from "@/hooks/healthCare/usePatients";
import { TextField } from "@/components/shared/Checkout/CheckoutUI";
import { PrimaryButton } from "@/components/shared/CartUI/CartUI";
import { useZodForm } from "@/lib/forms/useZodForm";
import {
  patientFormSchema,
  toastFirstError,
  type PatientForm,
} from "@/lib/forms/customerForms";

const EMPTY_PATIENT: PatientForm = {
  patient_name: "",
  contact: "",
  alternative_contact: "",
  date_of_birth: "",
  gender: "",
  email: "",
  address: "",
};

const selectClass =
  "block h-[46px] w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 transition focus:border-primary/50 focus:outline-hidden focus:ring-4 focus:ring-[#0C3F8E]/10";

type Props = {
  setShowForm: (show: boolean) => void;
};

// The only caller always passes setShowForm (the old `= true` default could
// not be called, so it is dropped).
const RegisterPatient = ({ setShowForm }: Props) => {
  const form = useZodForm(patientFormSchema, { defaultValues: EMPTY_PATIENT });
  const { errors } = form.formState;

  const { register: registerPatient, progressing } = usePatients();

  const submit = async (values: PatientForm) => {
    const registered = await registerPatient(values);

    // Keep the form filled in if registration failed so the user can retry.
    if (registered) {
      form.reset(EMPTY_PATIENT);
      setShowForm(false);
    }
  };

  const handleSubmit = form.handleSubmit(
    submit,
    toastFirstError<PatientForm>(["patient_name", "contact"]),
  );

  return (
    <div>
      <div className="mb-5 flex gap-3 rounded-xl border border-primary/15 bg-primary/4 p-4 text-sm leading-relaxed text-gray-700">
        <LuInfo className="mt-0.5 shrink-0 text-base text-primary dark:text-[#7FB2FF]" />
        <p>
          রোগীর জন্ম তারিখ নিশ্চিত করা কেন গুরুত্বপূর্ণ? রোগীর যত্নের সাথে সঠিক
          চিকিৎসা, ওষুধ এবং সম্ভাব্য সমস্যা এড়াতে রোগীর বয়স গুরুত্বপূর্ণ। রোগীর
          বয়সও বহুলাংশে নির্ধারণ করতে পারে যে ধরনের মেডিকেল পরীক্ষাগুলি
          প্রয়োজনীয় এবং ফলাফলের জন্য প্রভাব রয়েছে। বয়স্ক রোগীদের আরও গভীরভাবে
          পরীক্ষার প্রয়োজন হতে পারে।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Patient name (রোগীর নাম)"
          required
          type="text"
          id="patient_name"
          placeholder="Full name"
          autoComplete="name"
          error={errors.patient_name?.message}
          {...form.register("patient_name")}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Mobile number (মোবাইল নাম্বার)"
            required
            type="tel"
            inputMode="numeric"
            id="contact"
            placeholder="01XXXXXXXXX"
            autoComplete="tel"
            error={errors.contact?.message}
            {...form.register("contact")}
          />
          <TextField
            label="Alternative number (বিকল্প নাম্বার)"
            type="tel"
            inputMode="numeric"
            id="alternative_contact"
            placeholder="Optional"
            {...form.register("alternative_contact")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Date of birth (জন্ম তারিখ)"
            type="date"
            id="date_of_birth"
            {...form.register("date_of_birth")}
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
              Gender (লিঙ্গ)
            </span>
            <select
              id="gender"
              className={selectClass}
              {...form.register("gender")}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        <TextField
          label="Email (ইমেইল)"
          type="email"
          id="email"
          placeholder="Optional"
          autoComplete="email"
          {...form.register("email")}
        />

        <TextField
          label="Address (ঠিকানা)"
          multiline
          id="address"
          placeholder="House, road, area"
          {...form.register("address")}
        />

        <PrimaryButton type="submit" disabled={progressing}>
          <LuUserPlus className="text-base" />
          {progressing ? "Registering..." : "Register patient"}
        </PrimaryButton>
      </form>
    </div>
  );
};

export default RegisterPatient;
