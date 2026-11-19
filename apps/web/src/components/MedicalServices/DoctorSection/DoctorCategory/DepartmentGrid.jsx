import React from "react";
import Image from "next/image";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";
import { MedicalSectionTitle } from "../../Layout/MedicalLayout";

// "Find doctor by department" tiles. Every tile reserves its aspect ratio,
// so rows stay aligned even if an image is slow or fails to load. The
// department banners carry their own name, so the name is the accessible
// label rather than a second visible caption.
const DepartmentGrid = ({
  items,
  getImage,
  getName,
  onSelect,
  imageWidth = 300,
  imageHeight = 300,
  title = "Find doctors by department",
  subtitle = "বিভাগ অনুযায়ী ডাক্তার খুঁজুন",
}) => {
  const isWide = imageWidth > imageHeight;
  const gridClassName = isWide
    ? "grid-cols-2 lg:grid-cols-4"
    : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6";

  return (
    <section>
      <MedicalSectionTitle subtitle={subtitle}>{title}</MedicalSectionTitle>

      <div className={`grid gap-3 md:gap-4 ${gridClassName}`}>
        {items?.map((item) => {
          const name = getName(item) || "Department";
          return (
            <button
              type="button"
              key={item?._id}
              onClick={(e) => onSelect(e, item)}
              aria-label={`${name} doctors`}
              title={name}
              className="group relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm shadow-gray-900/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F] focus-visible:ring-offset-2"
              style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
            >
              <Image
                src={`${HEALTH_CARE_IMAGES}/${getImage(item)}`}
                alt=""
                fill
                sizes={
                  isWide
                    ? "(min-width: 1024px) 300px, 50vw"
                    : "(min-width: 1024px) 200px, (min-width: 640px) 25vw, 33vw"
                }
                className="object-cover transition-transform duration-500 group-hover:scale-105 dark:brightness-90"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default DepartmentGrid;
