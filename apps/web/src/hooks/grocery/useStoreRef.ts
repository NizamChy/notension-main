import { useParams } from "next/navigation";
import { useMemo } from "react";
import type { StoreRef } from "@/lib/api/grocery";

/** The store in the page URL, or null off a store page. */
export function useStoreRef(): StoreRef | null {
  const params = useParams<{ storeId?: string; customStoreId?: string }>();
  const storeId = params?.storeId;
  const customStoreId = params?.customStoreId;
  return useMemo(
    () => (storeId && customStoreId ? { storeId, customStoreId } : null),
    [storeId, customStoreId],
  );
}
