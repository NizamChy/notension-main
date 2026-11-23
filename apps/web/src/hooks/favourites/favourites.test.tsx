// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { USER_URL } from "@/api-endpoints/env";
import { FAVORITE_STORE_ADD, FAVORITE_STORE_PUSH } from "@/api-endpoints/api-endpoint";
import { resetWarnedEndpoints } from "@/lib/api/validate";
import { hydrateStores } from "@/stores/hydrate";
import { resetForSampleSwitch } from "@/stores/resetForSampleSwitch";
import { legacyAwareStorage } from "@/stores/storage";
import {
  favouritesFromLegacy,
  useFavouritesStore,
  type FavouritesState,
} from "@/stores/favouritesStore";
import { useSessionStore } from "@/stores/sessionStore";
import { useFavouriteStore } from "@/hooks/fetch-data/favorite-shop";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { useFavouriteList } from "@/hooks/fetch-data/favorite-list";

function fakeStorage(seed: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(seed));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => void map.delete(k),
    setItem: (k, v) => void map.set(k, String(v)),
  };
}

const useStorage = (fake: Storage) =>
  useFavouritesStore.persist.setOptions({
    storage: legacyAwareStorage<FavouritesState>("notension-favourites", 1, favouritesFromLegacy, fake),
  });

const shop = (n: number) => ({
  _id: `6650a0010000000000000${String(n).padStart(3, "0")}`,
  custom_store_id: `GS${n}`,
  shop_name: `Shop ${n}`,
});

beforeEach(() => {
  window.localStorage.setItem("notension-sample-data", "on");
  resetWarnedEndpoints();
  useStorage(fakeStorage());
  useFavouritesStore.getState().clear();
  useSessionStore.setState({ userInfo: { _id: "65a1d0c0e4b0a1b2c3d4e5f6", custom_id: "CUS0000001" } });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("favourite stores", () => {
  it("saves with push (never the list-replacing add), then removes", async () => {
    const post = vi.spyOn(getApiClient(USER_URL), "post");
    const { result } = renderHook(() => useFavouriteStore());

    await act(() => result.current.addToFavouriteList(shop(1), 0));
    expect(post.mock.calls.map((c) => c[0])).toEqual([FAVORITE_STORE_PUSH]);
    expect(post.mock.calls.map((c) => c[0])).not.toContain(FAVORITE_STORE_ADD);
    expect(result.current.isAddedToFavouriteList(shop(1)._id, 0)).toBe(true);
    expect(result.current.isAddedToFavouriteList(shop(1)._id, 1)).toBe(false);

    const saved = useFavouritesStore.getState().lists["store:0"]![0];
    expect(saved.shop_name).toBe("Shop 1");
    await act(() => result.current.removeFromfavoriteList(saved, 0));
    expect(result.current.isAddedToFavouriteList(shop(1)._id, 0)).toBe(false);
  });

  it("stops at the list's limit", async () => {
    const post = vi.spyOn(getApiClient(USER_URL), "post");
    const { result } = renderHook(() => useFavouriteStore());
    for (let n = 1; n <= 11; n++) await act(() => result.current.addToFavouriteList(shop(n), 0));
    expect(useFavouritesStore.getState().lists["store:0"]).toHaveLength(10);
    expect(post).toHaveBeenCalledTimes(10);
  });

  it("does nothing for a guest", async () => {
    useSessionStore.setState({ userInfo: {} });
    const post = vi.spyOn(getApiClient(USER_URL), "post");
    const { result } = renderHook(() => useFavouriteStore());
    await act(() => result.current.addToFavouriteList(shop(1), 0));
    expect(post).not.toHaveBeenCalled();
  });
});

describe("favourite items and the list", () => {
  it("saves a grocery item by productInfoTable and a doctor by _id", async () => {
    const items = renderHook(() => useFavouriteItem());
    await act(() => items.result.current.addToFavouriteItems({ productInfoTable: "p1", product_title_eng: "Rice" }, 0));
    expect(items.result.current.isAddedToFavouriteItems("p1", 0)).toBe(true);
    await act(() => items.result.current.removeFromfavoriteItems({ productId: "p1" }, 0));
    expect(items.result.current.isAddedToFavouriteItems("p1", 0)).toBe(false);

    const list = renderHook(() => useFavouriteList());
    await act(() => list.result.current.addToFavouriteList({ _id: "d1", doctor_name: "Dr. A" }, 4));
    expect(list.result.current.isAddedToFavouriteList("d1", 4)).toBe(true);
    expect(useFavouritesStore.getState().lists["list:4"]![0].doctor_name).toBe("Dr. A");
  });
});

describe("favourites store", () => {
  it("migrates the Redux userChoice lists once", async () => {
    const root = JSON.stringify({
      userChoice: JSON.stringify({
        favouriteGroceryStore: [{ storeId: "s1", shop_name: "A" }],
        favouriteFoodShop: [{ storeId: "f1" }],
        favouriteMedicineItems: [{ productId: "m1" }],
        favouriteDoctors: [{ mongodbId: "d1" }, 7],
        favouriteFashionItems: [{ _id: "x" }],
      }),
    });
    const fake = fakeStorage({ "persist:root": root });
    useStorage(fake);

    await hydrateStores();

    const { lists } = useFavouritesStore.getState();
    expect(lists["store:0"]?.[0].storeId).toBe("s1");
    expect(lists["store:2"]?.[0].storeId).toBe("f1");
    expect(lists["item:1"]?.[0].productId).toBe("m1");
    expect(lists["list:4"]).toHaveLength(1);
    expect(JSON.parse(fake.getItem("notension-favourites") ?? "null").state.lists["store:0"]).toHaveLength(1);
  });

  it("is emptied by the sample/live switch", () => {
    useFavouritesStore.getState().add("store", 0, [{ storeId: "s1" }]);
    resetForSampleSwitch();
    expect(useFavouritesStore.getState().lists).toEqual({});
  });
});
