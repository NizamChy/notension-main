// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { MEDICINE_URL } from "@/api-endpoints/env";
import { DEMO_MEDICINE_ITEMS, DEMO_MEDICINE_STORES } from "@/demo/modules/medicine/data";
import { queryKeys } from "@/lib/api/queryKeys";
import { resetWarnedEndpoints } from "@/lib/api/validate";
import { useCartStore } from "@/stores/cartStore";
import { PAGE_SIZE } from "@/hooks/grocery/useGroceryItemList";
import { seedMedicineItem, useMedicineItem } from "./useMedicineItem";
import { useMedicineItemList } from "./useMedicineItemList";
import { useMedicineCart } from "./useMedicineCart";
import { useMedicineStore } from "./useMedicineStore";
import { usePlaceMedicineOrder } from "./usePlaceMedicineOrder";

type DemoStore = { _id: string; custom_store_id: string; is_closed: boolean };
const stores = DEMO_MEDICINE_STORES as DemoStore[];
const open = stores.find((s) => !s.is_closed)!;
type DemoItem = { _id: string; medStoreProductInfo: string; merchantId: string };
const items = (DEMO_MEDICINE_ITEMS as DemoItem[]).filter((i) => i.merchantId === open._id);

let params: Record<string, string> = {};
const push = vi.fn();
vi.mock("next/navigation", () => ({
  useParams: () => params,
  useRouter: () => ({ push }),
}));

const visit = (storeId: string, customStoreId: string) => {
  params = { store: "demo", storeId, customStoreId };
};

let qc: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={qc}>{children}</QueryClientProvider>
);

beforeEach(() => {
  window.localStorage.setItem("notension-sample-data", "on");
  resetWarnedEndpoints();
  qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  useCartStore.getState().clear("medicine");
  useCartStore.getState().saveStoreInfo("medicine", {});
  visit(open._id, open.custom_store_id);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("useMedicineStore", () => {
  it("loads the demo pharmacy", async () => {
    const { result } = renderHook(() => useMedicineStore(), { wrapper });
    await waitFor(() => expect(result.current.store).toBeDefined());
    expect(result.current.store?._id).toBe(open._id);
    expect(result.current.status).toBeNull();
  });

  it('gives "missing" for an unknown pharmacy', async () => {
    visit("66a1ffffffffffffffffffff", "MS999999");
    const { result } = renderHook(() => useMedicineStore(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe("missing"));
    expect(result.current.store).toBeUndefined();
  });
});

describe("useMedicineItemList", () => {
  it("pages until a short page with the medicine params", async () => {
    const sample = items[0];
    const page = (n: number, from: number) => ({
      data: {
        success: true,
        result: Array.from({ length: n }, (_, i) => ({ ...sample, _id: `item-${from + i}` })),
      },
      headers: { "x-notension-source": "demo" },
    });
    const get = vi
      .spyOn(getApiClient(MEDICINE_URL), "get")
      .mockResolvedValueOnce(page(PAGE_SIZE, 0))
      .mockResolvedValueOnce(page(3, PAGE_SIZE));
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() => useMedicineItemList({ kind: "sub-type", id: "sub1" }), {
      wrapper,
    });
    await waitFor(() => expect(result.current.items).toHaveLength(PAGE_SIZE));
    expect(result.current.hasMore).toBe(true);

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.items).toHaveLength(PAGE_SIZE + 3));
    expect(result.current.hasMore).toBe(false);
    expect(get).toHaveBeenCalledTimes(2);
    // The store comes from the URL.
    expect((get.mock.calls[0][1] as { params: { merchantId: string } }).params.merchantId).toBe(
      open._id,
    );
  });
});

describe("useMedicineItem", () => {
  it("uses seeded data without a request", async () => {
    const item = items[0];
    const get = vi.spyOn(getApiClient(MEDICINE_URL), "get");
    // @ts-expect-error a demo item is enough of a MedicineItem for the cache
    seedMedicineItem(qc, open._id, item);
    expect(qc.getQueryData(queryKeys.medicine.item(open._id, item._id))).toBe(item);

    const { result } = renderHook(() => useMedicineItem(item._id), { wrapper });
    await waitFor(() => expect(result.current.item).toBe(item));
    expect(get).not.toHaveBeenCalled();
  });

  it("fetches by id on a direct link, null for an unknown id", async () => {
    const { result } = renderHook(() => useMedicineItem("66a1ffffffffffffffffffff"), { wrapper });
    await waitFor(() => expect(result.current.notFound).toBe(true));
  });
});

describe("useMedicineCart", () => {
  it("refuses an item from another pharmacy", async () => {
    useCartStore.getState().add("medicine", { _id: "in-cart" });
    useCartStore.getState().saveStoreInfo("medicine", { _id: "another-store", shop_name: "Other" });

    const { result } = renderHook(() => ({ cart: useMedicineCart(), store: useMedicineStore() }), {
      wrapper,
    });
    await waitFor(() => expect(result.current.store.store).toBeDefined());

    let added = true;
    act(() => {
      added = result.current.cart.addToCart(items[0]);
    });
    expect(added).toBe(false);
    expect(useCartStore.getState().medicine.items).toHaveLength(1);
  });

  it("saves the visited pharmacy with the first item", async () => {
    const { result } = renderHook(() => ({ cart: useMedicineCart(), store: useMedicineStore() }), {
      wrapper,
    });
    await waitFor(() => expect(result.current.store.store).toBeDefined());
    let added = false;
    act(() => {
      added = result.current.cart.addToCart(items[0]);
    });
    expect(added).toBe(true);
    expect(useCartStore.getState().medicine.storeInfo._id).toBe(open._id);
  });
});

describe("usePlaceMedicineOrder", () => {
  it("ignores a second click in flight", () => {
    const post = vi
      .spyOn(getApiClient(MEDICINE_URL), "post")
      .mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePlaceMedicineOrder(), { wrapper });
    act(() => {
      result.current.placeOrder({ orderObj: "{}" });
      result.current.placeOrder({ orderObj: "{}" });
    });
    expect(post).toHaveBeenCalledTimes(1);
    expect(result.current.progressing).toBe(true);
  });
});
