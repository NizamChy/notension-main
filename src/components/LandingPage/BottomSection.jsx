import React from "react";
import HomeBannerCard from "./HomeBannerCard";
import Link from "next/link";
import { BsTelephone } from "react-icons/bs";

const APP_URL =
  "https://play.google.com/store/apps/details?id=com.bitsnotension";

const CARDS = [
  { title: "Find Nurse", image: "/images/home/home-banner-9.webp" },
  { title: "Find Ambulance", image: "/images/home/home-banner-10.webp" },
  { title: "Find Blood Donor", image: "/images/home/home-banner-11.webp" },
];

// Stacked on phones (three columns made the labels unreadably small),
// three across from `sm` up.
const BottomSection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full">
      {CARDS.map(({ title, image }) => (
        <Link
          key={title}
          href={APP_URL}
          prefetch={false}
          target="_blank"
          className="block"
        >
          <HomeBannerCard
            size="sm"
            width={416}
            height={350}
            image={image}
            title={title}
            actionText="Contact Now"
            ActionIcon={BsTelephone}
          />
        </Link>
      ))}
    </div>
  );
};

export default BottomSection;
