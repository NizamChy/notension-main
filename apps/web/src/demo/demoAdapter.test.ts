import { afterEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { GROCERY_URL } from "@/api-endpoints/env";
import { SEARCH_GROCERY_STORE } from "@/api-endpoints/api-endpoint";

afterEach(() => vi.unstubAllGlobals());

describe("demo adapter", () => {
  it("marks its answers", async () => {
    const store = new Map([["notension-sample-data", "on"]]);
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
        removeItem: (k: string) => void store.delete(k),
      },
    });
    const response = await getApiClient(GROCERY_URL).get(SEARCH_GROCERY_STORE, {
      params: { search: "a" },
      validateStatus: () => true,
    });
    expect(response.headers["x-notension-source"]).toBe("demo");
  });
});
