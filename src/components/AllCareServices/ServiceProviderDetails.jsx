"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
  FaStar,
  FaRegClock,
} from "react-icons/fa";
import { SERVICE_PROVIDER_IMAGES } from "@/api-endpoints/api-endpoint";

const ServiceProviderDetails = () => {
  const { currentProviderDetails } = useSelector((state) => state.allCare);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8">
      <div className="mx-auto p-4 max-w-6xl">
        {/* Header with Banner and Basic Info */}
        <div className="relative rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="h-64 md:h-80 w-full relative">
            <Image
              src={`${SERVICE_PROVIDER_IMAGES}/${currentProviderDetails?.provider_banner_app}`}
              alt={`${currentProviderDetails?.provider_name} banner`}
              layout="fill"
              objectFit="cover"
              className="w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>

          <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
            <div className="flex items-end gap-4">
              <div className="bg-white p-2 rounded-full shadow-xl">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {currentProviderDetails?.provider_logo ? (
                    <Image
                      src={`${SERVICE_PROVIDER_IMAGES}/${currentProviderDetails?.provider_logo}`}
                      alt={`${currentProviderDetails?.provider_name} logo`}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  ) : (
                    <CgProfile className="text-gray-400 text-4xl" />
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {currentProviderDetails?.provider_name}
                </h1>
                <div className="flex items-center gap-2 text-white/90 mt-1">
                  <FaMapMarkerAlt className="text-blue-300" />
                  <span>{currentProviderDetails?.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                যোগাযোগ তথ্য
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <CgProfile className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">যোগাযোগ ব্যক্তি</p>
                    <p className="font-medium">
                      {currentProviderDetails?.contact_person_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <FaPhone className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ফোন নম্বর</p>
                    <p className="font-medium">
                      {currentProviderDetails?.alternative_contact_no}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <FaWhatsapp className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">হোয়াটসঅ্যাপ</p>
                    <p className="font-medium">
                      {currentProviderDetails?.contact_no}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Hours Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                সেবার সময়
              </h2>
              <div className="flex items-center gap-3 text-gray-700">
                <FaRegClock className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium">সকাল ৯টা - রাত ১০টা</p>
                  <p className="text-sm text-gray-500">সপ্তাহের ৭ দিন</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Service Details */}
          <div className="md:col-span-2">
            {/* About Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                পরিষেবার বিবরণ
              </h2>
              <div className="prose max-w-none text-gray-700">
                <pre className="whitespace-pre-wrap font-sans">
                  {currentProviderDetails?.service_details}
                </pre>
              </div>
            </div>

            {/* Rating Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                গ্রাহক রেটিং
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-800">4.8</div>
                  <div className="flex justify-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} className="text-yellow-400 text-xl" />
                    ))}
                  </div>
                  <p className="text-gray-500 mt-1">২৪৫ রিভিউ</p>
                </div>
                <div className="flex-1 w-full">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium w-8">
                        {rating}{" "}
                        <FaStar className="inline text-yellow-400 ml-1" />
                      </span>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${(rating / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-10">
                        {((rating / 5) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">আজই সেবা নিন!</h3>
              <p className="opacity-90">দ্রুত সেবা পেতে এখনই কল করুন</p>
            </div>
            <a
              href={`tel:${currentProviderDetails?.contact_no}`}
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-bold text-lg shadow-md transition-all flex items-center gap-2"
            >
              <FaPhone /> {currentProviderDetails?.contact_no}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDetails;

// "use client";

// import React from "react";
// import Image from "next/image";
// import { useSelector } from "react-redux";
// import { CgProfile } from "react-icons/cg";
// import { FaMapMarkerAlt, FaPhone, FaWhatsapp } from "react-icons/fa";
// import { SERVICE_PROVIDER_IMAGES } from "@/api-endpoints/api-endpoint";

// const ServiceProviderDetails = () => {
//   const { currentProviderDetails } = useSelector((state) => state.allCare);

//   return (
//     <div>
//       <div className="mx-auto p-4 max-w-4xl gap-5 bg-gray-50">
//         <div className="md:p-6">
//           <Image
//             src={`${SERVICE_PROVIDER_IMAGES}/${currentProviderDetails?.provider_banner_app}`}
//             alt={`${currentProviderDetails?.provider_name} banner`}
//             width={864}
//             height={432}
//             className="w-full rounded-lg"
//           />
//         </div>

//         <div className="bg-white p-4 rounded-lg shadow-md mt-4">
//           <h2 className="text-lg font-semibold text-primary">
//             {currentProviderDetails?.provider_name}
//           </h2>
//           <p className="flex items-start gap-2 text-gray-700 pt-2">
//             <FaMapMarkerAlt className="text-primary mt-1.5" />
//             {currentProviderDetails?.address}
//           </p>
//         </div>

//         <div className="md:flex gap-5">
//           <div className="bg-white p-4 rounded-lg shadow-md mt-4 w-full">
//             <h2 className="text-lg font-semibold text-primary">যোগাযোগ</h2>
//             <p className="flex items-center gap-2 text-gray-700 mt-2">
//               <CgProfile className="text-primary" />
//               {currentProviderDetails?.contact_person_name}
//             </p>
//             <p className="flex items-center gap-2 text-gray-700">
//               <FaPhone className="text-primary" />
//               {currentProviderDetails?.alternative_contact_no}
//             </p>
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-md mt-4 w-full">
//             <h2 className="text-lg font-semibold text-primary">
//               কাস্টমার সার্ভিস
//             </h2>
//             <p className="flex items-center gap-2 text-gray-700">
//               <FaPhone className="text-primary" />
//               {currentProviderDetails?.contact_no}
//             </p>
//             <p className="flex items-center gap-2 text-gray-700 mt-2">
//               <FaWhatsapp className="text-primary" />
//               {currentProviderDetails?.contact_no}
//             </p>
//           </div>
//         </div>

//         <div className="bg-white p-4 rounded-lg shadow-md mt-4">
//           <h2 className="text-lg font-semibold text-primary">পরিষেবার বিবরণ</h2>
//           <pre className="whitespace-pre-wrap">
//             {currentProviderDetails?.service_details}
//           </pre>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServiceProviderDetails;
