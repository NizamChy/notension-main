"use client";

import { useRouter } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi2";
import LocationPicker from "./LocationPicker";
import { bumpLocationVersion } from "./locationRefresh";

// Only same-site paths are followed from ?next=.
const safeNext = () => {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
};

// Full-screen location picker, used on phones (works on any screen size).
const LocationPage = () => {
  const router = useRouter();

  const leave = () => {
    const next = safeNext();
    if (next) router.replace(next);
    else if (window.history.length > 1) router.back();
    else router.replace("/");
  };

  const handleConfirm = ({ changed }) => {
    if (changed) bumpLocationVersion();
    leave();
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-white">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-gray-200 px-2 sm:px-4">
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? router.back() : router.replace("/"))}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100"
        >
          <HiArrowLeft className="text-xl" />
        </button>
        <h1 className="text-base font-semibold text-gray-900">Delivery location</h1>
      </header>

      <LocationPicker variant="page" onConfirm={handleConfirm} />
    </div>
  );
};

export default LocationPage;
