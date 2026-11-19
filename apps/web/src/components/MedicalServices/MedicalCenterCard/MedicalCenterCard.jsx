"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { LuArrowRight, LuMapPin, LuNavigation, LuPhone } from "react-icons/lu";
import { handleDoctorReducer } from "@/redux/doctorReducer";
import { Badge, CARD, CARD_HOVER } from "@/components/shared/UI/UI";
import {
  centerTypeLabel,
  formatDistance,
  MetaItem,
  resolveHealthImage,
} from "../Layout/MedicalUI";

const MedicalCenterCard = ({ center, onClick, children }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleMedicalCenterClick = () => {
    dispatch(
      handleDoctorReducer({
        type: "SAVE_CENTER_INFO",
        data: center,
      })
    );

    router.push(
      `/medical-services/doctor/consultation-center/visit/${center?._id}`
    );
  };

  const handleClick = onClick || handleMedicalCenterClick;
  const typeLabel = centerTypeLabel(center?.center_type);
  const distance =
    center?.distance != null ? formatDistance(center.distance) : null;
  const phone = center?.apointment_contact_1;
  const logo = resolveHealthImage(center?.logo);

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={center?.center_name || "Medical center"}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target === e.currentTarget) handleClick(e);
      }}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F] ${CARD} ${CARD_HOVER}`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
        <Image
          src={
            resolveHealthImage(center?.medical_center_banner_app) ||
            "/png/dummyImage.png"
          }
          fill
          sizes="(min-width: 1280px) 320px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={center?.center_name || "Medical center"}
          className="object-cover transition-transform duration-500 group-hover:scale-105 dark:brightness-90"
        />
        {distance && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#FFFFFF]/95 px-2.5 py-1 text-xs font-semibold text-[#101828] shadow-sm">
            <LuNavigation className="text-[#0C3F8E]" />
            {distance}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          {logo && (
            <span className="relative -mt-9 h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-[#FFFFFF] shadow-sm">
              <Image src={logo} alt="" fill sizes="48px" className="object-contain p-1" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            {typeLabel && (
              <Badge tone="navy" className="mb-1.5">
                {typeLabel}
              </Badge>
            )}
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900 transition-colors group-hover:text-[#0C3F8E] dark:group-hover:text-[#7FB2FF]">
              {center?.center_name}
            </h3>
          </div>
        </div>

        <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
          {center?.address && (
            <MetaItem icon={LuMapPin}>
              <span className="line-clamp-2">{center.address}</span>
            </MetaItem>
          )}
          {phone && (
            <MetaItem icon={LuPhone}>
              <a
                href={`tel:${String(phone).replace(/[^\d+]/g, "")}`}
                onClick={(e) => e.stopPropagation()}
                className="tabular-nums hover:text-[#0C3F8E] hover:underline dark:hover:text-[#7FB2FF]"
              >
                {phone}
              </a>
            </MetaItem>
          )}
        </ul>

        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-[#0C3F8E] dark:text-[#7FB2FF]">
          View details
          <LuArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
      {children}
    </article>
  );
};

export default MedicalCenterCard;
