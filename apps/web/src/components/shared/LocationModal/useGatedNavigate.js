"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import MapModal from "./MapModal";

/**
 * Store and service pages need a district. `navigate(path)` asks for a
 * location first when none is saved (the full-screen picker on phones, the
 * map dialog on larger screens) and then opens `path`; with a saved location
 * it just navigates. `requestLocation(path)` only asks, for pages that need
 * a location as soon as they open.
 *
 * Render `locationModal` once in the component that uses the hook.
 */
const useGatedNavigate = () => {
  const router = useRouter();
  // The page to open once a location is saved; null = dialog closed.
  const [pendingPath, setPendingPath] = useState(null);
  const districtId = useSelector(
    (state) => state.user.currentUserLocation?.districtId
  );

  const requestLocation = (path) => {
    if (window.innerWidth < 768) {
      router.push(`/get-mobile-location?next=${encodeURIComponent(path)}`);
    } else {
      setPendingPath(path);
    }
  };

  const navigate = (path) => {
    if (districtId) router.push(path);
    else requestLocation(path);
  };

  const locationModal = pendingPath ? (
    <MapModal
      isOpen
      onCloseModal={() => setPendingPath(null)}
      onConfirmed={() => router.push(pendingPath)}
    />
  ) : null;

  return { navigate, requestLocation, locationModal };
};

export default useGatedNavigate;
