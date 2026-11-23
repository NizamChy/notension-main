import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { exploreModule, type FoodModule, type StoreCategory } from "@/lib/api/food";
import { queryKeys } from "@/lib/api/queryKeys";
import { useSessionStore } from "@/stores/sessionStore";

const noCategories: StoreCategory[] = [];
const noSliders: FoodModule["DashboardSlider"] = [];

/**
 * The food module for the delivery district: the restaurant categories and
 * the home sliders (was Redux dashboard.shopCategory / DashboardSlider).
 */
export function useFoodModule(enabled = true) {
  const districtId = useSessionStore((s) => s.districtId);
  const query = useQuery({
    queryKey: queryKeys.food.module(districtId),
    queryFn: () => exploreModule(districtId),
    enabled,
    // Categories and sliders change rarely; the old flow loaded them once.
    staleTime: 5 * 60_000,
  });
  return {
    categories: query.data?.shopCategory ?? noCategories,
    sliders: query.data?.DashboardSlider ?? noSliders,
    isLoading: query.isLoading,
    // Loaded or failed: a page can tell "still loading" from "unknown".
    isSettled: query.isSuccess || query.isError,
  };
}

/**
 * The restaurant category of the current /food/[id]/... page. `ready` turns
 * true once the list is loaded (or failed), as the old useFoodCategory did.
 */
export function useFoodCategory() {
  const params = useParams<{ id?: string }>();
  const catId = params?.id;
  const { categories, isSettled } = useFoodModule();
  const category = categories.find((c) => c?._id === catId) ?? null;
  return { catId, category, ready: categories.length > 0 || isSettled };
}
