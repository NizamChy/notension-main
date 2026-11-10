"use client";

import React, { useEffect } from "react";
import ErrorPage from "@/components/common/ErrorPage";

const GlobalError = ({ error, reset }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorPage onRetry={reset} />;
};

export default GlobalError;
