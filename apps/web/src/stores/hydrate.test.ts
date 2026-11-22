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

  it("resolves even if a store's rehydrate rejects", async () => {
    vi.spyOn(useCartStore.persist, "rehydrate").mockRejectedValue(new Error("boom"));
    await expect(hydrateStores()).resolves.toBeUndefined();
  });
});
