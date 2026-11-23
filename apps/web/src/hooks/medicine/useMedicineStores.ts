import { useQuery } from "@tanstack/react-query";
import {
  getNearestStores,
  searchStores,
  type MedicineNearbyStore,
  type MedicineStore,
} from "@/lib/api/medicine";
import { queryKeys } from "@/lib/api/queryKeys";
import { useSessionStore } from "@/stores/sessionStore";

/** Pharmacies near the saved delivery location. */
export function useNearestMedicineStores(): { stores: MedicineNearbyStore[]; isLoading: boolean } {
  const lat = useSessionStore((s) => s.userLatitude);
  const lng = useSessionStore((s) => s.userLongitude);
  const districtId = useSessionStore((s) => s.districtId);
  const query = useQuery({
    queryKey: queryKeys.medicine.nearest(districtId, lat, lng),
    queryFn: () => getNearestStores({ lat, lng, districtId }),
  });
  return { stores: query.data ?? [], isLoading: query.isLoading };
}

/** Pharmacy search; waits for more than one character like the old search. */
export function useMedicineSearchStores(text: string): {
  stores: MedicineStore[];
  isLoading: boolean;
} {
  const query = useQuery({
    queryKey: queryKeys.medicine.searchStores(text),
    queryFn: () => searchStores(text),
    enabled: text.length > 1,
  });
  return { stores: query.data ?? [], isLoading: query.isLoading };
}
