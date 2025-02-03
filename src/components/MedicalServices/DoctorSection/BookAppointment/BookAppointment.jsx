"use client";

import React, { useState } from "react";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    contact: "",
    alternativeContact: "",
    dob: "",
    gender: "",
    email: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("address:", formData.address);
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
            {/* Patient Name */}
            <div className="mb-5">
              <label
                htmlFor="patientName"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Patient Name (রোগীর নাম) <span className="text-red-600">*</span>
              </label>
              <input
                required
                type="text"
                name="patientName"
                id="patientName"
                placeholder="Patient Name"
                value={formData.patientName}
                onChange={handleInputChange}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>

            {/* Contact & Alternative Contact */}
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
                  htmlFor="alternativeContact"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Alt. Contact (বিকল্প নাম্বার)
                </label>
                <input
                  type="text"
                  name="alternativeContact"
                  id="alternativeContact"
                  placeholder="Alternative Contact"
                  value={formData.alternativeContact}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>

            {/* Date of Birth & Gender */}
            <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="dob"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Date of Birth (জন্ম তারিখ)
                </label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  value={formData.dob}
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

            {/* Email */}
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

            {/* Address */}
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

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none transition-all hover:bg-[#5a54d1]"
              >
                Register Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
