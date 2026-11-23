"use client";

import Image from "next/image";
import React, { useState } from "react";
import SubtypeSkeleton from "./SubtypeSkeleton";
import { useParams, useRouter } from "next/navigation";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { getStoreModule, toSlug } from "./storeModules";
import { useStoreData, type StoreModuleName } from "./useStoreData";
import type { GroceryExplore } from "@/lib/api/grocery";
import {
  CARD,
  CARD_HOVER,
  EmptyState,
  PageHeader,
} from "@/components/shared/UI/UI";

const SUBTYPE_GRID_CLASS =
  "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4";

/** A sub-type under a type (TypeInfo.subtype holds the explore's rows). */
type SubType = GroceryExplore["ProductSubTypeByShop"][number];

type SubtypeTileProps = { name: string | undefined; src: string; onClick: () => void };

// One sub-type tile: square image on a light base with its name underneath.
const SubtypeTile = ({ name, src, onClick }: SubtypeTileProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <button
      type="button"
      onClick={onClick}
      title={name}
      className={`group flex w-full flex-col overflow-hidden p-2 text-left ${CARD} ${CARD_HOVER} focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0C3F8E]/40`}
    >
      <span className="relative block aspect-square w-full overflow-hidden rounded-xl bg-[#F6F7F9]">
        {isImageLoading && (
          <span className="absolute inset-0 animate-pulse bg-[#ECEEF2]" />
        )}
        <Image
          fill
          sizes="(min-width: 1280px) 15vw, (min-width: 768px) 20vw, 33vw"
          src={src}
          alt={name || "Category"}
          className={`object-contain p-1.5 transition duration-300 group-hover:scale-105 ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => setIsImageLoading(false)}
        />
      </span>
      <span className="mt-2 line-clamp-2 min-h-8 px-0.5 text-center text-xs font-semibold leading-4 text-gray-800 md:text-sm md:leading-5 md:min-h-10">
        {name}
      </span>
    </button>
  );
};

type Props = { moduleName: StoreModuleName };

type RouteParams = { store: string; storeId: string; customStoreId: string; typeSlugId: string };

const TypeSection = ({ moduleName }: Props) => {
  const router = useRouter();
  const params = useParams<RouteParams>();
  const { basePath, sliderImageBaseUrl } = getStoreModule(moduleName);

  const typeId = params?.typeSlugId?.split("_")[1];

  const { typeInfo, isLoading } = useStoreData(moduleName);

  const selectedType = typeInfo?.find(
    (type) => type?.id === typeId || type?.custom_type_id === typeId,
  );
  const subtypes = (selectedType?.subtype || []) as SubType[];

  const handleSubtype = (subTypeId: string, sub: SubType) => {
    const subTypeSlugId = `${toSlug(sub?.sub_type_name)}_${subTypeId}`;

    router.push(
      `${basePath}/${params?.store}/${params?.storeId}/${params?.customStoreId}/sub-type/${subTypeSlugId}`,
    );
  };

  return (
    <div>
      <PageHeader
        title={selectedType?.name || (isLoading ? "Loading…" : "Category")}
        subtitle={
          subtypes.length > 0
            ? `${subtypes.length} ${subtypes.length === 1 ? "category" : "categories"} to browse`
            : null
        }
      />

      {/* Equal square tiles: 3 → 4 → 5 → 6 columns. */}
      {isLoading ? (
        <div className={SUBTYPE_GRID_CLASS}>
          {Array.from({ length: 10 }).map((_, index) => (
            <SubtypeSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className={SUBTYPE_GRID_CLASS}>
          {subtypes.map((subtype) => (
            <SubtypeTile
              key={subtype?._id}
              name={subtype?.sub_type_name}
              src={
                subtype?.subtypeInfo?.banner_type_1
                  ? `${sliderImageBaseUrl}/${subtype?.subtypeInfo?.banner_type_1}`
                  : "/png/dummyImage.png"
              }
              onClick={() => handleSubtype(subtype?.subtypeInfo?._id, subtype)}
            />
          ))}
        </div>
      )}

      {!isLoading && subtypes.length < 1 && (
        <EmptyState
          icon={<HiOutlineSquares2X2 />}
          title="No categories yet"
          text="This store hasn't added anything here yet."
          className="min-h-[40vh]"
        />
      )}
    </div>
  );
};

export default TypeSection;
