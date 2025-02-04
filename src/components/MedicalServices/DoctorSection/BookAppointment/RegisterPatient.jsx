"use client";

import { toast } from "react-toastify";
import React, { useState } from "react";
import { usePatient } from "@/hooks/fetch-data/usePatient";

const RegisterPatient = () => {
  const [formData, setFormData] = useState({
    patient_name: "",
    contact: "",
    alternative_contact: "",
    date_of_birth: "",
    gender: "",
    email: "",
    address: "",
  });

  const { registerPatient, progressing } = usePatient();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData?.patient_name?.length < 3) {
      return toast.error(
        "নাম কমপক্ষে ৩ অক্ষরের এবং সর্বাধিক ৯৯ অক্ষরের হতে পারে!"
      );
    } else if (formData?.contact?.length < 11) {
      return toast.error("মোবাইল নম্বরটি অবশ্যই সঠিক ১১টি ডিজিট হতে হবে!");
    }

    registerPatient(formData);

    setTimeout(() => {
      if (!progressing) {
        setFormData({
          patient_name: "",
          contact: "",
          alternative_contact: "",
          date_of_birth: "",
          gender: "",
          email: "",
          address: "",
        });
      }
    }, 300);
  };

  return (
    <div className="flex items-center justify-center p-8 md:p-12">
      <div>
        <p className="text-sm text-[#07074D] md:max-w-[550px] text-justify">
          ## রোগীর জন্ম তারিখ নিশ্চিত করা কেন গুরুত্বপূর্ণ? রোগীর যত্নের সাথে
          সঠিক চিকিৎসা, ওষুধ এবং সম্ভাব্য সমস্যা এড়াতে রোগীর বয়স গুরুত্বপূর্ণ।
          রোগীর বয়সও বহুলাংশে নির্ধারণ করতে পারে যে ধরনের মেডিকেল পরীক্ষাগুলি
          প্রয়োজনীয় এবং ফলাফলের জন্য প্রভাব রয়েছে। বয়স্ক রোগীদের আরও গভীরভাবে
          পরীক্ষার প্রয়োজন হতে পারে।
        </p>
        <div className="mx-auto w-full max-w-[550px] bg-white p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="patient_name"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Patient Name (রোগীর নাম) <span className="text-red-600">*</span>
              </label>
              <input
                required
                type="text"
                name="patient_name"
                id="patient_name"
                placeholder="Patient Name"
                value={formData.patient_name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Contact (মোবাইল নাম্বার){" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="contact"
                  id="contact"
                  placeholder="Contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div>
                <label
                  htmlFor="alternative_contact"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Alt. Contact (বিকল্প নাম্বার)
                </label>
                <input
                  type="text"
                  name="alternative_contact"
                  id="alternative_contact"
                  placeholder="Alternative Contact"
                  value={formData.alternative_contact}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>

            <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date_of_birth"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Date of Birth (জন্ম তারিখ)
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Gender (লিঙ্গ)
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Email (ইমেইল)
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="address"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Address (ঠিকানা)
              </label>
              <textarea
                name="address"
                id="address"
                placeholder="Enter your address"
                rows="4"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none transition-all hover:bg-[#5a54d1]"
                disabled={progressing}
              >
                {progressing ? "Registering..." : "Register Patient"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPatient;
