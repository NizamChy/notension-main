"use client";

import { Fragment, useSyncExternalStore, type ReactNode } from "react";

// Store and service lists load once, for the district saved at the time.
// When the location picker saves a different district it bumps this
// version, and <LocationBoundary> remounts the page so every list loads again
// for the new district. Nothing else bumps it, so logging in or other saves
// never reset a page.

let version = 0;
const listeners = new Set<() => void>();

export const bumpLocationVersion = () => {
  version += 1;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getVersion = () => version;

type LocationBoundaryProps = { children?: ReactNode };

export const LocationBoundary = ({ children }: LocationBoundaryProps) => {
  const current = useSyncExternalStore(subscribe, getVersion, () => 0);
  return <Fragment key={current}>{children}</Fragment>;
};
