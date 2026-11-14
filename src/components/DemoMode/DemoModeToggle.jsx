"use client";

import Cookies from "js-cookie";
import { persistor } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { HiCheck } from "react-icons/hi2";
import { handleUserReducer } from "@/redux/userReducer";
import { isDemoMode, saveDemoMode } from "@/demo/demoMode";
import { DEMO_LOCATIONS, toUserLocation } from "@/demo/demoLocations";

const noopSubscribe = () => () => {};

// Home page switch for demo mode, plus a quick picker for the locations that
// have demo data.
const DemoModeToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const panelRef = useRef(null);

  const dispatch = useDispatch();
  const districtId = useSelector(
    (state) => state.user.currentUserLocation?.districtId,
  );

  // localStorage is only readable in the browser; the server render shows
  // "Off" until hydration. The mode only changes by reloading the page.
  const demoOn = useSyncExternalStore(noopSubscribe, isDemoMode, () => false);

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

  // Demo and real data must not mix (carts, favourites, logged-in user,
  // saved location), so switching clears the saved app state and reloads.
  const handleToggle = async () => {
    if (isSwitching) return;
    setIsSwitching(true);

    saveDemoMode(!demoOn);
    Cookies.remove("user_info");
    persistor.pause();
    await persistor.purge();
    window.location.reload();
  };

  const handleLocation = (location) => {
    dispatch(
      handleUserReducer({
        type: "SAVE_USER_CURRENT_LOCATION",
        data: toUserLocation(location),
      }),
    );
    setIsOpen(false);
  };

  return (
    <div
      ref={panelRef}
      className="fixed bottom-3 right-3 md:bottom-4 md:right-4 z-30 flex flex-col items-end gap-2"
    >
      {isOpen && (
        <div className="w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl shadow-gray-900/10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Demo mode</p>
              <p className="mt-0.5 text-xs leading-snug text-gray-500">
                {demoOn
                  ? "Showing sample data. No real orders are placed."
                  : "Showing live data from the servers."}
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={demoOn}
              aria-label="Demo mode"
              disabled={isSwitching}
              onClick={handleToggle}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F] focus-visible:ring-offset-2 disabled:opacity-60 ${
                demoOn ? "bg-[#0C3F8E]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-[#FFFFFF] shadow transition-all ${
                  demoOn ? "left-[1.375rem]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {demoOn && (
            <div className="mt-4 border-t border-gray-200 pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Locations with demo data
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
                          ? "bg-[#0C3F8E]/10 font-semibold text-[#0C3F8E] dark:text-[#7FB2FF]"
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
        aria-label={`Demo mode: ${demoOn ? "On" : "Off"}`}
        className="flex h-10 items-center gap-1.5 rounded-full border border-gray-200 bg-white/95 px-3.5 text-xs font-semibold text-gray-800 shadow-lg shadow-gray-900/10 backdrop-blur transition-shadow hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB5C2F] md:gap-2 md:px-4 md:text-sm"
      >
        <span
          className={`h-2 w-2 md:h-2.5 md:w-2.5 rounded-full ${
            demoOn ? "bg-[#12B76A] ring-4 ring-[#12B76A]/20" : "bg-gray-400"
          }`}
        />
        <span className="hidden md:inline">Demo mode: </span>
        <span className="md:hidden">Demo </span>
        {demoOn ? "On" : "Off"}
      </button>
    </div>
  );
};

export default DemoModeToggle;
