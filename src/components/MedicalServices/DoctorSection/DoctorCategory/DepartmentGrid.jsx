import React from "react";
import Image from "next/image";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";
import { MedicalSectionTitle } from "../../Layout/MedicalLayout";

// Tinted "find doctor by department" panel. Every tile reserves its aspect
// ratio, so rows stay aligned even if an image is slow or fails to load.
const DepartmentGrid = ({
  items,
  getImage,
  getName,
  onSelect,
  imageWidth = 300,
  imageHeight = 300,
  bgClassName = "bg-[#F3F7FB]",
}) => {
  const isWide = imageWidth > imageHeight;
  const gridClassName = isWide
    ? "grid-cols-2 lg:grid-cols-4"
    : "grid-cols-3 md:grid-cols-4 lg:grid-cols-6";

  return (
    <section className={`rounded-2xl p-4 md:p-6 lg:p-8 ${bgClassName}`}>
      <MedicalSectionTitle>বিভাগ অনুযায়ী ডাক্তার খুঁজুন</MedicalSectionTitle>

      <div className={`grid gap-3 md:gap-5 ${gridClassName}`}>
        {items?.map((item) => (
          <button
            type="button"
            key={item?._id}
            onClick={(e) => onSelect(e, item)}
            className="relative w-full overflow-hidden rounded-xl border-2 border-white bg-white/60 shadow-md transition-all duration-300 hover:border-primary hover:shadow-lg"
            style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
          >
            <Image
              src={`${HEALTH_CARE_IMAGES}/${getImage(item)}`}
              alt={getName(item) || "Department"}
              fill
              sizes={isWide ? "(min-width: 1024px) 300px, 50vw" : "(min-width: 1024px) 200px, 33vw"}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default DepartmentGrid;
