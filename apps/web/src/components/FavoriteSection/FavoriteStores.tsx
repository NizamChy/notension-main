"use client";

import React, { type Key } from "react";
import Link from "next/link";
import { HiOutlineHeart } from "react-icons/hi2";
import ShopInfoCard from "@/components/ShopInfoSection/ShopInfoCard";
import {
  PageHeader,
  EmptyState,
  SectionTitle,
  PRIMARY_BUTTON,
  PAGE_CONTAINER,
} from "@/components/shared/UI/UI";

// A saved store entry (`storeId` plus the saved shop fields).
type SavedStore = Record<string, unknown>;

type Props<S extends SavedStore> = {
  stores: S[];
  type: string;
  label: string;
  isFavoriteRoute: boolean;
  onStoreClick: (shop: S) => void;
  favoritesHref: string;
  browseHref: string;
};

// Favourite-store grid shared by the grocery, medicine and food modules.
// On the favourites page (`isFavoriteRoute`) it is a full page with an empty
// state; on a module home page it is a section that hides when empty.
const FavoriteStores = <S extends SavedStore>({
  stores,
  type,
  label,
  isFavoriteRoute,
  onStoreClick,
  favoritesHref,
  browseHref,
}: Props<S>) => {
  const count = stores?.length || 0;

  if (!isFavoriteRoute && count < 1) return null;

  return (
    <section className={`${PAGE_CONTAINER} py-6 md:py-10`}>
      {isFavoriteRoute ? (
        <PageHeader
          title={`Favourite ${label} stores`}
          subtitle={
            count > 0
              ? `${count} saved ${count === 1 ? "store" : "stores"}`
              : "Stores you save will show up here."
          }
        />
      ) : (
        <SectionTitle
          title="Your favourite stores"
          subtitle="Quickly reorder from the stores you love."
          href={favoritesHref}
        />
      )}

      {count > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {stores.map((shop) => (
            <ShopInfoCard
              // A saved store's storeId is its id string.
              key={shop?.storeId as Key | undefined}
              onClick={() => onStoreClick(shop)}
              shop={shop}
              type={type}
              isFavorite={true}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<HiOutlineHeart />}
          title={`No favourite ${label} stores yet`}
          text="Tap the heart on any store to save it here for quick access."
          action={
            browseHref && (
              <Link href={browseHref} className={PRIMARY_BUTTON}>
                Browse stores
              </Link>
            )
          }
          className="min-h-[50vh]"
        />
      )}
    </section>
  );
};

export default FavoriteStores;
