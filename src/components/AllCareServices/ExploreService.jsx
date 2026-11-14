"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { HiChevronLeft } from "react-icons/hi";
import { MdHomeRepairService } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";
import NearestInfoCard from "./NearestInfoCard";
import React, { useEffect, useState } from "react";
import PopularInfoSlider from "./PopularInfoSlider";
import ServiceBannerSlider from "./ServiceBannerSlider";
import { useAllCareService } from "@/hooks/fetch-data/useAllCareService";
import { getAllCareServiceIcon } from "@/utils/allCareServiceIcon";
import {
  EmptyState,
  PAGE_CONTAINER,
  SECONDARY_BUTTON,
  SectionTitle,
  Skeleton,
} from "@/components/shared/UI/UI";

const PROVIDER_GRID =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5";

const ProviderSkeletons = () => (
  <div className={PROVIDER_GRID} aria-busy="true">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
      >
        <Skeleton className="aspect-[2/1] w-full rounded-none" />
        <div className="space-y-2.5 p-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

const ExploreService = () => {
  const [pageNo, setPageNo] = useState(1);
  const [popularInfo, setPopularInfo] = useState([]);
  const [nearestInfo, setNearestInfo] = useState([]);
  // Set once the first provider response arrives, so the empty state does
  // not flash before the request starts.
  const [loaded, setLoaded] = useState(false);

  const params = useParams();
  const serviceId = params?.serviceId || null;

  const { exploreCareProvider, progressing } = useAllCareService();
  // Separate hook instance so loading the service list does not toggle the
  // providers' loader.
  const { exploreAllCareService } = useAllCareService();
  const {
    currentService,
    allServicesInfo,
    servicesDistrictId,
    isLoading: servicesLoading,
  } = useSelector((state) => state.allCare);
  const districtId = useSelector((state) => state.user.districtId);

  // The clicked service is saved in Redux, but on a direct link or reload it
  // can be missing or belong to another service, so fall back to looking the
  // id up in the service list.
  const service =
    currentService?._id === serviceId
      ? currentService
      : allServicesInfo?.find((item) => item?._id === serviceId);

  const slider = service?.sliderInfo?.service_slider;
  const icon = service ? getAllCareServiceIcon(service) : null;

  // Load the service list when it is missing for this district and the
  // service could not be found otherwise.
  useEffect(() => {
    if (service || servicesDistrictId === districtId) return;
    return exploreAllCareService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, districtId, !!service]);

  // Providers are per district: refetch when the user's location changes.
  useEffect(() => {
    return exploreCareProvider(
      serviceId,
      (list) => {
        setPopularInfo(list);
        setLoaded(true);
      },
      setNearestInfo,
      pageNo
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, districtId, pageNo]);

  const isLoadingProviders = progressing || !loaded;
  const hasProviders = popularInfo?.length > 0 || nearestInfo?.length > 0;

  return (
    <div className={`${PAGE_CONTAINER} flex flex-col gap-8 py-5 md:gap-12 md:py-8`}>
      <header>
        <Link
          href="/all-care-services"
          className="mb-4 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <HiChevronLeft aria-hidden="true" className="text-lg" />
          All services
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-[#FFFFFF] md:h-16 md:w-16">
            {icon ? (
              <Image src={icon} alt="" fill sizes="64px" className="object-contain p-0.5" />
            ) : (
              <MdHomeRepairService aria-hidden="true" className="text-2xl text-[#0C3F8E]/60" />
            )}
          </span>
          <div className="min-w-0">
            {service?.service_name_eng || !servicesLoading ? (
              <h1 className="text-xl font-bold tracking-tight text-gray-900 md:text-3xl">
                {service?.service_name_eng || "Service providers"}
              </h1>
            ) : (
              <Skeleton className="h-7 w-56 max-w-full md:h-9" />
            )}
            <p className="mt-0.5 text-sm text-gray-500 md:text-base">
              {service?.service_name_bn
                ? `${service.service_name_bn} · Verified providers near you`
                : "Verified providers near you"}
            </p>
          </div>
        </div>
      </header>

      {slider?.length > 0 && (
        <div className="mx-auto w-full max-w-[880px]">
          <ServiceBannerSlider slider={slider} />
        </div>
      )}

      {isLoadingProviders ? (
        <section>
          <Skeleton className="mb-5 h-7 w-52" />
          <ProviderSkeletons />
        </section>
      ) : !hasProviders ? (
        <EmptyState
          icon={<HiOutlineUserGroup />}
          title="No providers for this service yet"
          text="We couldn't find providers for this service in your area. Try another location or browse other services."
          action={
            <Link href="/all-care-services" className={SECONDARY_BUTTON}>
              Browse all services
            </Link>
          }
        />
      ) : (
        <>
          <PopularInfoSlider slider={popularInfo} />

          {nearestInfo?.length > 0 && (
            <section>
              <SectionTitle
                title="Nearest to you"
                subtitle="Sorted by distance from your location"
              />
              <div className={PROVIDER_GRID}>
                {nearestInfo.map((provider) => (
                  <NearestInfoCard key={provider?._id} provider={provider} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default ExploreService;
