import React from "react";
import Image from "next/image";
import { IoCall } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaCalendarAlt, FaHeart } from "react-icons/fa";
import { MedicalContainer } from "../../Layout/MedicalLayout";

const ChamberCard = ({ profile, canBook, onBook }) => {
  const center = profile?.consultationCenterInfo;
  const timeSlots = [1, 2, 3]
    .map((index) => profile?.[`chamber_onDay_time_slot_${index}`])
    .filter(Boolean);
  const contacts = [1, 2, 3]
    .map((index) => center?.[`apointment_contact_${index}`])
    .filter(Boolean);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 md:p-5 space-y-4">
      <div>
        <p className="text-primary font-bold text-base md:text-lg">
          পরামর্শ কেন্দ্র:
        </p>
        <p className="py-1 text-lg md:text-xl font-semibold text-green-600">
          {center?.center_name}
        </p>
        <p className="flex items-start gap-2 text-sm md:text-base font-medium">
          <FaLocationDot className="shrink-0 mt-1 text-primary" />
          <span>{center?.address}</span>
        </p>
      </div>

      {timeSlots.length > 0 && (
        <div>
          <p className="text-primary font-bold text-base md:text-lg pb-1">
            পরামর্শের সময়:
          </p>
          {timeSlots.map((timeSlot) => (
            <p
              key={timeSlot}
              className="flex items-start gap-2 font-medium text-sm md:text-base text-[#A93356]"
            >
              <MdAccessTimeFilled className="shrink-0 mt-1 text-primary" />
              <span>{timeSlot}</span>
            </p>
          ))}
        </div>
      )}

      {canBook && (
        <button
          type="button"
          onClick={(e) => onBook(e, profile)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-white hover:bg-[#264066] transition-colors"
        >
          <FaCalendarAlt className="text-base" />
          <span>Book an appointment</span>
        </button>
      )}

      {contacts.length > 0 && (
        <div>
          <p className="text-primary font-bold text-base md:text-lg pb-1">
            সিরিয়ালের জন্য:
          </p>
          {contacts.map((contact) => (
            <p
              key={contact}
              className="flex items-center gap-2 font-medium text-sm md:text-base"
            >
              <IoCall className="shrink-0 text-primary" />
              <span>{contact}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// Shared doctor profile layout: doctor summary on the left, one chamber card
// per consultation center on the right; stacks on mobile.
const DoctorProfileView = ({
  doctorInfo,
  chambers = [],
  canBook = () => false,
  onBook,
  favorite = null,
}) => {
  return (
    <MedicalContainer className="py-6 md:py-8 min-h-content">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-8 text-deepGray">
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-center sm:text-left">
          <div className="relative shrink-0 w-32 h-40 md:w-40 md:h-52 rounded-xl bg-[#F3F7FB] overflow-hidden">
            <Image
              src={
                doctorInfo?.gender === "Female"
                  ? "/images/medical-services/doctor-female.png"
                  : "/images/medical-services/doctor-male.png"
              }
              alt={doctorInfo?.doctor_name || "Doctor"}
              fill
              sizes="160px"
              className="object-contain object-bottom"
            />
          </div>

          <div className="min-w-0 space-y-1.5">
            <h1 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-[#A93356]">
              {doctorInfo?.doctor_name}
            </h1>
            <p className="text-sm lg:text-base text-mediumGray">
              {doctorInfo?.qualifications}
            </p>
            <p className="text-base lg:text-xl font-bold text-primary">
              {doctorInfo?.speciality}
            </p>

            {favorite &&
              (favorite.isAdded ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-primaryBg px-3 py-1 text-xs font-medium text-primaryFood">
                  <FaHeart /> Favourite
                </span>
              ) : (
                <button
                  type="button"
                  onClick={favorite.onAdd}
                  className="inline-flex items-center gap-1 rounded-full border border-primaryBg bg-primaryBg px-3 py-1 text-xs font-medium text-deepGray hover:border-primaryFood hover:bg-white hover:text-primaryFood transition-colors"
                >
                  <FaHeart className="text-primaryFood" />
                  Add to Favourite
                </button>
              ))}
          </div>
        </div>

        <div className="space-y-4">
          {chambers.map((profile) => (
            <ChamberCard
              key={profile?._id}
              profile={profile}
              canBook={canBook(profile)}
              onBook={onBook}
            />
          ))}
        </div>
      </div>
    </MedicalContainer>
  );
};

export default DoctorProfileView;
