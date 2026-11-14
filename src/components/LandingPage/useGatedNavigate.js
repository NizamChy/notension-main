"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import MapModal from "../shared/LocationModal/MapModal";

/**
 * Store and service pages need a district, so every landing-page link goes
 * through this: without a saved location it asks for one first (a full page
 * on phones, the map modal on larger screens), otherwise it navigates.
 *
 * Render `locationModal` once in the component that uses the hook.
 */
const useGatedNavigate = () => {
  const router = useRouter();
  // The page to open once a location is saved; null = modal closed.
  const [pendingPath, setPendingPath] = useState(null);
  const districtId = useSelector(
    (state) => state.user.currentUserLocation?.districtId
  );

  const navigate = (path) => {
    if (!districtId) {
      if (window.innerWidth < 768) {
        router.push(`/get-mobile-location?next=${encodeURIComponent(path)}`);
      } else {
        setPendingPath(path);
      }
      return;
    }
    router.push(path);
  };

  const locationModal = pendingPath ? (
    <MapModal
      isOpen
      onCloseModal={() => setPendingPath(null)}
      onConfirmed={() => router.push(pendingPath)}
    />
  ) : null;

  return { navigate, locationModal };
};

export default useGatedNavigate;
