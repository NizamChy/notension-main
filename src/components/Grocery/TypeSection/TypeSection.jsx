"use client";
import { GROCERY_SLIDER_TYPE_SUBTYPE_IMAGES } from "@/api-endpoints/api-endpoint";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import NoItemFound from "../NoItemSection/NoItemFound";
import SubtypeSkeleton from "./SubtypeSkeleton";

const TypeSection = ({ typeId }) => {
  const router = useRouter();

  const params = useParams();

  const { typeInfo, isLoading } = useSelector((state) => state.dashboard);

  const selectedType = typeInfo?.find(
    (type) => type.id === typeId || type.custom_type_id === typeId
  );

  const subtypes = selectedType?.subtype || [];

  return (
    <>
      {/* <div className="mt-10 px-4 lg:mx-20"> */}
      <div className="mt-32 px-4 lg:mx-20">
        <h2 className="text-2xl font-bold mb-6 text-deepGray">
          {selectedType?.name || ""}
        </h2>

        {isLoading && (
          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SubtypeSkeleton key={index} />
            ))}
          </div>
        )}
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {subtypes.length > 0 &&
            subtypes.map((subtype) => (
              <div
                // router.push(`/sub-type/${subtype?.subtypeInfo?._id}`)
                onClick={() =>
                  router.push(
                    `/grocery/${params?.store}/sub-type/${subtype?.subtypeInfo?._id}`
                  )
                }
                key={subtype._id}
                className="cursor-pointer bg-white rounded-lg shadow-md p-2 md:p-4 hover:shadow-lg transition-shadow"
              >
                <Image
                  height={200}
                  width={200}
                  src={
                    subtype?.subtypeInfo?.banner_type_1
                      ? `${GROCERY_SLIDER_TYPE_SUBTYPE_IMAGES}/${subtype?.subtypeInfo?.banner_type_1}`
                      : "/png/dummyImage.png"
                  }
                  alt={subtype.sub_type_name}
                  className="w-full md:h-40 object-contain rounded-lg"
                />
              </div>
            ))}
        </div>

        {!isLoading && subtypes.length < 1 && <NoItemFound />}
      </div>
    </>
  );
};

export default TypeSection;
