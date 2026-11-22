import { describe, expect, it } from "vitest";
import { cartFromLegacy, initialCartState, useCartStore } from "./cartStore";
import { resetForSampleSwitch } from "./resetForSampleSwitch";
import { initialSessionState, sessionFromLegacy, useSessionStore } from "./sessionStore";
import { legacyAwareStorage } from "./storage";
import { usePreferencesStore } from "./preferencesStore";

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

const line = (id: string, quantity: number) => ({
  _id: id,
  sale_price: 10,
  quantity,
  selectedSize: "M",
  selectedImage: "a.png",
  selectedColor: null,
  addedAt: "2026-01-01T00:00:00.000Z",
});

describe("resetForSampleSwitch", () => {
  it("wipes session and module carts, keeps the bag, and does not fall back to the legacy bag", async () => {
    // Pre-migration Fashion bag nobody writes any more.
    const fake = fakeStorage({ cart: JSON.stringify([line("old", 1)]) });
    useSessionStore.persist.setOptions({
      storage: legacyAwareStorage("notension-session", 1, sessionFromLegacy, fake),
    });
    useCartStore.persist.setOptions({
      storage: legacyAwareStorage("notension-cart", 1, cartFromLegacy, fake),
    });
    useSessionStore.setState({ ...initialSessionState, isLoggedin: true, userInfo: { _id: "u1" } });
    useCartStore.setState({
      ...initialCartState,
      grocery: { items: [{ _id: "rice", quantity: 1, sale_price: 5 }], storeInfo: {}, startAt: 1 },
      fashion: [line("new", 2)],
    });

    resetForSampleSwitch();

    expect(fake.getItem("notension-session")).not.toBeNull();
    expect(fake.getItem("notension-cart")).not.toBeNull();

    // Simulates the reload.
    await useSessionStore.persist.rehydrate();
    await useCartStore.persist.rehydrate();
    const session = useSessionStore.getState();
    expect(session.isLoggedin).toBe(false);
    expect(session.userInfo).toEqual({});
    const cart = useCartStore.getState();
    expect(cart.grocery.items).toEqual([]);
    expect(cart.food.items).toEqual([]);
    expect(cart.medicine.items).toEqual([]);
    expect(cart.fashion.map((l) => l._id)).toEqual(["new"]);
    expect(cart.fashion[0].quantity).toBe(2);
  });

  it("sample switch resets currentModule", () => {
    usePreferencesStore.getState().setCurrentModule("Food");
    resetForSampleSwitch();
    expect(usePreferencesStore.getState().currentModule).toBe("dashboard");
  });
});
