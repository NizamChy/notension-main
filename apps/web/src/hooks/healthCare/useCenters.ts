import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  exploreCenter,
  exploreMedicalServices,
  getCentersByDistrict,
  getNearestCenters,
  PAGE_SIZE,
  searchCenters,
  type CenterType,
  type CentersByDistrict,
} from "@/lib/api/healthCare";
import { queryKeys } from "@/lib/api/queryKeys";
import { useFindDoctor, useLocation } from "./useDoctors";

// Centre reads on TanStack Query (replaces useCenter and the doctorInfo slice).

const STALE_MS = 5 * 60 * 1000;

export function useNearestCenters(centerType: CenterType) {
  const loc = useLocation();
  const query = useQuery({
    queryKey: queryKeys.healthCare.nearestCenters(centerType, loc.districtId, loc.lat, loc.lng),
    queryFn: () => getNearestCenters(centerType, loc),
    staleTime: STALE_MS,
  });
  return { centers: query.data ?? [], isLoading: query.isLoading };
}

// The banner set each centre type uses (the API's spelling, "Deltal").
const BANNER_FIELD: Record<string, keyof CentersByDistrict["banners"][number]> = {
  Hospital: "hospital_banner",
  "Diagnostic Centre": "diagnostic_center_banner",
  "Eye Care Centre": "eye_care_center_banner",
  "Deltal Care Centre": "deltal_care_center_banner",
};

/** Centres of a type in the district, 20 per page, with the type's banner. */
export function useCentersByDistrict(centerType: CenterType) {
  const { districtId } = useLocation();
  const query = useInfiniteQuery({
    queryKey: queryKeys.healthCare.centersByDistrict(centerType, districtId),
    queryFn: ({ pageParam }) => getCentersByDistrict(centerType, districtId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last: CentersByDistrict, all: CentersByDistrict[]) =>
      (last.consultationCenterInfo?.length ?? 0) < PAGE_SIZE ? undefined : all.length + 1,
    staleTime: STALE_MS,
  });

  const firstPage = query.data?.pages[0];
  const banners = firstPage?.banners?.[0];
  // Without its own banners the type falls back to the consultation centre banner.
  const fallback = useFindDoctor({ enabled: !!firstPage && !banners }).consultationCenterBanner;
  const field = BANNER_FIELD[centerType];
  const banner = firstPage
    ? banners
      ? field
        ? banners[field]
        : []
      : fallback
    : [];

  return {
    centers: query.data?.pages.flatMap((p) => p.consultationCenterInfo ?? []) ?? [],
    banner,
    isLoading: query.isLoading,
    isFetched: query.isFetched,
    hasMore: !!query.hasNextPage,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
    },
  };
}

/** Centre search; waits for more than one character like the old search. */
export function useCenterSearch(centerType: CenterType, text: string) {
  const query = useQuery({
    queryKey: queryKeys.healthCare.searchCenters(centerType, text),
    queryFn: () => searchCenters(centerType, text),
    enabled: text.length > 1,
  });
  return { centers: query.data ?? [], isLoading: query.isLoading };
}

/** A centre's page: the centre (null when unknown), its popular doctors and departments. */
export function useConsultationCenter(centerId: string | null | undefined) {
  const query = useQuery({
    queryKey: queryKeys.healthCare.center(centerId ?? ""),
    queryFn: () => exploreCenter(centerId ?? ""),
    enabled: !!centerId,
    staleTime: STALE_MS,
  });
  const center = query.data?.centerInfo?._id === centerId ? query.data?.centerInfo : null;
  return {
    center,
    popularDoctors: query.data?.popularDoctorsByCenter ?? [],
    departments: query.data?.departmentsInfoByCenter ?? [],
    isLoading: !!centerId && !query.isFetched,
    notFound: !centerId || (query.isFetched && !center),
  };
}

/** The medical services home banners for the district. */
export function useMedicalServiceBanners() {
  const { districtId } = useLocation();
  const query = useQuery({
    queryKey: queryKeys.healthCare.medicalServices(districtId),
    queryFn: () => exploreMedicalServices(districtId),
    staleTime: STALE_MS,
  });
  return query.data ?? [];
}
