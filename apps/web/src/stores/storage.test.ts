import { afterEach, describe, expect, it } from "vitest";
import { legacyAwareStorage, safeLocalStorage } from "./storage";

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const map = new Map(Object.entries(initial));
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

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
afterEach(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else delete (globalThis as { window?: unknown }).window;
});

describe("safeLocalStorage", () => {
  it("falls back to memory when localStorage throws", () => {
    (globalThis as { window?: unknown }).window = {
      localStorage: {
        setItem() {
          throw new Error("blocked");
        },
        removeItem() {
          throw new Error("blocked");
        },
        getItem() {
          return null;
        },
      },
    };
    const s = safeLocalStorage();
    expect(() => s.setItem("x", "1")).not.toThrow();
    expect(s.getItem("x")).toBe("1");
  });

  it("uses memory on the server", () => {
    const s = safeLocalStorage();
    s.setItem("y", "2");
    expect(s.getItem("y")).toBe("2");
  });
});

describe("legacyAwareStorage", () => {
  const fromLegacy = (s: Pick<Storage, "getItem">) => {
    const v = s.getItem("old");
    return v ? { fromOld: v } : null;
  };

  it("uses the stored value first", () => {
    const fake = memoryStorage({
      k: JSON.stringify({ state: { a: 1 }, version: 3 }),
      old: "legacy",
    });
    const st = legacyAwareStorage("k", 1, fromLegacy, fake);
    expect(st.getItem("k")).toEqual({ state: { a: 1 }, version: 3 });
  });

  it("falls back to fromLegacy only when the key is empty", () => {
    const fake = memoryStorage({ old: "legacy" });
    const st = legacyAwareStorage("k", 1, fromLegacy, fake);
    expect(st.getItem("k")).toEqual({ state: { fromOld: "legacy" }, version: 1 });
  });

  it("falls back to legacy when the stored value is corrupt", () => {
    const fake = memoryStorage({ k: "{oops", old: "legacy" });
    const st = legacyAwareStorage("k", 1, fromLegacy, fake);
    expect(st.getItem("k")).toEqual({ state: { fromOld: "legacy" }, version: 1 });
  });

  it("returns null when both are empty", () => {
    const st = legacyAwareStorage("k", 1, fromLegacy, memoryStorage());
    expect(st.getItem("k")).toBeNull();
  });

  it("setItem and removeItem write only the key", () => {
    const fake = memoryStorage({ old: "legacy" });
    const st = legacyAwareStorage("k", 1, fromLegacy, fake);
    st.setItem("k", { state: { fromOld: "z" }, version: 1 });
    expect(fake.getItem("k")).toBe(JSON.stringify({ state: { fromOld: "z" }, version: 1 }));
    expect(fake.getItem("old")).toBe("legacy");
    st.removeItem("k");
    expect(fake.getItem("k")).toBeNull();
    expect(fake.getItem("old")).toBe("legacy");
  });
});

describe("legacyAwareStorage hardening", () => {
  const fromLegacy = (s: Pick<Storage, "getItem">) => {
    const v = s.getItem("old");
    return v ? { fromOld: v } : null;
  };

  it("setItem/removeItem do not throw when storage throws", () => {
    const bad = memoryStorage();
    bad.setItem = () => {
      throw new Error("quota");
    };
    bad.removeItem = () => {
      throw new Error("blocked");
    };
    const st = legacyAwareStorage("k", 1, fromLegacy, bad);
    expect(() => st.setItem("k", { state: { fromOld: "a" }, version: 1 })).not.toThrow();
    expect(() => st.removeItem("k")).not.toThrow();
  });

  it("a throwing fromLegacy gives null", () => {
    const st = legacyAwareStorage<{ a: number }>(
      "k",
      1,
      () => {
        throw new Error("bad mapper");
      },
      memoryStorage(),
    );
    expect(st.getItem("k")).toBeNull();
  });

  it("bad stored shapes fall back to legacy", () => {
    for (const bad of ["null", "5", "{}", '"str"']) {
      const fake = memoryStorage({ k: bad, old: "legacy" });
      const st = legacyAwareStorage("k", 1, fromLegacy, fake);
      expect(st.getItem("k")).toEqual({ state: { fromOld: "legacy" }, version: 1 });
    }
  });

  it("finds legacy data when localStorage is readable but writes fail", () => {
    const data: Record<string, string> = { old: "legacy" };
    (globalThis as { window?: unknown }).window = {
      localStorage: {
        getItem: (k: string) => data[k] ?? null,
        setItem() {
          throw new Error("blocked");
        },
        removeItem() {
          throw new Error("blocked");
        },
      },
    };
    const st = legacyAwareStorage("k", 1, fromLegacy);
    expect(st.getItem("k")).toEqual({ state: { fromOld: "legacy" }, version: 1 });
  });
});
