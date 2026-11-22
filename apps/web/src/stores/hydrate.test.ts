import { afterEach, describe, expect, it, vi } from "vitest";
import { hydrateStores } from "./hydrate";
import { legacyAwareStorage } from "./storage";
import { cartFromLegacy, useCartStore } from "./cartStore";
import { sessionFromLegacy, useSessionStore } from "./sessionStore";

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

const envelope = (state: unknown) => JSON.stringify({ state, version: 1 });

describe("hydrateStores", () => {
  afterEach(() => vi.restoreAllMocks());

  it("loads both stores from storage", async () => {
    const cart = useCartStore.getState();
    const session = useSessionStore.getState();
    const fake = fakeStorage({
      "notension-cart": envelope({ ...cart, fashion: [], grocery: { items: [{ _id: "p1", quantity: 2 }], storeInfo: {}, startAt: 1 } }),
      "notension-session": envelope({ ...session, currentUserLocation: { districtId: "5", districtName: "Dhaka" } }),
    });
    useCartStore.persist.setOptions({ storage: legacyAwareStorage("notension-cart", 1, cartFromLegacy, fake) });
    useSessionStore.persist.setOptions({ storage: legacyAwareStorage("notension-session", 1, sessionFromLegacy, fake) });

    await hydrateStores();

    expect(useCartStore.getState().grocery.items[0]._id).toBe("p1");
    expect(useSessionStore.getState().currentUserLocation?.districtId).toBe("5");
  });

  it("persists migrated legacy data under the new keys", async () => {
    const root = JSON.stringify({
      user: JSON.stringify({ isLoggedin: true, userInfo: { name: "Rina" }, districtId: "7" }),
      cart: JSON.stringify({ groceryItems: [{ _id: "g", sale_price: 10, quantity: 2 }], groceryCartStartAt: 111 }),
      _persist: JSON.stringify({ version: 1, rehydrated: true }),
    });
    const bag = JSON.stringify([{ _id: "f", quantity: 1, selectedSize: "M", selectedImage: "x" }]);
    const fake = fakeStorage({ "persist:root": root, cart: bag });
    useCartStore.persist.setOptions({ storage: legacyAwareStorage("notension-cart", 1, cartFromLegacy, fake) });
    useSessionStore.persist.setOptions({ storage: legacyAwareStorage("notension-session", 1, sessionFromLegacy, fake) });

    await hydrateStores();

    const cart = JSON.parse(fake.getItem("notension-cart") ?? "null");
    const session = JSON.parse(fake.getItem("notension-session") ?? "null");
    expect(cart.state.grocery.items[0]._id).toBe("g");
    expect(cart.state.grocery.startAt).toBe(111);
    expect(cart.state.fashion[0]._id).toBe("f");
    expect(session.state.userInfo).toEqual({ name: "Rina" });
    expect(session.state.districtId).toBe("7");
    expect(fake.getItem("persist:root")).toBe(root);
    expect(fake.getItem("cart")).toBe(bag);
  });

  it("resolves even if a store's rehydrate rejects", async () => {
    vi.spyOn(useCartStore.persist, "rehydrate").mockRejectedValue(new Error("boom"));
    await expect(hydrateStores()).resolves.toBeUndefined();
  });
});
