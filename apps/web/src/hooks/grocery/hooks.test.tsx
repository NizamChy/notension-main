// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { GROCERY_URL } from "@/api-endpoints/env";
import { GROCERY_ITEM_DETAILS } from "@/api-endpoints/api-endpoint";
import { DEMO_GROCERY_ITEMS, DEMO_GROCERY_STORES } from "@/demo/modules/grocery/data";
import { queryKeys } from "@/lib/api/queryKeys";
import { resetWarnedEndpoints } from "@/lib/api/validate";
import { useCartStore } from "@/stores/cartStore";
import cartReducer from "@/redux/cartReducer";
import itemsByStoreReducer from "@/redux/items-by-shop";
import userChoiceReducer from "@/redux/userChoiceReducer";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { seedGroceryItem, useGroceryItem } from "./useGroceryItem";
import { PAGE_SIZE, useGroceryItemList } from "./useGroceryItemList";
import { useGroceryCart } from "./useGroceryCart";
import { useGroceryStore } from "./useGroceryStore";
import { usePlaceGroceryOrder } from "./usePlaceGroceryOrder";

type DemoStore = { _id: string; custom_store_id: string; is_closed: boolean };
const stores = DEMO_GROCERY_STORES as DemoStore[];
const open = stores.find((s) => !s.is_closed)!;
const closed = stores.find((s) => s.is_closed)!;

let params: Record<string, string> = {};
const push = vi.fn();
vi.mock("next/navigation", () => ({
  useParams: () => params,
  useRouter: () => ({ push }),
}));

const visit = (s: DemoStore) => {
  params = { store: "demo", storeId: s._id, customStoreId: s.custom_store_id };
};

let qc: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) => {
  const reduxStore = configureStore({
    reducer: { cart: cartReducer, itemsByStore: itemsByStoreReducer, userChoice: userChoiceReducer },
    // A different store in Redux, as Medicine or Food would leave it.
    preloadedState: {
      itemsByStore: { ...itemsByStoreReducer(undefined, { type: "init" }), merchantId: "redux-merchant", customstore_id: "redux-custom" },
    },
  });
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
  useCartStore.getState().clear("grocery");
  useCartStore.getState().saveStoreInfo("grocery", {});
  visit(open);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("useGroceryStore", () => {
  it("loads the demo store", async () => {
    const { result } = renderHook(() => useGroceryStore(), { wrapper });
    await waitFor(() => expect(result.current.store).toBeDefined());
    expect(result.current.store?._id).toBe(open._id);
    expect(result.current.status).toBeNull();
  });

  it('gives "closed" for a closed store', async () => {
    visit(closed);
    const { result } = renderHook(() => useGroceryStore(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe("closed"));
    expect(result.current.store).toBeUndefined();
  });
});

describe("useGroceryItemList", () => {
  it("pages until a short page", async () => {
    const sample = (DEMO_GROCERY_ITEMS as Record<string, unknown>[])[0];
    const page = (n: number, from: number) => ({
      data: {
        success: true,
        result: Array.from({ length: n }, (_, i) => ({ ...sample, _id: `item-${from + i}` })),
      },
      headers: { "x-notension-source": "demo" },
    });
    const get = vi
      .spyOn(getApiClient(GROCERY_URL), "get")
      .mockResolvedValueOnce(page(PAGE_SIZE, 0))
      .mockResolvedValueOnce(page(3, PAGE_SIZE));
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() => useGroceryItemList({ kind: "sub-type", id: "sub1" }), {
      wrapper,
    });
    await waitFor(() => expect(result.current.items).toHaveLength(PAGE_SIZE));
    expect(result.current.hasMore).toBe(true);

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.items).toHaveLength(PAGE_SIZE + 3));
    expect(result.current.hasMore).toBe(false);
    expect(get).toHaveBeenCalledTimes(2);
  });
});

describe("useGroceryItem", () => {
  it("uses seeded data without a request", async () => {
    const item = (DEMO_GROCERY_ITEMS as { productInfoTable: string }[])[0];
    const get = vi.spyOn(getApiClient(GROCERY_URL), "get");
    // @ts-expect-error a demo item is enough of a GroceryItem for the cache
    seedGroceryItem(qc, open._id, item);
    expect(qc.getQueryData(queryKeys.grocery.item(open._id, item.productInfoTable))).toBe(item);

    const { result } = renderHook(() => useGroceryItem(item.productInfoTable), { wrapper });
    await waitFor(() => expect(result.current.item).toBe(item));
    expect(get).not.toHaveBeenCalled();
  });
});

describe("useGroceryCart", () => {
  it("refuses an item from another store", async () => {
    const item = (DEMO_GROCERY_ITEMS as { _id: string }[])[0];
    useCartStore.getState().add("grocery", { _id: "in-cart" });
    useCartStore.getState().saveStoreInfo("grocery", { _id: "another-store", shop_name: "Other" });

    const { result } = renderHook(() => ({ cart: useGroceryCart(), store: useGroceryStore() }), {
      wrapper,
    });
    await waitFor(() => expect(result.current.store.store).toBeDefined());

    let added = true;
    act(() => {
      added = result.current.cart.addToCart(item);
    });
    expect(added).toBe(false);
    expect(useCartStore.getState().grocery.items).toHaveLength(1);
  });
});

describe("useFavouriteItem", () => {
  it("uses the given store ref", async () => {
    const get = vi
      .spyOn(getApiClient(GROCERY_URL), "get")
      .mockResolvedValue({ data: { success: false }, headers: {} });
    const { result } = renderHook(
      () => useFavouriteItem({ merchantId: "ref-merchant", customstore_id: "ref-custom" }),
      { wrapper },
    );
    act(() => result.current.getGroceryProductDetails("p1"));
    expect(get).toHaveBeenCalledWith(GROCERY_ITEM_DETAILS, {
      params: {
        productInfoTable: "p1",
        groceryStoreId: "ref-merchant",
        custom_store_id: "ref-custom",
      },
    });
  });
});

describe("usePlaceGroceryOrder", () => {
  it("ignores a second click in flight", () => {
    const post = vi
      .spyOn(getApiClient(GROCERY_URL), "post")
      .mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePlaceGroceryOrder(), { wrapper });
    act(() => {
      result.current.placeOrder({ orderObj: "{}" });
      result.current.placeOrder({ orderObj: "{}" });
    });
    expect(post).toHaveBeenCalledTimes(1);
    expect(result.current.progressing).toBe(true);
  });
});

describe("useGroceryCart before the store resolves", () => {
  it("does nothing until the store is loaded", async () => {
    const item = (DEMO_GROCERY_ITEMS as { _id: string }[])[0];
    const { result } = renderHook(() => ({ cart: useGroceryCart(), store: useGroceryStore() }), {
      wrapper,
    });
    let added = true;
    act(() => {
      added = result.current.cart.addToCart(item);
    });
    expect(added).toBe(false);
    expect(useCartStore.getState().grocery.items).toHaveLength(0);
    expect(useCartStore.getState().grocery.storeInfo).toEqual({});

    await waitFor(() => expect(result.current.store.store).toBeDefined());
    act(() => {
      added = result.current.cart.addToCart(item);
    });
    expect(added).toBe(true);
    expect(useCartStore.getState().grocery.storeInfo._id).toBe(open._id);
  });
});
