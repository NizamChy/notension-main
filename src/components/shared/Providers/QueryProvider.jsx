"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Retry network / server errors, but not 4xx: a missing shop or product
// won't appear on a retry, and retrying delays the "not found" page.
const retry = (failureCount, error) => {
  const status = error?.response?.status;
  if (status >= 400 && status < 500) return false;
  return failureCount < 3;
};

// App-wide React Query client. Created once per browser tab (not on every
// render) so the query cache survives re-renders.
const QueryProvider = ({ children }) => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry } } }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
