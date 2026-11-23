import { useQuery } from "@tanstack/react-query";
import {
  getNearestStores,
  searchStores,
  type GroceryNearbyStore,
  type GroceryStore,
} from "@/lib/api/grocery";
import { queryKeys } from "@/lib/api/queryKeys";
import { useSessionStore } from "@/stores/sessionStore";

/** Stores near the saved delivery location. */
export function useNearestGroceryStores(): { stores: GroceryNearbyStore[]; isLoading: boolean } {
  const lat = useSessionStore((s) => s.userLatitude);
  const lng = useSessionStore((s) => s.userLongitude);
  const districtId = useSessionStore((s) => s.districtId);
  const query = useQuery({
    queryKey: queryKeys.grocery.nearest(districtId, lat, lng),
    queryFn: () => getNearestStores({ lat, lng, districtId }),
  });
  return { stores: query.data ?? [], isLoading: query.isLoading };
}

/** Store search; waits for more than one character like the old search. */
export function useGrocerySearchStores(text: string): {
  stores: GroceryStore[];
  isLoading: boolean;
} {
  const query = useQuery({
    queryKey: queryKeys.grocery.searchStores(text),
    queryFn: () => searchStores(text),
    enabled: text.length > 1,
  });
  return { stores: query.data ?? [], isLoading: query.isLoading };
}
