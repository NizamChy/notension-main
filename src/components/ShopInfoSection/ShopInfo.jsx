"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { IMAGE_URL } from "@/api-endpoints/env";
import { IoCallOutline, IoLocationOutline } from "react-icons/io5";

const STORE_STATE_KEYS = {
  food: "visitedFoodStore",
  grocery: "visitedGroceryStore",
  medicine: "visitedMedicineStore",
};

const ACCENT = {
  food: "text-primaryFood",
  grocery: "text-primaryGrocery",
  medicine: "text-primaryMedicine",
};

// The shop card on a store's home page.
// - layout="card" (grocery / medicine): sits beside the hero slider; on md+ it
//   stretches to the slider's height, the banner takes the free space
//   (object-cover) and the details stay a compact block underneath.
// - layout="row" (food): a full-width store header — banner thumbnail on the
//   left, details on the right.
const ShopInfo = ({ moduleName = "medicine", layout = "card" }) => {
  const store = useSelector(
    (state) => state.dashboard[STORE_STATE_KEYS[moduleName]],
  );

  if (!store?._id) return null;

  const contacts = [store?.contact_no, store?.alternative_contact_no]
    .filter(Boolean)
    .join(", ");
  const location =
    [store?.district_area_name, store?.district_name]
      .filter(Boolean)
      .join(", ") || store?.shop_address;
  const isRow = layout === "row";

  return (
    <div
      className={`h-full w-full flex gap-3 p-3 bg-white border border-gray-200 rounded-2xl shadow-sm ${
        isRow ? "flex-row items-center md:gap-5" : "flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-gray-100 ${
          isRow
            ? "w-28 sm:w-40 md:w-48 shrink-0 aspect-[5/3]"
            : "w-full aspect-[2/1] md:aspect-auto md:flex-1 md:min-h-24"
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

      <div className="min-w-0 flex-1 space-y-1 px-1 text-sm text-gray-600">
        <h2
          title={store?.shop_name}
          className={`font-semibold text-gray-900 truncate ${
            isRow ? "text-base md:text-xl" : "text-base lg:text-lg"
          }`}
        >
          {store?.shop_name}
        </h2>
        {contacts && (
          <p className="flex items-center gap-2 min-w-0">
            <IoCallOutline
              className={`shrink-0 text-base ${ACCENT[moduleName]}`}
            />
            <span className="truncate" title={contacts}>
              {contacts}
            </span>
          </p>
        )}
        {location && (
          <p className="flex items-center gap-2 min-w-0">
            <IoLocationOutline
              className={`shrink-0 text-base ${ACCENT[moduleName]}`}
            />
            <span className="truncate" title={location}>
              {location}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ShopInfo;
