"use client";

import React, { type ReactNode } from "react";
import Image from "next/image";
import type { IconType } from "react-icons";
import { useFoodStore } from "@/hooks/food/useFoodStore";
import { IMAGE_URL } from "@/api-endpoints/env";
import {
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlinePhone,
} from "react-icons/hi2";
import { CARD } from "../shared/UI/UI";
import { useStoreData } from "../StoreModule/useStoreData";

type ShopModule = "food" | "grocery" | "medicine";

// The store fields the shop card reads (food, grocery and medicine stores).
type ShopDetails = {
  _id?: string;
  shop_name?: string;
  shop_address?: string;
  contact_no?: string | null;
  alternative_contact_no?: string | null;
  district_area_name?: string | null;
  district_name?: string;
  opening_time?: string | null;
  closing_time?: string | null;
  shop_banner_web?: string | null;
  is_closed?: boolean;
};

// The visited store per module, from each module's store query. moduleName
// is fixed per instance, so the hook a ShopInfo calls never changes.
// useStoreData keeps the store as a loose record; it is the explore's shop.
const useFoodStoreInfo = (): ShopDetails | undefined => useFoodStore().store;
const useGroceryStoreInfo = () => useStoreData("grocery").store as ShopDetails;
const useMedicineStoreInfo = () => useStoreData("medicine").store as ShopDetails;

const VISITED_STORE_HOOKS: Record<ShopModule, () => ShopDetails | undefined> = {
  food: useFoodStoreInfo,
  grocery: useGroceryStoreInfo,
  medicine: useMedicineStoreInfo,
};

type InfoLineProps = { icon: IconType; children: ReactNode; title?: string };

const InfoLine = ({ icon: Icon, children, title }: InfoLineProps) => (
  <p className="flex min-w-0 items-center gap-2">
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-[#7FB2FF]">
      <Icon className="text-sm" />
    </span>
    <span className="truncate" title={title}>
      {children}
    </span>
  </p>
);

// The shop card on a store's home page.
// - layout="card" (grocery / medicine): sits beside the hero slider; on md+ it
//   stretches to the slider's height, the banner takes the free space
//   (object-cover) and the details stay a compact block underneath.
// - layout="row" (food): a full-width store header — banner thumbnail on the
//   left, details on the right.
type Props = {
  moduleName?: ShopModule;
  layout?: "card" | "row";
};

const ShopInfo = ({ moduleName = "medicine", layout = "card" }: Props) => {
  const useVisitedStore = VISITED_STORE_HOOKS[moduleName];
  const store = useVisitedStore();

  if (!store?._id) return null;

  const contacts = [store?.contact_no, store?.alternative_contact_no]
    .filter(Boolean)
    .join(", ");
  const location =
    [store?.district_area_name, store?.district_name]
      .filter(Boolean)
      .join(", ") || store?.shop_address;
  const hours =
    store?.opening_time && store?.closing_time
      ? `${store.opening_time} – ${store.closing_time}`
      : null;
  const isRow = layout === "row";

  return (
    <div
      className={`flex h-full w-full gap-3 p-3 ${CARD} ${
        isRow ? "flex-row items-center md:gap-5" : "flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-gray-100 ${
          isRow
            ? "aspect-5/3 w-28 shrink-0 sm:w-40 md:w-48"
            : "aspect-2/1 w-full md:aspect-auto md:min-h-24 md:flex-1"
        }`}
      >
        <Image
          fill
          sizes={isRow ? "200px" : "(min-width: 768px) 33vw, 100vw"}
          alt={`${store?.shop_name || "Shop"} banner`}
          src={`${IMAGE_URL}/${moduleName}-store-docs/${store?.shop_banner_web}`}
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1 space-y-1.5 px-1 pb-0.5 text-sm text-gray-600">
        <div className="flex min-w-0 items-center gap-2">
          <h2
            title={store?.shop_name}
            className={`truncate font-bold tracking-tight text-gray-900 ${
              isRow ? "text-base md:text-xl" : "text-base lg:text-lg"
            }`}
          >
            {store?.shop_name}
          </h2>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              store?.is_closed
                ? "bg-[#D92D20]/10 text-[#B42318] dark:text-[#F97066]"
                : "bg-[#12B76A]/10 text-[#067647] dark:text-[#47CD89]"
            }`}
          >
            {store?.is_closed ? "Closed" : "Open"}
          </span>
        </div>
        {location && (
          <InfoLine icon={HiOutlineMapPin} title={location}>
            {location}
          </InfoLine>
        )}
        {contacts && (
          <InfoLine icon={HiOutlinePhone} title={contacts}>
            {contacts}
          </InfoLine>
        )}
        {hours && (
          <InfoLine icon={HiOutlineClock} title={hours}>
            {hours}
          </InfoLine>
        )}
      </div>
    </div>
  );
};

export default ShopInfo;
