import type { PersistStorage, StorageValue } from "zustand/middleware";

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => [...map.keys()][index] ?? null,
    removeItem: (key) => {
      map.delete(key);
    },
    setItem: (key, value) => {
      map.set(key, String(value));
    },
  };
}

// One shared instance for all stores and requests. Safe because the store keys
// differ and the server never writes.
const memory = createMemoryStorage();

/** window.localStorage when usable, otherwise an in-memory Storage. */
export function safeLocalStorage(): Storage {
  if (typeof window === "undefined") return memory;
  try {
    const ls = window.localStorage;
    const probe = "__probe__";
    ls.setItem(probe, "1");
    ls.removeItem(probe);
    return ls;
  } catch {
    return memory;
  }
}
function warn(message: string, error: unknown) {
  if (process.env.NODE_ENV !== "production") console.warn(message, error);
}

/** Reader over the real window.localStorage, even if writes are blocked. */
function realLocalReader(): Pick<Storage, "getItem"> | null {
  if (typeof window === "undefined") return null;
  try {
    const ls = window.localStorage;
    return ls ? { getItem: (k) => ls.getItem(k) } : null;
  } catch {
    return null;
  }
}

export type LegacyAwareStorage<T> = PersistStorage<T> & {
  /** True when the store's own key holds a value (so no legacy seeding happens). */
  hasOwn: () => boolean;
};

/**
 * Zustand persist storage that prefers its own key and, when empty,
 * seeds from the old redux-persist / Fashion data via `fromLegacy`.
 * With no `storage` argument it uses safeLocalStorage() for its own key and
 * the real localStorage (when readable) for legacy reads.
 */
export function legacyAwareStorage<T>(
  key: string,
  version: number,
  fromLegacy: (s: Pick<Storage, "getItem">) => T | null,
  storage?: Storage,
): LegacyAwareStorage<T> {
  const own = () => storage ?? safeLocalStorage();
  const legacyReader = (): Pick<Storage, "getItem"> =>
    storage ?? realLocalReader() ?? safeLocalStorage();
  return {
    hasOwn: () => {
      try {
        return own().getItem(key) != null;
      } catch {
        return false;
      }
    },
    getItem: () => {
      try {
        const raw = own().getItem(key);
        if (raw != null) {
          const parsed: unknown = JSON.parse(raw);
          if (parsed && typeof parsed === "object" && "state" in parsed) {
            return parsed as StorageValue<T>;
          }
        }
      } catch {
        // corrupt or unreadable: treat as empty
      }
      try {
        const legacy = fromLegacy(legacyReader());
        return legacy === null ? null : { state: legacy, version };
      } catch (error) {
        warn("legacy read failed", error);
        return null;
      }
    },
    setItem: (_name, value) => {
      try {
        own().setItem(key, JSON.stringify(value));
      } catch (error) {
        warn("persist write failed", error);
      }
    },
    removeItem: () => {
      try {
        own().removeItem(key);
      } catch (error) {
        warn("persist remove failed", error);
      }
    },
  };
}
