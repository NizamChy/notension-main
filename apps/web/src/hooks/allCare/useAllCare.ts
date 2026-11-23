import { useQuery } from "@tanstack/react-query";
import { exploreProviders, exploreServices, type CareProvider } from "@/lib/api/allCare";
import { queryKeys } from "@/lib/api/queryKeys";
import { useSessionStore } from "@/stores/sessionStore";

// All Care reads on TanStack Query (replaces useAllCareService and the
// allCare slice). The district is part of every key, so data fetched for
// another district never shows.

const STALE_MS = 5 * 60 * 1000;

/** The district's service categories and the home page sliders. */
export function useCareServices() {
  const districtId = useSessionStore((s) => s.districtId);
  const query = useQuery({
    queryKey: queryKeys.allCare.services(districtId),
    queryFn: () => exploreServices(districtId),
    staleTime: STALE_MS,
  });
  return {
    services: query.data?.servicesType ?? [],
    slider: query.data?.sliderByDistrict?.[0],
    isLoading: query.isLoading,
  };
}

/** The service in the URL, looked up in the district's list. */
export function useCareService(serviceId: string | null | undefined) {
  const { services, isLoading } = useCareServices();
  return { service: services.find((s) => s._id === serviceId), isLoading };
}

/** A service's providers: popular in the district and nearest to the user. */
export function useCareProviders(serviceId: string | null | undefined) {
  const lat = useSessionStore((s) => s.userLatitude);
  const lng = useSessionStore((s) => s.userLongitude);
  const districtId = useSessionStore((s) => s.districtId);
  const query = useQuery({
    queryKey: queryKeys.allCare.providers(serviceId ?? "", districtId, lat, lng),
    queryFn: () => exploreProviders(serviceId ?? "", { districtId, lat, lng }),
    enabled: !!serviceId,
    staleTime: STALE_MS,
  });
  return {
    popular: query.data?.careProviderByDistrict ?? [],
    nearest: query.data?.nearestCareProvider ?? [],
    isLoading: !!serviceId && !query.isFetched,
  };
}

/** The provider in the URL, from its service's provider lists (there is no provider endpoint). */
export function useCareProvider(
  serviceId: string | null | undefined,
  providerId: string | null | undefined,
): { provider: CareProvider | undefined; isLoading: boolean } {
  const { popular, nearest, isLoading } = useCareProviders(serviceId);
  const provider = providerId ? [...popular, ...nearest].find((p) => p._id === providerId) : undefined;
  return { provider, isLoading };
}
