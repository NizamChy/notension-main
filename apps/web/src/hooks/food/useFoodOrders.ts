import { useQuery } from "@tanstack/react-query";
import { getOrders, type FoodOrder } from "@/lib/api/food";
import { queryKeys } from "@/lib/api/queryKeys";
import { useSessionStore } from "@/stores/sessionStore";

const none: FoodOrder[] = [];

/** The logged-in customer's food orders (see useGroceryOrders). */
export function useFoodOrders(): { orders: FoodOrder[]; isLoading: boolean; isLoggedIn: boolean } {
  const isLoggedin = useSessionStore((s) => s.isLoggedin);
  const userInfo = useSessionStore((s) => s.userInfo);
  const id = typeof userInfo._id === "string" ? userInfo._id : "";
  const customId = typeof userInfo.custom_id === "string" ? userInfo.custom_id : undefined;
  const query = useQuery({
    queryKey: queryKeys.food.orders(id),
    queryFn: () => getOrders({ _id: id, custom_id: customId }),
    enabled: isLoggedin && !!id,
  });
  return { orders: query.data ?? none, isLoading: query.isLoading, isLoggedIn: !!id };
}
