"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { IMAGE_URL } from "@/api-endpoints/env";
import { HiStar } from "react-icons/hi";
import {
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineReceiptPercent,
  HiOutlineShoppingBag,
  HiOutlineTruck,
} from "react-icons/hi2";
import { CARD, Skeleton } from "@/components/shared/UI/UI";
import { formatTaka } from "@/components/shared/CartUI/CartUI";

// Whole-taka amounts for the info chips (৳30, not ৳30.00).
const taka = (value) => formatTaka(value).replace(/\.00$/, "");

const InfoChip = ({ icon, children }) => (
  <li className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 sm:text-sm">
    <span className="text-base text-gray-500" aria-hidden="true">
      {icon}
    </span>
    {children}
  </li>
);

export const RestaurantHeaderSkeleton = () => (
  <div className={`${CARD} overflow-hidden`}>
    <Skeleton className="aspect-[16/9] w-full rounded-none sm:aspect-[21/9] lg:aspect-[3/1]" />
    <div className="px-4 pb-5 sm:px-6">
      <Skeleton className="-mt-10 h-20 w-20 rounded-2xl border-4 border-white sm:h-24 sm:w-24" />
      <Skeleton className="mt-4 h-7 w-56" />
      <Skeleton className="mt-2 h-4 w-72 max-w-full" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
    </div>
  </div>
);

// Restaurant page header: cover photo, logo, name, cuisines, area, rating,
// delivery time / fee, minimum order, hours, offer and contact.
const RestaurantHeader = ({ compact = false }) => {
  const params = useParams();
  const store = useSelector((state) => state.dashboard.visitedFoodStore);
  const { productCategory } = useSelector((state) => state.itemsByStore);

  if (!store?._id) return null;

  const homePath = `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}`;
  const bannerSrc = store?.shop_banner_web || store?.shop_banner_app;
  const logoSrc = store?.shop_logo || bannerSrc;

  const cuisines = (productCategory || [])
    .map((c) => c?.categoryName || c?.categoryInfo?.category_name)
    .filter(Boolean)
    .slice(0, 3);
  const area =
    [store?.district_area_name, store?.district_name]
      .filter(Boolean)
      .join(", ") || store?.shop_address;
  const phones = [store?.contact_no, store?.alternative_contact_no].filter(
    Boolean
  );

  const minFee = Number(store?.min_delivery_charge) || 0;
  const maxFee = Number(store?.max_delivery_charge) || 0;
  const deliveryFee =
    store?.min_delivery_charge === undefined &&
    store?.max_delivery_charge === undefined
      ? null
      : maxFee <= 0
        ? "Free delivery"
        : minFee > 0 && minFee !== maxFee
          ? `${taka(minFee)}–${taka(maxFee)} delivery`
          : `${taka(maxFee)} delivery`;

  const offer =
    store?.delivery_notice ||
    (store?.less > 0
      ? `${
          store?.less_type === "Percent" ? `${store.less}%` : taka(store.less)
        } off${
          store?.minimum_order_for_less > 0
            ? ` on orders above ${taka(store.minimum_order_for_less)}`
            : ""
        }`
      : null);

  const isClosed = !!store?.is_closed;
  const rating = Number(store?.rating) || 0;

  return (
    <section
      aria-label={store?.shop_name}
      className={`${CARD} overflow-hidden`}
    >
      {!compact && (
        <div className="relative aspect-[16/9] w-full bg-gray-100 sm:aspect-[21/9] lg:aspect-[3/1]">
          {bannerSrc && (
            <Image
              fill
              preload
              sizes="(min-width: 1312px) 1200px, 100vw"
              alt={`${store?.shop_name || "Restaurant"} cover`}
              src={`${IMAGE_URL}/food-store-docs/${bannerSrc}`}
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/10" />
          <span
            className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#FFFFFF] px-3 py-1 text-xs font-semibold shadow-sm sm:left-4 sm:top-4 ${
              isClosed ? "text-[#B42318]" : "text-[#067647]"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isClosed ? "bg-[#D92D20]" : "bg-[#12B76A]"
              }`}
            />
            {isClosed ? "Closed" : "Open now"}
          </span>
        </div>
      )}

      <div className="px-4 pb-5 sm:px-6 sm:pb-6">
        <div
          className={`flex flex-wrap items-end gap-3 sm:gap-4 ${
            compact ? "pt-4 sm:pt-5" : "-mt-10 sm:-mt-12"
          }`}
        >
          <div
            className={`relative shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md shadow-gray-900/10 ${
              compact ? "h-16 w-16" : "h-20 w-20 sm:h-24 sm:w-24"
            }`}
          >
            {logoSrc && (
              <Image
                fill
                sizes="96px"
                alt={`${store?.shop_name || "Restaurant"} logo`}
                src={`${IMAGE_URL}/food-store-docs/${logoSrc}`}
                className="object-cover"
              />
            )}
          </div>

          <div className="min-w-0 flex-1 basis-56 pb-0.5">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
              <Link href={homePath} className="hover:underline">
                {store?.shop_name}
              </Link>
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm text-gray-500">
              {rating > 0 && (
                <>
                  <span className="inline-flex items-center gap-0.5 font-semibold text-gray-900">
                    <HiStar className="text-base text-[#F79009]" aria-hidden="true" />
                    <span className="tabular-nums">{rating.toFixed(1)}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              {cuisines.length > 0 && (
                <>
                  <span>{cuisines.join(", ")}</span>
                  {area && <span aria-hidden="true">·</span>}
                </>
              )}
              {area && <span>{area}</span>}
            </p>
          </div>
        </div>

        <ul className="mt-4 flex flex-wrap gap-2">
          {store?.delivery_time && (
            <InfoChip icon={<HiOutlineClock />}>{store.delivery_time}</InfoChip>
          )}
          {deliveryFee && (
            <InfoChip icon={<HiOutlineTruck />}>
              <span className="tabular-nums">{deliveryFee}</span>
            </InfoChip>
          )}
          {store?.min_purchage_amount > 0 && (
            <InfoChip icon={<HiOutlineShoppingBag />}>
              Min. order{" "}
              <span className="tabular-nums">
                {taka(store.min_purchage_amount)}
              </span>
            </InfoChip>
          )}
          {store?.opening_time && store?.closing_time && (
            <InfoChip icon={<HiOutlineClock />}>
              {store.opening_time} – {store.closing_time}
            </InfoChip>
          )}
        </ul>

        {offer && (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-[#EB5C2F]/10 px-3 py-2.5 text-sm font-semibold text-[#C4320A] dark:text-[#FF8A5B]">
            <HiOutlineReceiptPercent className="shrink-0 text-lg" aria-hidden="true" />
            {offer}
          </p>
        )}

        {!compact && (store?.shop_address || phones.length > 0) && (
          <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-4 text-sm text-gray-600 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {store?.shop_address && (
              <p className="flex min-w-0 items-start gap-2">
                <HiOutlineMapPin className="mt-0.5 shrink-0 text-base text-gray-400" aria-hidden="true" />
                <span>{store.shop_address}</span>
              </p>
            )}
            {phones.length > 0 && (
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <HiOutlinePhone className="shrink-0 text-base text-gray-400" aria-hidden="true" />
                {phones.map((phone, index) => (
                  <React.Fragment key={phone}>
                    {index > 0 && <span className="text-gray-300">/</span>}
                    <a
                      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                      className="font-medium text-gray-700 hover:text-[#0C3F8E] hover:underline dark:hover:text-[#7FB2FF]"
                    >
                      {phone}
                    </a>
                  </React.Fragment>
                ))}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RestaurantHeader;
