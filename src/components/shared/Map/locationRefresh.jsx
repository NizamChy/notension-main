"use client";

import { Fragment, useSyncExternalStore } from "react";

// Store and service lists load once, for the district saved at the time.
// When the location picker saves a different district it bumps this
// version, and <LocationBoundary> remounts the page so every list loads again
// for the new district. Nothing else bumps it, so logging in or other saves
// never reset a page.

let version = 0;
const listeners = new Set();

export const bumpLocationVersion = () => {
  version += 1;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getVersion = () => version;

export const LocationBoundary = ({ children }) => {
  const current = useSyncExternalStore(subscribe, getVersion, () => 0);
  return <Fragment key={current}>{children}</Fragment>;
};
