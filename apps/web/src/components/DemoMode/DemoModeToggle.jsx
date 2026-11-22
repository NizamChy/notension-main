"use client";

import { useSessionStore } from "@/stores/sessionStore";
import { resetForSampleSwitch } from "@/stores/resetForSampleSwitch";
import Cookies from "js-cookie";
import { persistor } from "@/redux/store";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HiCheck } from "react-icons/hi2";
import {
  getBackendStatus,
  getServerBackendStatus,
  isSampleDataForced,
  setSampleDataForced,
  subscribeBackendStatus,
} from "@/demo/backendStatus";
import { DEMO_LOCATIONS, toUserLocation } from "@/demo/demoLocations";

const noopSubscribe = () => () => {};

const SERVER_TEXT = {
  unknown: "Checking the server…",
  online: "Server connected",
  back: "Server connected",
  offline: "Server not responding",
};

// Home page button: shows whether the API is connected and lets the visitor
// choose sample data on purpose (demo mode). Without that choice, sample data
// only appears while the API is down (src/demo/backendStatus.js).
const DemoModeToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const panelRef = useRef(null);

  const districtId = useSessionStore((s) => s.currentUserLocation?.districtId);

  const server = useSyncExternalStore(
    subscribeBackendStatus,
    getBackendStatus,
    getServerBackendStatus,
  );
  // Read from localStorage; the choice only changes by reloading the page.
  const forced = useSyncExternalStore(noopSubscribe, isSampleDataForced, () => false);

  const connected = server === "online" || server === "back";
  const sampleData = forced || server === "offline";

  useEffect(() => {
    if (!isOpen) return;
    const close = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isOpen]);

  // Sample and live data must not mix (carts, favourites, logged-in user),
  // so switching clears the saved app state and reloads.
  const handleToggle = async () => {
    if (isSwitching) return;
    setIsSwitching(true);

    setSampleDataForced(!forced);
    Cookies.remove("user_info");
    persistor.pause();
    await persistor.purge();
    // The session and cart stores keep their own copy; reset it too.
    resetForSampleSwitch();
    window.location.reload();
  };

  const handleLocation = (location) => {
    useSessionStore.getState().saveLocation(toUserLocation(location));
    setIsOpen(false);
  };

  const dot = connected
    ? "bg-[#12B76A] ring-[#12B76A]/20"
    : server === "offline"
      ? "bg-[#F79009] ring-[#F79009]/20"
      : "bg-gray-400 ring-gray-400/20";

  let note;
  if (forced) note = "Showing sample data. Orders and bookings aren't saved.";
  else if (server === "offline")
    note = "The server isn't responding, so sample data is shown until it's back.";
  else note = "Showing live data from the server.";

  return (
    <div
      ref={panelRef}
      className="fixed bottom-3 right-3 md:bottom-4 md:right-4 z-20 flex flex-col items-end gap-2"
    >
      {isOpen && (
        <div className="w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl shadow-gray-900/10">
          <p className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <span className={`h-2 w-2 rounded-full ring-4 ${dot}`} />
            {SERVER_TEXT[server]}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Demo mode</p>
              <p className="mt-0.5 text-xs leading-snug text-gray-500">{note}</p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={forced}
              aria-label="Demo mode (sample data)"
              disabled={isSwitching}
              onClick={handleToggle}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#EB5C2F] focus-visible:ring-offset-2 disabled:opacity-60 ${
                forced ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-[#FFFFFF] shadow transition-all ${
                  forced ? "left-5.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {sampleData && (
            <div className="mt-4 border-t border-gray-200 pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Locations with sample data
              </p>
              <div className="flex flex-col gap-1">
                {DEMO_LOCATIONS.map((location) => {
                  const selected = location.districtId === districtId;
                  return (
                    <button
                      key={location.key}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => handleLocation(location)}
                      className={`flex min-h-10 items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                        selected
                          ? "bg-primary/10 font-semibold text-primary dark:text-[#7FB2FF]"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {location.label}
                      {selected && <HiCheck aria-hidden="true" className="shrink-0 text-base" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={`${sampleData ? "Sample data" : "Live data"}, ${SERVER_TEXT[server]}`}
        className="flex h-10 items-center gap-1.5 rounded-full border border-gray-200 bg-white/95 px-3.5 text-xs font-semibold text-gray-800 shadow-lg shadow-gray-900/10 backdrop-blur-sm transition-shadow hover:shadow-xl focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#EB5C2F] md:gap-2 md:px-4 md:text-sm"
      >
        <span className={`h-2 w-2 md:h-2.5 md:w-2.5 rounded-full ring-4 ${dot}`} />
        {sampleData ? "Demo mode: On" : "Live"}
        <span className="hidden font-normal text-gray-500 md:inline">
          · {connected ? "Connected" : server === "offline" ? "Offline" : "Checking"}
        </span>
      </button>
    </div>
  );
};

export default DemoModeToggle;
