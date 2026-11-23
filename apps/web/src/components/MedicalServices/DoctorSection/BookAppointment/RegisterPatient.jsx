"use client";

import React, { useState } from "react";
import { LuInfo, LuUserPlus } from "react-icons/lu";
import { usePatients } from "@/hooks/healthCare/usePatients";
import notify from "@/utils/notify";
import { TextField } from "@/components/shared/Checkout/CheckoutUI";
import { PrimaryButton } from "@/components/shared/CartUI/CartUI";

const selectClass =
  "block h-[46px] w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 transition focus:border-primary/50 focus:outline-hidden focus:ring-4 focus:ring-[#0C3F8E]/10";

const RegisterPatient = ({ setShowForm = true }) => {
  const [formData, setFormData] = useState({
    patient_name: "",
    contact: "",
    alternative_contact: "",
    date_of_birth: "",
    gender: "",
    email: "",
    address: "",
  });

  const { register: registerPatient, progressing } = usePatients();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData?.patient_name?.length < 3) {
      return notify.warning("Name must be between 3 and 99 characters.");
    } else if (formData?.contact?.length < 11) {
      return notify.warning("Please enter a valid 11-digit mobile number.");
    }

    const registered = await registerPatient(formData);

    // Keep the form filled in if registration failed so the user can retry.
    if (registered) {
      setFormData({
        patient_name: "",
        contact: "",
        alternative_contact: "",
        date_of_birth: "",
        gender: "",
        email: "",
        address: "",
      });

      setShowForm(false);
    }
  };

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
          name="patient_name"
          id="patient_name"
          placeholder="Full name"
          autoComplete="name"
          value={formData.patient_name}
          onChange={handleInputChange}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Mobile number (মোবাইল নাম্বার)"
            required
            type="tel"
            inputMode="numeric"
            name="contact"
            id="contact"
            placeholder="01XXXXXXXXX"
            autoComplete="tel"
            value={formData.contact}
            onChange={handleInputChange}
          />
          <TextField
            label="Alternative number (বিকল্প নাম্বার)"
            type="tel"
            inputMode="numeric"
            name="alternative_contact"
            id="alternative_contact"
            placeholder="Optional"
            value={formData.alternative_contact}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Date of birth (জন্ম তারিখ)"
            type="date"
            name="date_of_birth"
            id="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
              Gender (লিঙ্গ)
            </span>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={selectClass}
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
          name="email"
          id="email"
          placeholder="Optional"
          autoComplete="email"
          value={formData.email}
          onChange={handleInputChange}
        />

        <TextField
          label="Address (ঠিকানা)"
          multiline
          name="address"
          id="address"
          placeholder="House, road, area"
          value={formData.address}
          onChange={handleInputChange}
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
