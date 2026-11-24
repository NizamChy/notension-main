"use client";

import React, { useEffect } from "react";
import ErrorPage from "@/components/shared/ErrorPage/ErrorPage";

const GlobalError = ({ error, reset }: { error: unknown; reset: () => void }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorPage onRetry={reset} />;
};

export default GlobalError;
