"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { HiOutlineMapPin, HiOutlinePhone } from "react-icons/hi2";
import { useStoreItems } from "../hooks/fetchData/useStoreItems";
import { FASHION_CONTAINER } from "../shared/FashionSection";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import { PRIMARY_BUTTON, Skeleton } from "@/components/shared/UI/UI";

const imageUrl = (img) =>
  img ? `${FASHION_IMAGE_URL}/${img}` : "/png/dummyImage.png";

const StoreBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();
  const storeId = params?.shopSlugId?.split("_")[1];

  const { useStoreInfo } = useStoreItems();
  const { data: storeInfo, isLoading } = useStoreInfo(storeId);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (storeInfo?.isShowingMsg && storeInfo?.popup_message) {
      openModal();
    }
  }, [storeInfo]);

  if (isLoading)
    return (
      <div className={`${FASHION_CONTAINER} pt-4 md:pt-6`} aria-hidden>
        <Skeleton className="aspect-[2/1] w-full !rounded-2xl md:aspect-[4/1]" />
        <div className="mt-4 flex items-center gap-4 px-2">
          <Skeleton className="h-20 w-20 shrink-0 !rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-1/2 !rounded-full" />
            <Skeleton className="h-4 w-2/3 !rounded-full" />
          </div>
        </div>
      </div>
    );

  const logo = storeInfo?.shop_logo || storeInfo?.shop_banner_app;

  return (
    <>
      <div className={`${FASHION_CONTAINER} pt-4 md:pt-6`}>
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-gray-100 md:aspect-[4/1]">
          <Image
            src={imageUrl(storeInfo?.shop_banner_web)}
            alt={`${storeInfo?.shop_name || "Store"} banner`}
            fill
            sizes="(min-width: 1312px) 1248px, 100vw"
            className="hidden object-cover md:block"
            priority
          />
          <Image
            src={imageUrl(storeInfo?.shop_banner_app)}
            alt={`${storeInfo?.shop_name || "Store"} banner`}
            fill
            sizes="100vw"
            className="block object-cover md:hidden"
            priority
          />
        </div>

        <div className="relative flex flex-col gap-3 px-1 sm:flex-row sm:items-end sm:gap-5 sm:px-6">
          <div className="relative -mt-10 h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-[color:var(--background)] bg-gray-100 shadow-md sm:-mt-12 sm:h-24 sm:w-24">
            <Image
              src={imageUrl(logo)}
              alt={`${storeInfo?.shop_name || "Store"} logo`}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 sm:pb-1">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
              {storeInfo?.shop_name}
            </h1>
            <div className="mt-1.5 flex flex-col gap-1 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
              {storeInfo?.contact_no && (
                <a
                  href={`tel:${storeInfo.contact_no}`}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-gray-900"
                >
                  <HiOutlinePhone className="shrink-0" />
                  <span className="tabular-nums">{storeInfo.contact_no}</span>
                </a>
              )}
              {storeInfo?.shop_address && (
                <span className="inline-flex items-start gap-1.5">
                  <HiOutlineMapPin className="mt-0.5 shrink-0" />
                  <span>{storeInfo.shop_address}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <div className="relative mx-auto w-full max-w-md rounded-2xl bg-white px-6 pb-6 md:px-8 md:pb-8">
          <DotLottieReact
            src="https://lottie.host/a93cc943-48e2-47b5-91bb-6c41e7a3071c/DLXos4RSOw.lottie"
            loop
            autoplay
          />

          <p className="mb-6 text-center leading-relaxed text-gray-600">
            {storeInfo?.popup_message}
          </p>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={closeModal}
              className={`${PRIMARY_BUTTON} min-w-32`}
            >
              Got it
            </button>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default StoreBanner;
