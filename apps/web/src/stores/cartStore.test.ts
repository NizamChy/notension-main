import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { lineTotal } from "@/utils/price";
import { legacyAwareStorage } from "./storage";
import {
  cartFromLegacy,
  cartTotal,
  fashionCount,
  fashionTotal,
  initialCartState,
  useCartStore,
  type CartLine,
} from "./cartStore";

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

async function useStorage(fake: Storage) {
  useCartStore.persist.setOptions({
    storage: legacyAwareStorage("notension-cart", 1, cartFromLegacy, fake),
  });
  await useCartStore.persist.rehydrate();
}

const rice = { _id: "rice", sale_price: 100, max_allowed: 2 };
const salt = { _id: "salt", sale_price: 20 };
const get = () => useCartStore.getState();

beforeEach(async () => {
  await useStorage(fakeStorage());
  useCartStore.setState(initialCartState);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("cart store (ported reducer cases)", () => {
  it("adds an item, then raises its quantity", () => {
    get().add("grocery", salt);
    get().add("grocery", salt);
    expect(get().grocery.items).toHaveLength(1);
    expect(get().grocery.items[0].quantity).toBe(2);
    expect(cartTotal(get().grocery)).toBe(40);
    expect(get().grocery.startAt).toBeGreaterThan(0);
  });

  it("stops at the store's per-order limit", () => {
    for (let i = 0; i < 4; i++) get().add("grocery", rice);
    get().increment("grocery", "rice");
    expect(get().grocery.items[0].quantity).toBe(2);
    expect(cartTotal(get().grocery)).toBe(200);
  });

  it("removes a line when decremented from 1", () => {
    get().add("food", salt);
    get().decrement("food", "salt");
    expect(get().food.items).toEqual([]);
    expect(cartTotal(get().food)).toBe(0);
  });

  it("decrements above 1 without removing", () => {
    get().add("food", salt);
    get().add("food", salt);
    get().decrement("food", "salt");
    expect(get().food.items[0].quantity).toBe(1);
  });

  it("keeps the modules separate and clears one", () => {
    get().add("medicine", salt);
    get().add("grocery", rice);
    get().clear("medicine");
    expect(get().medicine.items).toEqual([]);
    expect(get().medicine.startAt).toBe(0);
    expect(get().grocery.items).toHaveLength(1);
  });

  it("remove drops a line and saveStoreInfo stores info", () => {
    get().add("grocery", salt);
    get().add("grocery", rice);
    get().remove("grocery", "salt");
    expect(get().grocery.items.map((i) => i._id)).toEqual(["rice"]);
    get().saveStoreInfo("grocery", { name: "Shop" });
    expect(get().grocery.storeInfo).toEqual({ name: "Shop" });
  });

  it("sets startAt only when the cart was empty", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
    get().add("food", salt);
    vi.setSystemTime(5000);
    get().add("food", rice);
    expect(get().food.startAt).toBe(1000);
  });
});

describe("fashion bag", () => {
  const shirt = { _id: "shirt", sale_price: 500 };

  it("adds, merges the same line, stamps addedAt", () => {
    get().fashionAdd(shirt, 1, "M", "a.jpg", "red");
    get().fashionAdd(shirt, 2, "M", "a.jpg", "red");
    expect(get().fashion).toHaveLength(1);
    expect(get().fashion[0].quantity).toBe(3);
    expect(get().fashion[0].selectedColor).toBe("red");
    expect(new Date(get().fashion[0].addedAt).toISOString()).toBe(get().fashion[0].addedAt);
    expect(fashionTotal(get().fashion)).toBe(1500);
    expect(fashionCount(get().fashion)).toBe(3);
  });

  it("same product with another size is a new line", () => {
    get().fashionAdd(shirt, 1, "M", "a.jpg");
    get().fashionAdd(shirt, 1, "L", "a.jpg");
    expect(get().fashion).toHaveLength(2);
  });

  it("defaults to null selections and quantity 1", () => {
    get().fashionAdd(shirt);
    expect(get().fashion[0]).toMatchObject({
      quantity: 1,
      selectedSize: null,
      selectedImage: null,
      selectedColor: null,
    });
  });

  it("update changes quantity of the matching line only", () => {
    get().fashionAdd(shirt, 1, "M", "a.jpg");
    get().fashionAdd(shirt, 1, "L", "a.jpg");
    get().fashionUpdateQuantity("shirt", 5, "L", "a.jpg");
    expect(get().fashion.map((l) => l.quantity)).toEqual([1, 5]);
  });

  it("update to 0 is ignored", () => {
    get().fashionAdd(shirt, 2, "M", "a.jpg");
    get().fashionUpdateQuantity("shirt", 0, "M", "a.jpg");
    expect(get().fashion[0].quantity).toBe(2);
  });

  it("remove and clear", () => {
    get().fashionAdd(shirt, 1, "M", "a.jpg");
    get().fashionAdd(shirt, 1, "L", "a.jpg");
    get().fashionRemove("shirt", "M", "a.jpg");
    expect(get().fashion).toHaveLength(1);
    get().fashionClear();
    expect(get().fashion).toEqual([]);
  });
});

describe("totals", () => {
  it("use lineTotal for odd legacy lines", () => {
    const line = { _id: "x", sale_price: "50", quantity: "2" } as unknown as CartLine;
    expect(cartTotal({ items: [line], storeInfo: {}, startAt: 0 })).toBe(lineTotal(line));
  });
});

describe("persistence and migration", () => {
  const legacyRoot = () => {
    const cart = {
      groceryItems: [{ _id: "g", sale_price: 10, quantity: 2 }],
      groceryStoreInfo: { name: "G" },
      groceryCartStartAt: 111,
      foodItems: [{ _id: "f", sale_price: 20, quantity: 1 }],
      foodStoreInfo: { name: "F" },
      foodCartStartAt: 222,
      medicineItems: [{ _id: "m", sale_price: 30, quantity: 3 }],
      medicineStoreInfo: { name: "M" },
      medicineCartStartAt: 333,
    };
    return JSON.stringify({ cart: JSON.stringify(cart), _persist: JSON.stringify({ version: 1 }) });
  };

  it("migrates a full legacy cart", async () => {
    const fashion = [
      { _id: "a", quantity: 1, selectedSize: "M", selectedImage: null },
      { _id: "b", quantity: 2, selectedSize: "L", selectedImage: "x" },
    ];
    await useStorage(
      fakeStorage({ "persist:root": legacyRoot(), cart: JSON.stringify(fashion) }),
    );
    const s = get();
    expect(s.grocery).toEqual({
      items: [{ _id: "g", sale_price: 10, quantity: 2 }],
      storeInfo: { name: "G" },
      startAt: 111,
    });
    expect(s.food.startAt).toBe(222);
    expect(s.food.storeInfo).toEqual({ name: "F" });
    expect(s.medicine.items[0]._id).toBe("m");
    expect(s.medicine.startAt).toBe(333);
    expect(s.fashion).toEqual(fashion);
  });

  it("migrates nothing from corrupt data", async () => {
    const corrupt = { "persist:root": "{broken", cart: "{}" };
    await useStorage(fakeStorage(corrupt));
    expect(get().grocery.items).toEqual([]);
    expect(get().fashion).toEqual([]);
    expect(cartFromLegacy(fakeStorage(corrupt))).toBeNull();
  });

  it("prefers notension-cart over legacy", async () => {
    const own = {
      state: {
        ...initialCartState,
        food: { items: [{ _id: "own", quantity: 1 }], storeInfo: {}, startAt: 9 },
      },
      version: 1,
    };
    await useStorage(
      fakeStorage({ "persist:root": legacyRoot(), "notension-cart": JSON.stringify(own) }),
    );
    expect(get().food.items[0]._id).toBe("own");
    expect(get().grocery.items).toEqual([]);
  });

  it("persists data fields only, under notension-cart", async () => {
    const fake = fakeStorage();
    await useStorage(fake);
    get().add("grocery", salt);
    const saved = JSON.parse(fake.getItem("notension-cart") as string);
    expect(saved.version).toBe(1);
    expect(Object.keys(saved.state).sort()).toEqual(["fashion", "food", "grocery", "medicine"]);
    expect(fake.getItem("persist:root")).toBeNull();
    expect(fake.getItem("cart")).toBeNull();
  });
});
