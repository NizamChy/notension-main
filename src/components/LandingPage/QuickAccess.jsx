import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HiChevronRight } from "react-icons/hi";

const ITEMS = [
  {
    src: "/images/favorite/favorite-doctors.png",
    name: "Doctors",
    link: "/medical-services/favorite-doctor",
  },
  {
    src: "/images/favorite/favorite-consultation.png",
    name: "Consultation centers",
    link: "/medical-services/favorite-consultation",
  },
  {
    src: "/images/favorite/favorite-grocery.png",
    name: "Grocery stores",
    link: "/grocery/favorite-stores",
  },
  {
    src: "/images/favorite/favorite-medicine.png",
    name: "Medicine shops",
    link: "/medicine/favorite-stores",
  },
  {
    src: "/images/favorite/favorite-food.png",
    name: "Restaurants",
    link: "/food/store/favorite-stores",
  },
];

/** "Your favourites" shortcuts, a scrollable row on phones. */
const QuickAccess = () => (
  <section className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm md:text-base font-semibold text-gray-900">
        Your favourites
      </h2>
      <span className="text-xs text-gray-400">Saved stores &amp; doctors</span>
    </div>

    <ul className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-1 lg:grid lg:grid-cols-5 lg:overflow-visible">
      {ITEMS.map((item) => (
        <li key={item.name} className="snap-start shrink-0 lg:shrink">
          <Link
            href={item.link}
            className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 py-2 pl-2 pr-3 transition hover:border-[#EB5C2F]/40 hover:bg-white hover:shadow-sm"
          >
            <span className="relative flex h-11 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
              <Image
                src={item.src}
                alt=""
                width={56}
                height={44}
                className="h-10 w-auto object-contain"
              />
            </span>
            <span className="whitespace-nowrap text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {item.name}
            </span>
            <HiChevronRight className="ml-auto hidden text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-[#EB5C2F] xl:block" />
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default QuickAccess;
