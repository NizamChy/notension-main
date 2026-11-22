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

/**
 * Zustand persist storage that prefers its own key and, when empty,
 * seeds from the old redux-persist / Fashion data via `fromLegacy`.
 */
export function legacyAwareStorage<T>(
  key: string,
  version: number,
  fromLegacy: (s: Pick<Storage, "getItem">) => T | null,
  storage: Storage = safeLocalStorage(),
): PersistStorage<T> {
  return {
    getItem: () => {
      const raw = storage.getItem(key);
      if (raw != null) {
        try {
          return JSON.parse(raw) as StorageValue<T>;
        } catch {
          // corrupt: treat as empty
        }
      }
      const legacy = fromLegacy(storage);
      return legacy === null ? null : { state: legacy, version };
    },
    setItem: (_name, value) => {
      storage.setItem(key, JSON.stringify(value));
    },
    removeItem: () => {
      storage.removeItem(key);
    },
  };
}
