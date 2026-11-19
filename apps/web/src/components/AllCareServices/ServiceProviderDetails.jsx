"use client";

import Link from "next/link";
import Image from "next/image";
import Loader from "../common/Loader";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaWhatsapp, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { HiChevronLeft } from "react-icons/hi";
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineCheckBadge,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineUserGroup,
  HiStar,
} from "react-icons/hi2";
import { MdStorefront } from "react-icons/md";
import { useAllCareService } from "@/hooks/fetch-data/useAllCareService";
import { SERVICE_PROVIDER_IMAGES } from "@/api-endpoints/api-endpoint";
import {
  Badge,
  CARD,
  EmptyState,
  PAGE_CONTAINER,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
} from "@/components/shared/UI/UI";

// Returns a finite number, or null for missing / non-numeric values.
const toNumberOrNull = (value) => {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

// Bangladeshi mobile number -> wa.me link (null when it doesn't look like one).
const whatsappLink = (phone) => {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `88${digits}`;
  return digits.length >= 11 ? `https://wa.me/${digits}` : null;
};

const CardTitle = ({ children }) => (
  <h2 className="mb-4 text-base font-bold tracking-tight text-gray-900 md:text-lg">
    {children}
  </h2>
);

const InfoRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0C3F8E]/10 text-lg text-[#0C3F8E] dark:text-[#7FB2FF]">
      <Icon aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="mt-0.5 break-words text-sm font-semibold text-gray-900">
        {children}
      </div>
    </div>
  </div>
);

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
  const years = toNumberOrNull(currentProviderDetails?.experience_years);

  const backHref =
    serviceId && serviceId !== "undefined"
      ? `/all-care-services/service/${serviceId}`
      : "/all-care-services";

  if (!currentProviderDetails && (progressing || (serviceId && !requested))) {
    return <Loader />;
  }

  if (!currentProviderDetails?._id) {
    return (
      <div className={`${PAGE_CONTAINER} py-10 md:py-16`}>
        <EmptyState
          icon={<HiOutlineUserGroup />}
          title="Service provider not found"
          text="This provider may no longer be listed in your area."
          action={
            <Link href={backHref} className={SECONDARY_BUTTON}>
              Back to providers
            </Link>
          }
        />
      </div>
    );
  }

  const {
    provider_name: name,
    provider_banner_app: banner,
    provider_logo: logo,
    address,
    contact_no: phone,
    alternative_contact_no: altPhone,
    contact_person_name: person,
    service_details: details,
    service_hours: hours,
    latitude,
    longitude,
  } = currentProviderDetails;

  const whatsapp = whatsappLink(phone);
  const mapHref =
    latitude != null && longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
        : null;

  return (
    <div className={`${PAGE_CONTAINER} py-5 md:py-8`}>
      <Link
        href={backHref}
        className="mb-3 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <HiChevronLeft aria-hidden="true" className="text-lg" />
        Back to providers
      </Link>

      {/* Banner images often carry their own text, so the name and address
          sit under the banner instead of on top of it. */}
      <section className={`${CARD} overflow-hidden`}>
        <div className="relative aspect-[2/1] max-h-80 w-full bg-gray-100 sm:aspect-[5/2] lg:aspect-[3/1]">
          {banner && (
            <Image
              src={`${SERVICE_PROVIDER_IMAGES}/${banner}`}
              alt={`${name} banner`}
              fill
              sizes="(min-width: 1312px) 1248px, 100vw"
              className="object-cover"
              preload
            />
          )}
        </div>

        <div className="px-4 pb-5 sm:px-6 md:px-8 md:pb-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
              <span className="relative -mt-10 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#FFFFFF] shadow-lg shadow-gray-900/10 md:-mt-14 md:h-28 md:w-28">
                {logo ? (
                  <Image
                    src={`${SERVICE_PROVIDER_IMAGES}/${logo}`}
                    alt={`${name} logo`}
                    fill
                    sizes="112px"
                    className="object-contain p-1.5"
                  />
                ) : (
                  <MdStorefront aria-hidden="true" className="text-4xl text-[#0C3F8E]/60" />
                )}
              </span>

              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
                  {name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {hasRating && (
                    <Badge tone="amber">
                      <HiStar aria-hidden="true" className="text-sm text-[#F79009]" />
                      {rating.toFixed(1)}
                      {reviewCount != null && (
                        <span className="font-medium opacity-80">
                          · {reviewCount.toLocaleString("bn-BD")} রিভিউ
                        </span>
                      )}
                    </Badge>
                  )}
                  <Badge tone="green">
                    <HiOutlineCheckBadge aria-hidden="true" className="text-sm" />
                    Verified provider
                  </Badge>
                  {years != null && years > 0 && (
                    <Badge tone="navy">{years}+ years experience</Badge>
                  )}
                </div>
                {address && (
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-gray-500 md:text-base">
                    <HiOutlineMapPin aria-hidden="true" className="mt-0.5 shrink-0 text-base md:mt-1" />
                    <span>{address}</span>
                  </p>
                )}
              </div>
            </div>

            {phone && (
              <div className="grid grid-cols-2 gap-2 sm:flex md:shrink-0">
                <a href={`tel:${phone}`} className={PRIMARY_BUTTON}>
                  <HiOutlinePhone aria-hidden="true" className="text-lg" />
                  Call now
                </a>
                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#12B76A]/40 bg-[#12B76A]/10 px-5 text-sm font-semibold text-[#067647] transition-colors hover:bg-[#12B76A]/20 dark:text-[#47CD89]"
                  >
                    <FaWhatsapp aria-hidden="true" className="text-lg" />
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-1 gap-5 md:mt-6 lg:grid-cols-3 lg:gap-6">
        {/* Main column: service details and rating */}
        <div className="flex min-w-0 flex-col gap-5 lg:col-span-2 lg:gap-6">
          <section className={`${CARD} p-5 md:p-6`}>
            <CardTitle>পরিষেবার বিবরণ</CardTitle>
            {details ? (
              <p className="whitespace-pre-line break-words text-sm leading-relaxed text-gray-700 md:text-base">
                {details}
              </p>
            ) : (
              <p className="text-sm text-gray-500">No details added yet.</p>
            )}
          </section>

          {/* Rating card: only shown when the provider has a real rating */}
          {hasRating && (
            <section className={`${CARD} p-5 md:p-6`}>
              <CardTitle>গ্রাহক রেটিং</CardTitle>
              <div className="flex items-center gap-5">
                <div className="text-5xl font-bold tracking-tight text-gray-900">
                  {rating.toFixed(1)}
                </div>
                <div>
                  <div
                    className="flex gap-0.5"
                    role="img"
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
                          className="text-xl text-[#F79009]"
                        />
                      );
                    })}
                  </div>
                  {reviewCount != null && (
                    <p className="mt-1 text-sm text-gray-500">
                      {reviewCount.toLocaleString("bn-BD")} রিভিউ
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Side column: contact, hours, location */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start lg:gap-6">
          <section className={`${CARD} p-5 md:p-6`}>
            <CardTitle>যোগাযোগ তথ্য</CardTitle>
            <div className="space-y-4">
              {person && (
                <InfoRow icon={HiOutlineUser} label="যোগাযোগ ব্যক্তি">
                  {person}
                </InfoRow>
              )}
              {altPhone && (
                <InfoRow icon={HiOutlinePhone} label="ফোন নম্বর">
                  <a href={`tel:${altPhone}`} className="hover:underline">
                    {altPhone}
                  </a>
                </InfoRow>
              )}
              {phone && (
                <InfoRow icon={FaWhatsapp} label="হোয়াটসঅ্যাপ">
                  {whatsapp ? (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {phone}
                    </a>
                  ) : (
                    phone
                  )}
                </InfoRow>
              )}
            </div>
          </section>

          <section className={`${CARD} p-5 md:p-6`}>
            <CardTitle>সেবার সময়</CardTitle>
            <InfoRow icon={HiOutlineClock} label="খোলা থাকে">
              {hours || (
                <>
                  সকাল ৯টা - রাত ১০টা
                  <span className="block text-xs font-medium text-gray-500">
                    সপ্তাহের ৭ দিন
                  </span>
                </>
              )}
            </InfoRow>
          </section>

          {address && (
            <section className={`${CARD} p-5 md:p-6`}>
              <CardTitle>Location</CardTitle>
              <InfoRow icon={HiOutlineMapPin} label="Address">
                <span className="font-medium">{address}</span>
              </InfoRow>
              {mapHref && (
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${SECONDARY_BUTTON} mt-4 w-full`}
                >
                  Open in Google Maps
                  <HiOutlineArrowTopRightOnSquare aria-hidden="true" />
                </a>
              )}
            </section>
          )}
        </aside>
      </div>

      {/* Call to action */}
      {phone && (
        <section className="mt-6 overflow-hidden rounded-2xl bg-[#0C3F8E] p-5 text-white md:mt-8 md:p-7">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <h3 className="text-lg font-bold md:text-xl">আজই সেবা নিন!</h3>
              <p className="mt-0.5 text-sm text-white/80 md:text-base">
                দ্রুত সেবা পেতে এখনই কল করুন
              </p>
            </div>
            <a
              href={`tel:${phone}`}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#EB5C2F] px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#D44E24] md:w-auto"
            >
              <HiOutlinePhone aria-hidden="true" className="text-lg" />
              {phone}
            </a>
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiceProviderDetails;
