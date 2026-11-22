// Query keys, rooted at the service name. Module PRs add their own roots.
export const queryKeys = {
  grocery: {
    all: () => ["grocery"] as const,
    store: (storeId: string | number) => ["grocery", "store", storeId] as const,
  },
  user: {
    all: () => ["user"] as const,
    me: () => ["user", "me"] as const,
  },
};
