import { describe, expect, it } from "vitest";
import { readLegacyFashionCart, readLegacyRoot } from "./legacy";

const fake = (map: Record<string, string>) => ({
  getItem: (k: string) => map[k] ?? null,
});

describe("readLegacyRoot", () => {
  it("reads a v1 persist:root", () => {
    const s = fake({
      "persist:root":
        '{"user":"{\\"isLoggedin\\":true}","cart":"{\\"groceryItems\\":[]}","_persist":"{\\"version\\":1,\\"rehydrated\\":true}"}',
    });
    expect(readLegacyRoot(s)).toEqual({
      user: { isLoggedin: true },
      cart: { groceryItems: [] },
    });
  });

  it("reads a v0 persist:root without _persist", () => {
    const s = fake({
      "persist:root":
        '{"user":"{\\"isLoggedin\\":true}","cart":"{\\"groceryItems\\":[]}"}',
    });
    expect(readLegacyRoot(s)).toEqual({
      user: { isLoggedin: true },
      cart: { groceryItems: [] },
    });
  });

  it("drops a slice that is not JSON", () => {
    const s = fake({ "persist:root": '{"user":"{oops","cart":"{}"}' });
    expect(readLegacyRoot(s)).toEqual({ cart: {} });
  });

  it("returns null for broken outer JSON and for missing key", () => {
    expect(readLegacyRoot(fake({ "persist:root": "not json" }))).toBeNull();
    expect(readLegacyRoot(fake({}))).toBeNull();
  });
});

describe("readLegacyFashionCart", () => {
  it("reads the fashion bag", () => {
    const s = fake({ cart: '[{"_id":"a","quantity":2}]' });
    expect(readLegacyFashionCart(s)).toEqual([{ _id: "a", quantity: 2 }]);
  });

  it("non-array or broken JSON gives []", () => {
    expect(readLegacyFashionCart(fake({ cart: "{}" }))).toEqual([]);
    expect(readLegacyFashionCart(fake({ cart: "oops" }))).toEqual([]);
    expect(readLegacyFashionCart(fake({}))).toEqual([]);
  });
});
