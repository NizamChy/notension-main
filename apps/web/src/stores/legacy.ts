export type LegacyRoot = {
  user?: Record<string, unknown>;
  cart?: Record<string, unknown>;
  userChoice?: Record<string, unknown>;
  itemsByStore?: Record<string, unknown>;
  allCare?: Record<string, unknown>;
  [slice: string]: unknown;
};

type Reader = Pick<Storage, "getItem">;

function parseJson(raw: string | null): unknown {
  if (raw == null) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/** Reads the old redux-persist `persist:root` (values are JSON strings). */
export function readLegacyRoot(storage: Reader): LegacyRoot | null {
  const outer = parseJson(storage.getItem("persist:root"));
  if (!outer || typeof outer !== "object" || Array.isArray(outer)) return null;
  const root: LegacyRoot = {};
  for (const [slice, value] of Object.entries(outer)) {
    if (slice === "_persist" || typeof value !== "string") continue;
    const parsed = parseJson(value);
    if (parsed !== undefined) root[slice] = parsed;
  }
  return root;
}

/** Reads the old Fashion bag, `localStorage["cart"]`. */
export function readLegacyFashionCart(storage: Reader): Record<string, unknown>[] {
  const parsed = parseJson(storage.getItem("cart"));
  return Array.isArray(parsed) ? (parsed as Record<string, unknown>[]) : [];
}
