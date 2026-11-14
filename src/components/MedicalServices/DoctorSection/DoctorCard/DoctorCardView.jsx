import React from "react";
import {
  LuBriefcaseMedical,
  LuBuilding2,
  LuMapPin,
  LuStar,
} from "react-icons/lu";
import { Badge, CARD, CARD_HOVER } from "@/components/shared/UI/UI";
import { formatTaka } from "@/components/shared/CartUI/CartUI";
import { DoctorAvatar, MetaItem, formatDistance } from "../../Layout/MedicalUI";

// Presentational doctor card shared by the doctor grids, the popular-doctor
// sliders and the favourite list, so every doctor card has the same size,
// radius, border, padding and text clamping. It fills its grid cell / slide
// (h-full) so cards in a row are always the same height.
// `action` sits in the top-right corner (favourite / remove button).
const DoctorCardView = ({
  info,
  name,
  speciality,
  qualifications,
  experience,
  rating,
  fee,
  center,
  distance,
  ctaLabel = "Book appointment",
  onClick,
  action,
  children,
}) => {
  const distanceText = distance != null ? formatDistance(distance) : null;
  const hasFee = fee != null && fee !== "" && Number(fee) > 0;
  const hasMeta = experience || rating || center || distanceText;

  return (
    <article
      onClick={onClick}
      className={`group relative flex h-full w-full cursor-pointer flex-col p-4 sm:p-5 ${CARD} ${CARD_HOVER}`}
    >
      <div className="flex items-start gap-4">
        <DoctorAvatar
          info={info}
          name={name}
          className="h-16 w-16 rounded-full sm:h-[72px] sm:w-[72px]"
          sizes="72px"
        />

        <div className={`min-w-0 flex-1 ${action ? "pr-10" : ""}`}>
          <h3 className="line-clamp-1 text-base font-semibold text-gray-900 transition-colors group-hover:text-[#0C3F8E] dark:group-hover:text-[#7FB2FF]">
            {name}
          </h3>
          {qualifications && (
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
              {qualifications}
            </p>
          )}
          {speciality && (
            <Badge tone="navy" className="mt-2 max-w-full">
              <span className="truncate">{speciality}</span>
            </Badge>
          )}
        </div>
      </div>

      {hasMeta && (
        <ul className="mt-4 space-y-1.5 text-sm text-gray-600">
          {experience ? (
            <MetaItem icon={LuBriefcaseMedical}>
              {experience}+ years experience
            </MetaItem>
          ) : null}
          {rating ? (
            <li className="flex items-center gap-2">
              <LuStar className="shrink-0 fill-[#F79009] text-[15px] text-[#F79009]" />
              <span className="font-medium text-gray-900">
                {Number(rating).toFixed(1)}
              </span>
              <span className="text-gray-500">rating</span>
            </li>
          ) : null}
          {center && (
            <MetaItem icon={LuBuilding2}>
              <span className="line-clamp-1">{center}</span>
            </MetaItem>
          )}
          {distanceText && <MetaItem icon={LuMapPin}>{distanceText}</MetaItem>}
        </ul>
      )}

      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between gap-3 border-t border-dashed border-gray-200 pt-4">
          {hasFee ? (
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                Consultation fee
              </p>
              <p className="text-base font-bold tabular-nums text-gray-900">
                {formatTaka(fee)}
              </p>
            </div>
          ) : (
            <span />
          )}
          <button
            type="button"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#0C3F8E] px-4 text-sm font-semibold text-white shadow-sm shadow-[#0C3F8E]/20 transition-colors hover:bg-[#0A3478] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F] focus-visible:ring-offset-2"
          >
            {ctaLabel}
          </button>
        </div>
      </div>

      {action && <div className="absolute right-3 top-3">{action}</div>}

      {children}
    </article>
  );
};

export default DoctorCardView;
