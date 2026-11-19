import React from "react";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import FavoriteShop from "@/components/Food/FavoriteSection/FavoriteShop";

// Server component: the design-kit class strings live in a client module,
// so the card classes are written out here.
const page = async ({ params }) => {
  const { id } = await params;
  const catId = id || null;

  return (
    <>
      <div className="mx-auto w-full max-w-[1312px] px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <Link
          href={`/food/${catId}/find-store`}
          className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl bg-[#0C3F8E] p-6 text-white shadow-lg shadow-[#0C3F8E]/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:flex-row sm:items-center sm:p-8"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-110"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-[#EB5C2F]/30"
          />

          <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl">
            <HiOutlineBuildingStorefront />
          </span>

          <div className="relative min-w-0 flex-1">
            <p className="text-lg font-bold tracking-tight md:text-2xl">
              Find restaurants near you
            </p>
            <p className="mt-1 max-w-xl text-sm text-white/80 md:text-base">
              Discover nearby restaurants and food stores to order your
              favourites or try something new.
            </p>
          </div>

          <span className="relative inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#FFFFFF] px-5 text-sm font-semibold text-[#0C3F8E] shadow-sm sm:self-auto">
            Find nearby stores
            <HiArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      <FavoriteShop isFavoriteRoute={false} />
    </>
  );
};

export default page;
