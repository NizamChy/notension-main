"use client";

import Image from "next/image";
import Loader from "../common/Loader";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAllCareService } from "@/hooks/fetch-data/useAllCareService";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaRegClock,
} from "react-icons/fa";
import { SERVICE_PROVIDER_IMAGES } from "@/api-endpoints/api-endpoint";

// Returns a finite number, or null for missing / non-numeric values.
const toNumberOrNull = (value) => {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const ServiceProviderDetails = () => {
  const [popularList, setPopularList] = useState([]);
  const [nearestList, setNearestList] = useState([]);
  const [requested, setRequested] = useState(false);

  const searchParams = useSearchParams();
  const providerId = searchParams.get("id");
  const serviceId = searchParams.get("serviceId");

  const { exploreCareProvider, progressing } = useAllCareService();
  const { currentProviderDetails: reduxProvider } = useSelector(
    (state) => state.allCare
  );
  const districtId = useSelector((state) => state.user.districtId);

  // Redux has the provider when it was opened from a list (and for old links
  // without an id). A direct link (or a reload with cleared state) looks it
  // up in the service's provider list instead (no provider-by-id endpoint).
  const hasReduxProvider = !providerId || reduxProvider?._id === providerId;
  const currentProviderDetails = hasReduxProvider
    ? reduxProvider
    : [...popularList, ...nearestList].find(
        (provider) => provider?._id === providerId
      );

  useEffect(() => {
    if (hasReduxProvider || !serviceId) return;
    setRequested(true);
    return exploreCareProvider(serviceId, setPopularList, setNearestList, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerId, serviceId, hasReduxProvider, districtId]);

  const rating = toNumberOrNull(currentProviderDetails?.rating);
  const hasRating = rating != null && rating > 0 && rating <= 5;
  const reviewCount = toNumberOrNull(currentProviderDetails?.total_reviews);

  if (!currentProviderDetails && (progressing || (serviceId && !requested))) {
    return <Loader />;
  }

  if (!currentProviderDetails?._id) {
    return (
      <p className="mx-auto max-w-6xl px-4 py-16 text-center text-gray-600">
        Service provider not found.
      </p>
    );
  }

  return (
    <div className="min-h-content bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header with Banner and Basic Info */}
        {/* Banner images often carry their own text, so the name/address
            sit in a bar under the banner instead of on top of it. */}
        <div className="rounded-xl overflow-hidden shadow-lg bg-white mb-6 md:mb-8">
          <div className="aspect-[2/1] sm:aspect-[5/2] lg:aspect-[3/1] max-h-80 w-full relative bg-gray-100">
            <Image
              src={`${SERVICE_PROVIDER_IMAGES}/${currentProviderDetails?.provider_banner_app}`}
              alt={`${currentProviderDetails?.provider_name} banner`}
              fill
              sizes="(max-width: 1280px) 100vw, 1216px"
              className="object-cover"
            />
          </div>

          <div className="relative px-4 sm:px-6 md:px-8 pb-4 md:pb-6">
            <div className="flex items-start gap-3 md:gap-4 -mt-8 md:-mt-10">
              <div className="shrink-0 bg-white p-1.5 md:p-2 rounded-full shadow-xl">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
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
              <div className="min-w-0 pt-10 md:pt-12">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 line-clamp-2">
                  {currentProviderDetails?.provider_name}
                </h1>
                <div className="flex items-start gap-2 text-sm md:text-base text-gray-600 mt-1">
                  <FaMapMarkerAlt className="shrink-0 mt-1 text-blue-500" />
                  <span className="line-clamp-2">
                    {currentProviderDetails?.address}
                  </span>
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

            {/* Rating Card: only shown when the provider has a real rating */}
            {hasRating && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                  গ্রাহক রেটিং
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-800">
                      {rating.toFixed(1)}
                    </div>
                    <div
                      className="flex justify-center mt-2"
                      aria-label={`${rating.toFixed(1)} out of 5`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => {
                        const Icon =
                          rating >= star
                            ? FaStar
                            : rating >= star - 0.5
                              ? FaStarHalfAlt
                              : FaRegStar;
                        return (
                          <Icon
                            key={star}
                            aria-hidden="true"
                            className="text-yellow-400 text-xl"
                          />
                        );
                      })}
                    </div>
                    {reviewCount != null && (
                      <p className="text-gray-500 mt-1">
                        {reviewCount.toLocaleString("bn-BD")} রিভিউ
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 md:mt-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg p-5 md:p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <h3 className="text-lg md:text-xl font-bold">আজই সেবা নিন!</h3>
              <p className="opacity-90">দ্রুত সেবা পেতে এখনই কল করুন</p>
            </div>
            <a
              href={`tel:${currentProviderDetails?.contact_no}`}
              className="w-full md:w-auto justify-center bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-bold text-base md:text-lg shadow-md transition-all flex items-center gap-2"
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

// const ServiceProviderDetails = () => {
//   const { currentProviderDetails } = useSelector((state) => state.allCare);

// export default ServiceProviderDetails;
