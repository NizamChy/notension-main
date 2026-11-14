"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { LuHeart, LuMapPin, LuPhone } from "react-icons/lu";
import { useFavouriteList } from "@/hooks/fetch-data/favorite-list";
import { Badge, CARD } from "@/components/shared/UI/UI";
import { centerTypeLabel, resolveHealthImage } from "../../Layout/MedicalUI";

const ExploreConsultationCenterInfo = () => {
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { addToFavouriteList, isAddedToFavouriteList } = useFavouriteList();
  const { currentCenter } = useSelector((state) => state.doctorInfo);

  let merchantType = 3;
  let isExists = null;

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToFavouriteList(currentCenter, merchantType);
  };

  useEffect(() => {
    isExists = isAddedToFavouriteList(currentCenter?._id, merchantType);
    setIsFavoriteAdded(isExists);
  }, [currentCenter, handleAddToFavorite]);

  const contacts = [1, 2, 3]
    .map((index) => currentCenter?.[`apointment_contact_${index}`])
    .filter(Boolean);
  const typeLabel = centerTypeLabel(currentCenter?.center_type);

  return (
    <div className={`${CARD} overflow-hidden`}>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="relative aspect-[16/9] bg-gray-100 md:aspect-auto md:min-h-[260px]">
          <Image
            src={
              resolveHealthImage(currentCenter?.medical_center_banner_app) ||
              "/png/dummyImage.png"
            }
            alt={currentCenter?.center_name || "Consultation center"}
            fill
            priority
            sizes="(min-width: 1280px) 560px, (min-width: 768px) 45vw, 100vw"
            className="object-cover dark:brightness-90"
          />
        </div>

        <div className="flex flex-col justify-center p-5 md:p-7">
          <div className="flex flex-wrap items-center gap-2">
            {typeLabel && <Badge tone="navy">{typeLabel}</Badge>}
            {isFavoriteAdded && (
              <Badge tone="red">
                <LuHeart className="fill-current" />
                Saved
              </Badge>
            )}
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            {currentCenter?.center_name}
          </h1>

          {currentCenter?.address && (
            <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-gray-600 md:text-base">
              <LuMapPin className="mt-0.5 shrink-0 text-base text-gray-400 md:mt-1" />
              <span className="line-clamp-3">{currentCenter.address}</span>
            </p>
          )}

          {contacts.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                For serial / appointment
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {contacts.map((contact) => (
                  <a
                    key={contact}
                    href={`tel:${String(contact).replace(/[^\d+]/g, "")}`}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium tabular-nums text-gray-800 transition-colors hover:border-[#0C3F8E]/40 hover:text-[#0C3F8E] dark:hover:text-[#7FB2FF]"
                  >
                    <LuPhone className="text-[#12B76A]" />
                    {contact}
                  </a>
                ))}
              </div>
            </div>
          )}

          {!isFavoriteAdded && (
            <div className="mt-5">
              <button
                type="button"
                onClick={handleAddToFavorite}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 transition-colors hover:border-[#D92D20]/30 hover:text-[#D92D20]"
              >
                <LuHeart className="text-base" />
                Add to favourites
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreConsultationCenterInfo;
