"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SubtypeSkeleton from "./SubtypeSkeleton";
import { useParams, useRouter } from "next/navigation";
import NoItemFound from "@/components/common/NoItemFound";
import { MEDICINE_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";

const TypeSection = () => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const router = useRouter();
  const params = useParams();

  const typeSlugId = params.typeSlugId;
  const [slug, typeId] = typeSlugId.split("_");

  const { typeInfo, isLoading } = useSelector((state) => state.dashboard);

  const selectedType = typeInfo?.find(
    (type) => type?.id === typeId || type?.custom_type_id === typeId
  );
  const subtypes = selectedType?.subtype || [];

  const handleSubtype = (subTypeId, sub) => {
    const formattedSubTypeName = sub?.sub_type_name
      ?.trim()
      .toLowerCase()
      .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
      .replace(/\s+/g, "-");

    const subTypeSlugId = `${formattedSubTypeName}_${subTypeId}`;

    router.push(
      `/medicine/${params?.store}/${params?.storeId}/${params?.customStoreId}/sub-type/${subTypeSlugId}`
    );
  };

  return (
    <>
      <div className="mt-20 md:mt-32 px-4 lg:mx-20 min-h-content">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-6 text-deepGray">
          {selectedType?.name || ""}
        </h2>

        {isLoading && (
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SubtypeSkeleton key={index} />
            ))}
          </div>
        )}
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-6">
          {subtypes?.length > 0 &&
            subtypes?.map((subtype) => (
              <div
                onClick={() =>
                  handleSubtype(subtype?.subtypeInfo?._id, subtype)
                }
                key={subtype?._id}
                className="relative cursor-pointer bg-white rounded-lg shadow-md p-2 md:p-4 hover:shadow-lg transition-shadow"
              >
                {isImageLoading && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse w-full h-full">
                    <div className="h-full flex justify-center items-center">
                      <Image
                        src="/gif/loading.gif"
                        alt="loading.gif"
                        width={60}
                        height={60}
                      />
                    </div>
                  </div>
                )}

                <Image
                  height={200}
                  width={200}
                  src={
                    subtype?.subtypeInfo?.banner_type_1
                      ? `${MEDICINE_SLIDER_TYPE_SUBTYPE_IMAGES}/${subtype?.subtypeInfo?.banner_type_1}`
                      : "/png/dummyImage.png"
                  }
                  alt={subtype?.sub_type_name}
                  className={`w-full md:h-40 object-contain rounded-lg ${
                    isImageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoadingComplete={() => setIsImageLoading(false)}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => setIsImageLoading(false)}
                />
              </div>
            ))}
        </div>

        {!isLoading && subtypes?.length < 1 && <NoItemFound />}
      </div>
    </>
  );
};

export default TypeSection;
