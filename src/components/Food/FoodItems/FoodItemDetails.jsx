"use client";

import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { HiChevronLeft } from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { getApiClient } from "@/lib/apiClient";
import React, { useEffect, useState } from "react";
import { FOOD_URL } from "@/api-endpoints/env";
import DishCartControl from "./DishCartControl";
import { discountLabelOf, dishImageOf } from "./dishUtils";
import useFoodItems from "@/hooks/fetch-data/useFoodItems";
import { formatTaka, PrimaryButton } from "@/components/shared/CartUI/CartUI";
import {
  Badge,
  CARD,
  EmptyState,
  Skeleton,
  SECONDARY_BUTTON,
} from "@/components/shared/UI/UI";
import {
  EXPLORE_FOOD_STORE,
  FOOD_ITEMS_IMAGES,
} from "@/api-endpoints/api-endpoint";

const DetailsSkeleton = () => (
  <div className={`${CARD} overflow-hidden md:grid md:grid-cols-2`}>
    <Skeleton className="aspect-[4/3] w-full rounded-none" />
    <div className="space-y-3 p-5 sm:p-6 lg:p-8">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-28" />
      <Skeleton className="mt-6 h-12 w-full rounded-full" />
    </div>
  </div>
);

const FoodItemDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [fetchedItem, setFetchedItem] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const params = useParams();
  const productId = params?.productId;

  const { currentItemDetails } = useSelector((state) => state.userChoice);
  const storeName = useSelector(
    (state) => state.dashboard.visitedFoodStore?.shop_name
  );

  // Redux has the item when it was opened from a list. A direct link (or a
  // reload with cleared state) looks it up in the store's menu instead (the
  // food backend has no item-by-id endpoint).
  const hasReduxItem = !!productId && currentItemDetails?._id === productId;
  const item = hasReduxItem ? currentItemDetails : fetchedItem;

  useEffect(() => {
    if (!productId || hasReduxItem) return;

    let cancelled = false;
    setIsFetching(true);
    setNotFound(false);

    getApiClient(FOOD_URL)
      .get(EXPLORE_FOOD_STORE, {
        params: {
          storeId: params?.storeId,
          custom_store_id: params?.customStoreId,
        },
      })
      .then((res) => {
        if (cancelled) return;
        const found = res?.data?.result?.allProduct?.find(
          (product) => product?._id === productId
        );
        if (found) {
          setFetchedItem(found);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setIsFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId, hasReduxItem, params?.storeId, params?.customStoreId]);
  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useFoodItems();

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsLoading(true);
    try {
      await addToCart(item);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await incrementQty(itemId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await decrementQty(itemId);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const itemQty = getCurrentQty(item);
    setCurrentQuantity(itemQty);
  }, [item, incrementQty, decrementQty]);

  const menuPath = `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}`;

  const backLink = (
    <Link
      href={menuPath}
      className="mb-4 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
    >
      <HiChevronLeft className="text-lg" />
      Back to menu
    </Link>
  );

  if (!item && isFetching) {
    return (
      <div className="mx-auto max-w-5xl">
        {backLink}
        <DetailsSkeleton />
      </div>
    );
  }

  if (!item && notFound) {
    return (
      <div className="mx-auto max-w-5xl">
        <EmptyState
          title="Dish not found"
          text="This dish may have been removed from the menu."
          action={
            <Link href={menuPath} className={SECONDARY_BUTTON}>
              Back to menu
            </Link>
          }
        />
      </div>
    );
  }

  if (!item) return null;

  const name = item?.product_title_eng || "Dish";
  const discount = discountLabelOf(item);
  const hasMrp = item?.sale_price < item?.max_retail_price;

  return (
    <div className="mx-auto max-w-5xl">
      {backLink}

      <article className={`${CARD} overflow-hidden md:grid md:grid-cols-2`}>
        <div className="relative aspect-[4/3] w-full bg-gray-100 md:aspect-auto md:min-h-[380px]">
          <Image
            src={dishImageOf(item, FOOD_ITEMS_IMAGES)}
            alt={name}
            fill
            preload
            sizes="(min-width: 1024px) 512px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          {discount && (
            <span className="absolute left-4 top-4 rounded-full bg-[#EB5C2F] px-3 py-1 text-xs font-semibold text-white shadow-sm">
              {discount}
            </span>
          )}
        </div>

        <div className="flex flex-col p-5 sm:p-6 lg:p-8">
          {storeName && (
            <p className="text-xs font-semibold uppercase tracking-wider text-[#EB5C2F]">
              {storeName}
            </p>
          )}
          <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl">
            {name}
          </h1>
          {item?.product_title_beng && (
            <p className="mt-1 text-base text-gray-500">
              {item.product_title_beng}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* {item?.is_available ? ( */}
            {item ? (
              <Badge tone="green">Available</Badge>
            ) : (
              <Badge tone="red">Not available</Badge>
            )}
            {item?.pack_size && <Badge>{item.pack_size}</Badge>}
            {item?.unit_symbol && <Badge>Unit: {item.unit_symbol}</Badge>}
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-bold tabular-nums text-gray-900">
              {formatTaka(item?.sale_price)}
            </span>
            {hasMrp && (
              <span className="text-base tabular-nums text-gray-400 line-through">
                {formatTaka(item?.max_retail_price)}
              </span>
            )}
          </div>
          {item?.less > 0 && hasMrp && (
            <p className="mt-1 text-sm font-medium text-[#067647] dark:text-[#47CD89]">
              You save{" "}
              <span className="tabular-nums">
                {formatTaka(item?.max_retail_price - item?.sale_price)}
              </span>
            </p>
          )}

          <div className="mt-6 border-t border-gray-200 pt-5 md:mt-auto">
            {currentQuantity === 0 ? (
              <PrimaryButton onClick={handleAddToCart} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Adding…
                  </>
                ) : (
                  <>
                    <HiOutlineShoppingBag className="text-lg" />
                    Add to cart
                    <span className="tabular-nums opacity-80">
                      · {formatTaka(item?.sale_price)}
                    </span>
                  </>
                )}
              </PrimaryButton>
            ) : (
              <div className="flex items-center gap-3">
                <DishCartControl
                  variant="inline"
                  name={name}
                  disabled={isLoading}
                  quantity={currentQuantity}
                  onIncrement={(e) => handleIncrement(e, item._id)}
                  onDecrement={(e) => handleDecrement(e, item._id)}
                />
                <div className="ml-auto text-right">
                  <p className="text-xs text-gray-500">In your cart</p>
                  <p className="text-lg font-semibold tabular-nums text-gray-900">
                    {formatTaka((item?.sale_price || 0) * currentQuantity)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default FoodItemDetails;
