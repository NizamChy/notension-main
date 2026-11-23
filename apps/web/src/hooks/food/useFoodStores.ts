import { useQuery } from "@tanstack/react-query";
import {
  getNearestStores,
  searchStores,
  type FoodNearbyStore,
  type FoodStore,
  type StoreCategory,
} from "@/lib/api/food";
import { queryKeys } from "@/lib/api/queryKeys";
import { useSessionStore } from "@/stores/sessionStore";

type Category = Pick<StoreCategory, "_id" | "regularDistance"> | null | undefined;

/** Restaurants of a category near the saved delivery location. */
export function useNearestFoodStores(category: Category): {
  stores: FoodNearbyStore[];
  isLoading: boolean;
} {
  const lat = useSessionStore((s) => s.userLatitude);
  const lng = useSessionStore((s) => s.userLongitude);
  const districtId = useSessionStore((s) => s.districtId);
  const query = useQuery({
    queryKey: queryKeys.food.nearest(category?._id ?? "", districtId, lat, lng),
    queryFn: () => getNearestStores(category!, { lat, lng, districtId }),
    enabled: !!category?._id,
  });
  return { stores: query.data ?? [], isLoading: query.isLoading };
}

/** Restaurant search in a category; waits for more than one character. */
export function useFoodSearchStores(
  text: string,
  category: Category,
): { stores: FoodStore[]; isLoading: boolean } {
  const query = useQuery({
    queryKey: queryKeys.food.searchStores(text, category?._id ?? ""),
    queryFn: () => searchStores(text, category!._id),
    enabled: text.length > 1 && !!category?._id,
  });
  return { stores: query.data ?? [], isLoading: query.isLoading };
}
