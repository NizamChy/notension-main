import React from "react";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { FASHION_CONTAINER } from "../shared/FashionSection";
import { EmptyState, PRIMARY_BUTTON } from "@/components/shared/UI/UI";

const EmptyWishlist = () => {
  return (
    <div className={`${FASHION_CONTAINER} min-h-content py-10 md:py-16`}>
      <EmptyState
        icon={<FiHeart />}
        title="Your wishlist is empty"
        text="Tap the heart on any product to save it here for later."
        action={
          <Link href="/fashion-lifestyle" className={PRIMARY_BUTTON}>
            Start shopping
          </Link>
        }
      />
    </div>
  );
};

export default EmptyWishlist;
