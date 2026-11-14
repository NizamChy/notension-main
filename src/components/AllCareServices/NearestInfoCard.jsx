"use client";

import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { HiArrowRight } from "react-icons/hi";
import { HiStar, HiOutlineMapPin } from "react-icons/hi2";
import { MdStorefront } from "react-icons/md";
import { handleAllCareReducer } from "@/redux/allCareReducer";
import { SERVICE_PROVIDER_IMAGES } from "@/api-endpoints/api-endpoint";

// Provider card: banner, logo, name, rating, address and distance. Opens the
// provider's details page.
const NearestInfoCard = ({ provider }) => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const handleProviderClick = () => {
    dispatch(
      handleAllCareReducer({
        type: "SAVE_CURRENT_PROVIDER_DETAILS",
        data: provider,
      })
    );

    // The ids let the details page load the provider on a direct link.
    router.push(
      `/all-care-services/provider-details?serviceId=${params?.serviceId}&id=${provider?._id}`
    );
  };

  const rating = Number(provider?.rating);
  const hasRating = Number.isFinite(rating) && rating > 0 && rating <= 5;
  const reviews = Number(provider?.total_reviews);

  return (
    <button
      type="button"
      onClick={handleProviderClick}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-left shadow-sm shadow-gray-900/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F]"
    >
      <span className="relative block aspect-[2/1] w-full overflow-hidden bg-gray-100">
        {provider?.provider_banner_app && (
          <Image
            src={`${SERVICE_PROVIDER_IMAGES}/${provider.provider_banner_app}`}
            alt=""
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </span>

      <span className="flex flex-1 flex-col px-4 pb-4">
        <span className="-mt-7 flex items-end justify-between gap-2">
          <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-[#FFFFFF] shadow-md shadow-gray-900/10">
            {provider?.provider_logo ? (
              <Image
                src={`${SERVICE_PROVIDER_IMAGES}/${provider.provider_logo}`}
                alt=""
                fill
                sizes="56px"
                className="object-contain p-1"
              />
            ) : (
              <MdStorefront aria-hidden="true" className="text-2xl text-[#0C3F8E]/60" />
            )}
          </span>

          {hasRating && (
            <span className="mb-0.5 inline-flex items-center gap-1 rounded-full bg-[#F79009]/10 px-2 py-0.5 text-xs font-semibold text-[#B54708] dark:text-[#FDB022]">
              <HiStar aria-hidden="true" className="text-sm text-[#F79009]" />
              {rating.toFixed(1)}
              {Number.isFinite(reviews) && reviews > 0 && (
                <span className="font-medium text-gray-500">
                  ({reviews.toLocaleString()})
                </span>
              )}
            </span>
          )}
        </span>

        <span className="mt-3 line-clamp-1 text-base font-semibold text-gray-900 transition-colors group-hover:text-[#0C3F8E] dark:group-hover:text-[#7FB2FF]">
          {provider?.provider_name}
        </span>

        {provider?.address && (
          <span className="mt-1 flex gap-1.5 text-sm text-gray-500">
            <HiOutlineMapPin aria-hidden="true" className="mt-0.5 shrink-0 text-base" />
            <span className="line-clamp-2">{provider.address}</span>
          </span>
        )}

        <span className="mt-auto flex items-center justify-between gap-2 pt-4">
          {provider?.distance != null ? (
            <span className="rounded-full bg-[#0C3F8E]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0C3F8E] dark:text-[#7FB2FF]">
              {(provider.distance / 1000).toFixed(2)} km away
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0C3F8E] dark:text-[#7FB2FF]">
            View details
            <HiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </span>
    </button>
  );
};

export default NearestInfoCard;
