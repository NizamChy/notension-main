// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { FOOD_URL } from "@/api-endpoints/env";
import { EXPLORE_FOOD_STORE } from "@/api-endpoints/api-endpoint";
import { DEMO_ROUTES } from "@/demo/routes";
import { DEMO_FOOD_ITEMS, DEMO_FOOD_STORES } from "@/demo/modules/food";
import { resetWarnedEndpoints } from "@/lib/api/validate";
import type { FoodExploreResult } from "@/lib/api/food";
import { useCartStore } from "@/stores/cartStore";
import { useSessionStore } from "@/stores/sessionStore";
import cartReducer from "@/redux/cartReducer";
import itemsByStoreReducer, { handleItemsByStoreReducer } from "@/redux/items-by-shop";
import { useFoodCategory, useFoodModule } from "./useFoodModule";
import { toFoodMenu, useFoodItem, useFoodStore } from "./useFoodStore";
import { useFoodCart } from "./useFoodCart";
import { usePlaceFoodOrder } from "./usePlaceFoodOrder";

type DemoStore = { _id: string; custom_store_id: string; is_closed: boolean; district_id: string };
const stores = DEMO_FOOD_STORES as DemoStore[];
const open = stores.find((s) => !s.is_closed)!;
const closed = stores.find((s) => s.is_closed)!;
type DemoItem = { _id: string; storeId: string };
const dishes = (DEMO_FOOD_ITEMS as DemoItem[]).filter((i) => i.storeId === open._id);

let params: Record<string, string> = {};
const push = vi.fn();
vi.mock("next/navigation", () => ({
  useParams: () => params,
  useRouter: () => ({ push }),
}));

const visit = (s: { _id: string; custom_store_id: string }) => {
  params = { store: "demo", storeId: s._id, customStoreId: s.custom_store_id };
};

let qc: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) => {
  const reduxStore = configureStore({ reducer: { cart: cartReducer } });
  return (
    <Provider store={reduxStore}>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </Provider>
  );
};

beforeEach(() => {
  window.localStorage.setItem("notension-sample-data", "on");
  resetWarnedEndpoints();
  qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  useCartStore.getState().clear("food");
  useCartStore.getState().saveStoreInfo("food", {});
  useSessionStore.setState({ districtId: open.district_id });
  visit(open);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("toFoodMenu", () => {
  it("matches the old EXPLORE_FOOD_STORE_ITEMS reducer", () => {
    const route = (
      DEMO_ROUTES as {
        service: string;
        path: string;
        handler: (r: { query: Record<string, string> }) => { result: FoodExploreResult };
      }[]
    ).find((r) => r.service === "FOOD" && r.path === EXPLORE_FOOD_STORE)!;
    for (const s of stores.filter((x) => !x.is_closed)) {
      const data = route.handler({ query: { storeId: s._id, custom_store_id: s.custom_store_id } }).result;
      const old = itemsByStoreReducer(
        undefined,
        handleItemsByStoreReducer({ type: "EXPLORE_FOOD_STORE_ITEMS", data }),
      );
      const got = toFoodMenu(data);
      expect(got.productCategory).toEqual(old.productCategory);
      expect(got.productInfoByShop).toEqual(old.productInfoByShop);
      expect(got.popularItem).toEqual(old.popularItem);
    }
  });
});

describe("useFoodModule / useFoodCategory", () => {
  it("loads the categories and finds the one in the URL", async () => {
    const { result: mod } = renderHook(() => useFoodModule(), { wrapper });
    await waitFor(() => expect(mod.current.categories.length).toBeGreaterThan(0));
    params = { id: mod.current.categories[0]._id };
    const { result } = renderHook(() => useFoodCategory(), { wrapper });
    await waitFor(() => expect(result.current.category?._id).toBe(params.id));
    expect(result.current.ready).toBe(true);
  });
});

describe("useFoodStore", () => {
  it("loads the demo restaurant and its menu", async () => {
    const { result } = renderHook(() => useFoodStore(), { wrapper });
    await waitFor(() => expect(result.current.store).toBeDefined());
    expect(result.current.store?._id).toBe(open._id);
    expect(result.current.productInfoByShop.length).toBeGreaterThan(0);
  });

  it('gives "closed" for a closed restaurant', async () => {
    visit(closed);
    const { result } = renderHook(() => useFoodStore(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe("closed"));
    expect(result.current.store).toBeUndefined();
  });
});

describe("useFoodItem", () => {
  it("finds a dish in the menu, not found for an unknown id", async () => {
    const { result } = renderHook(() => useFoodItem(dishes[0]._id), { wrapper });
    await waitFor(() => expect(result.current.item?._id).toBe(dishes[0]._id));
    const { result: missing } = renderHook(() => useFoodItem("20ffffffffffffffffffffff"), {
      wrapper,
    });
    await waitFor(() => expect(missing.current.notFound).toBe(true));
  });
});

describe("useFoodCart", () => {
  it("refuses a dish from another restaurant", async () => {
    useCartStore.getState().add("food", { _id: "in-cart" });
    useCartStore.getState().saveStoreInfo("food", { _id: "another-store", shop_name: "Other" });
    const { result } = renderHook(() => ({ cart: useFoodCart(), store: useFoodStore() }), {
      wrapper,
    });
    await waitFor(() => expect(result.current.store.store).toBeDefined());
    let added = true;
    act(() => {
      added = result.current.cart.addToCart(dishes[0]);
    });
    expect(added).toBe(false);
    expect(useCartStore.getState().food.items).toHaveLength(1);
  });
});

describe("usePlaceFoodOrder", () => {
  it("ignores a second click in flight", () => {
    const post = vi.spyOn(getApiClient(FOOD_URL), "post").mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePlaceFoodOrder(), { wrapper });
    act(() => {
      result.current.placeOrder({ merchant_id: "x" });
      result.current.placeOrder({ merchant_id: "x" });
    });
    expect(post).toHaveBeenCalledTimes(1);
    expect(result.current.progressing).toBe(true);
  });
});
