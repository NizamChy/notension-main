"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SubtypeSkeleton from "./SubtypeSkeleton";
import { useParams, useRouter } from "next/navigation";
import NoItemFound from "@/components/common/NoItemFound";
import { getStoreModule, toSlug } from "./storeModules";

const SUBTYPE_GRID_CLASS =
  "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-5";

const TypeSection = ({ moduleName }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const { basePath, sliderImageBaseUrl } = getStoreModule(moduleName);

  const typeId = params?.typeSlugId?.split("_")[1];

  const { typeInfo, isLoading } = useSelector((state) => state.dashboard);

  const selectedType = typeInfo?.find(
    (type) => type?.id === typeId || type?.custom_type_id === typeId,
  );
  const subtypes = selectedType?.subtype || [];

  const handleSubtype = (subTypeId, sub) => {
    const subTypeSlugId = `${toSlug(sub?.sub_type_name)}_${subTypeId}`;

    router.push(
      `${basePath}/${params?.store}/${params?.storeId}/${params?.customStoreId}/sub-type/${subTypeSlugId}`,
    );
  };

  return (
    <div>
      <h2 className="text-lg md:text-2xl font-semibold text-deepGray mb-4 md:mb-6">
        {selectedType?.name || ""}
      </h2>

      {/* Equal square tiles: 3 → 4 → 5 → 6 columns. */}
      {isLoading && (
        <div className={SUBTYPE_GRID_CLASS}>
          {Array.from({ length: 6 }).map((_, index) => (
            <SubtypeSkeleton key={index} />
          ))}
        </div>
      )}
      <div className={SUBTYPE_GRID_CLASS}>
        {subtypes.map((subtype) => (
          <button
            type="button"
            onClick={() => handleSubtype(subtype?.subtypeInfo?._id, subtype)}
            key={subtype?._id}
            title={subtype?.sub_type_name}
            className="relative aspect-square w-full overflow-hidden cursor-pointer bg-white border border-gray-200 rounded-xl shadow-sm p-1.5 hover:shadow-md transition-shadow"
          >
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            <span className="relative block w-full h-full">
              <Image
                fill
                sizes="(min-width: 1024px) 15vw, 33vw"
                src={
                  subtype?.subtypeInfo?.banner_type_1
                    ? `${sliderImageBaseUrl}/${subtype?.subtypeInfo?.banner_type_1}`
                    : "/png/dummyImage.png"
                }
                alt={subtype?.sub_type_name || "subtype"}
                className={`object-contain rounded-lg ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            </span>
          </button>
        ))}
      </div>

      {!isLoading && subtypes.length < 1 && <NoItemFound />}
    </div>
  );
};

export default TypeSection;
