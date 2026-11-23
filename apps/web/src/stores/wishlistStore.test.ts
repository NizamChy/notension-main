import { beforeEach, describe, expect, it } from "vitest";
import { hydrateStores } from "./hydrate";
import { resetForSampleSwitch } from "./resetForSampleSwitch";
import { legacyAwareStorage } from "./storage";
import { useWishlistStore, wishlistFromLegacy, type WishlistState } from "./wishlistStore";

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

const product = (id: string) => ({ _id: id, product_title_eng: `Product ${id}`, sale_price: 100 });

// The old redux-persist root with a Fashion wishlist in `userChoice`.
const legacyRoot = (favourites: unknown) =>
  JSON.stringify({
    userChoice: JSON.stringify({ favouriteFashionItems: favourites, favouriteGroceryItems: [] }),
    _persist: JSON.stringify({ version: 1, rehydrated: true }),
  });

const useStorage = (fake: Storage) =>
  useWishlistStore.persist.setOptions({
    storage: legacyAwareStorage<WishlistState>("notension-wishlist", 1, wishlistFromLegacy, fake),
  });

beforeEach(() => {
  useStorage(fakeStorage());
  useWishlistStore.getState().clear();
});

describe("wishlist store", () => {
  it("toggles a product in and out, once per product", () => {
    const { toggle, add } = useWishlistStore.getState();
    expect(toggle(product("a"))).toBe(true);
    add(product("a"));
    expect(useWishlistStore.getState().items.map((i) => i._id)).toEqual(["a"]);
    expect(toggle(product("a"))).toBe(false);
    expect(useWishlistStore.getState().items).toEqual([]);
  });

  it("removes by id and clears", () => {
    const { add, remove, clear } = useWishlistStore.getState();
    add(product("a"));
    add(product("b"));
    remove("a");
    expect(useWishlistStore.getState().items.map((i) => i._id)).toEqual(["b"]);
    clear();
    expect(useWishlistStore.getState().items).toEqual([]);
  });

  it("migrates the Redux wishlist once and saves it under its own key", async () => {
    const fake = fakeStorage({ "persist:root": legacyRoot([product("a"), product("a"), product("b"), 5]) });
    useStorage(fake);

    await hydrateStores();

    expect(useWishlistStore.getState().items.map((i) => i._id)).toEqual(["a", "b"]);
    const saved = JSON.parse(fake.getItem("notension-wishlist") ?? "null");
    expect(saved.state.items.map((i: { _id: string }) => i._id)).toEqual(["a", "b"]);
  });

  it("ignores a missing or broken legacy wishlist", () => {
    const reader = (root: string | null) => ({ getItem: (k: string) => (k === "persist:root" ? root : null) });
    expect(wishlistFromLegacy(reader(null))).toBeNull();
    expect(wishlistFromLegacy(reader("{broken"))).toBeNull();
    expect(wishlistFromLegacy(reader(legacyRoot("nope")))).toBeNull();
    expect(wishlistFromLegacy(reader(legacyRoot([])))).toBeNull();
  });

  it("is emptied by the sample/live switch, without falling back to the Redux copy", async () => {
    const fake = fakeStorage({ "persist:root": legacyRoot([product("old")]) });
    useStorage(fake);
    useWishlistStore.getState().add(product("a"));

    resetForSampleSwitch();
    await useWishlistStore.persist.rehydrate();

    expect(useWishlistStore.getState().items).toEqual([]);
  });
});
