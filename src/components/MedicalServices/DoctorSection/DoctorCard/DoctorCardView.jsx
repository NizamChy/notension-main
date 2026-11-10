import React from "react";
import Image from "next/image";

// Presentational doctor card shared by the doctor grids, the popular-doctor
// sliders and the favourite list, so every doctor card has the same size,
// radius, border, padding and text clamping. It fills its grid cell / slide
// (h-full) so cards in a row are always the same height.
const DoctorCardView = ({
  name,
  gender,
  speciality,
  qualifications,
  footer,
  onClick,
  children,
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative h-full w-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="flex flex-1 items-center gap-4 p-4">
        <div className="relative shrink-0 w-20 h-24 md:w-24 md:h-28 rounded-lg bg-[#F3F7FB] overflow-hidden">
          <Image
            src={
              gender === "Female"
                ? "/images/medical-services/doctor-female.png"
                : "/images/medical-services/doctor-male.png"
            }
            alt={name || "Doctor"}
            fill
            sizes="96px"
            className="object-contain object-bottom"
          />
        </div>

        <div className="min-w-0 flex-1 flex flex-col items-start gap-1.5">
          <h3 className="w-full text-sm md:text-base font-semibold text-[#A93356] line-clamp-1">
            {name}
          </h3>

          {speciality && (
            <span className="max-w-full truncate bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
              {speciality}
            </span>
          )}

          <p className="w-full text-xs md:text-sm text-mediumGray line-clamp-2 min-h-[2lh]">
            {qualifications}
          </p>
        </div>
      </div>

      {footer && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5">
          <p className="text-sm md:text-base font-semibold text-primary line-clamp-1 text-center">
            {footer}
          </p>
        </div>
      )}

      {children}
    </div>
  );
};

export default DoctorCardView;
