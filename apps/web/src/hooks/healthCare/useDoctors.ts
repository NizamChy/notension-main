import { useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  exploreFindDoctor,
  getDoctorProfile,
  getDoctorsByCenter,
  getDoctorsByDept,
  getNearestDoctors,
  PAGE_SIZE,
  type Chamber,
} from "@/lib/api/healthCare";
import { queryKeys } from "@/lib/api/queryKeys";
import { useSessionStore } from "@/stores/sessionStore";

// Doctor reads on TanStack Query (replaces useDoctor and the doctorInfo slice).

const STALE_MS = 5 * 60 * 1000;

/** The saved delivery location (district and coordinates). */
export function useLocation() {
  const lat = useSessionStore((s) => s.userLatitude);
  const lng = useSessionStore((s) => s.userLongitude);
  const districtId = useSessionStore((s) => s.districtId);
  return { lat, lng, districtId };
}

/** The doctor home: departments, popular doctors and banners for the district. */
export function useFindDoctor({ enabled = true }: { enabled?: boolean } = {}) {
  const { districtId } = useLocation();
  const query = useQuery({
    queryKey: queryKeys.healthCare.findDoctor(districtId),
    queryFn: () => exploreFindDoctor(districtId),
    enabled,
    staleTime: STALE_MS,
  });
  const banners = query.data?.banner?.[0];
  return {
    departments: query.data?.allDepartments ?? [],
    popularDoctors: query.data?.popularDoctors ?? [],
    findDoctorBanner: banners?.find_doctor_banner ?? [],
    consultationCenterBanner: banners?.consultation_center_banner ?? [],
    nearestDoctorBanner: banners?.nearest_doctor_banner ?? [],
    isLoading: query.isLoading,
  };
}

export function useNearestDoctors() {
  const loc = useLocation();
  const query = useQuery({
    queryKey: queryKeys.healthCare.nearestDoctors(loc.districtId, loc.lat, loc.lng),
    queryFn: () => getNearestDoctors(loc),
    staleTime: STALE_MS,
  });
  return { doctors: query.data ?? [], isLoading: query.isLoading, isFetched: query.isFetched };
}

/** A paged doctor list: pages of PAGE_SIZE, a short page ends it (as before). */
export type PagedDoctors = {
  doctors: Chamber[];
  isLoading: boolean;
  /** True once the first page has answered (or failed). */
  isFetched: boolean;
  hasMore: boolean;
  loadMore: () => void;
};

export const nextPage = (last: unknown[], all: unknown[][]) =>
  last.length < PAGE_SIZE ? undefined : all.length + 1;

function usePagedDoctors(
  key: readonly unknown[],
  fetchPage: (page: number) => Promise<Chamber[]>,
  enabled: boolean,
): PagedDoctors {
  const query = useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled,
    staleTime: STALE_MS,
  });
  return {
    doctors: query.data?.pages.flat() ?? [],
    isLoading: query.isLoading,
    isFetched: query.isFetched,
    hasMore: !!query.hasNextPage,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage();
    },
  };
}

export function useDoctorsByDept(deptId: string | null | undefined): PagedDoctors {
  const { districtId } = useLocation();
  return usePagedDoctors(
    queryKeys.healthCare.doctorsByDept(deptId ?? "", districtId),
    (page) => getDoctorsByDept(deptId ?? "", districtId, page),
    !!deptId,
  );
}

export function useDoctorsByCenter(
  centerId: string | null | undefined,
  deptId: string | null | undefined,
): PagedDoctors {
  return usePagedDoctors(
    queryKeys.healthCare.doctorsByCenter(centerId ?? "", deptId ?? ""),
    (page) => getDoctorsByCenter(centerId ?? "", deptId ?? "", page),
    !!centerId,
  );
}

/** Every chamber of a doctor. */
export function useDoctorProfile(doctorId: string | null | undefined) {
  const query = useQuery({
    queryKey: queryKeys.healthCare.doctorProfile(doctorId ?? ""),
    queryFn: () => getDoctorProfile(doctorId ?? ""),
    enabled: !!doctorId,
    staleTime: STALE_MS,
  });
  return {
    // Undefined while loading; a failed request reads as "no chambers" (not found).
    chambers: query.data ?? (query.isError ? [] : undefined),
    isLoading: query.isLoading || (!!doctorId && !query.isFetched),
  };
}

/**
 * The chamber a profile shows and books: the one at `centerId`, or the
 * doctor's first chamber when the link has no centre ("null").
 */
export function chamberAt(chambers: Chamber[] | undefined, centerId: string | null | undefined) {
  if (!chambers) return undefined;
  return centerId && centerId !== "null"
    ? chambers.find((c) => c.consultationCenterInfo?._id === centerId)
    : chambers[0];
}

/** The booking page for a doctor's chamber. */
export const bookingPath = (doctorId: string | undefined, centerId: string | null | undefined) =>
  `/medical-services/doctor/book-appointment?doctor=${doctorId ?? ""}&center=${centerId || "null"}`;

/** The chamber the booking page is for, from its `?doctor=&center=` URL. */
export function useBookingChamber() {
  const params = useSearchParams();
  const doctorId = params.get("doctor");
  const { chambers, isLoading } = useDoctorProfile(doctorId);
  return { chamber: chamberAt(chambers, params.get("center")), isLoading, hasDoctor: !!doctorId };
}
