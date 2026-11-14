"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdMyLocation } from "react-icons/md";
import {
  HiMagnifyingGlass,
  HiXMark,
  HiMapPin,
  HiExclamationTriangle,
  HiArrowPath,
} from "react-icons/hi2";
import loader from "@/utils/googleMapsLoader";
import { handleUserReducer } from "@/redux/userReducer";
import { PRIMARY_BUTTON } from "@/components/shared/UI/UI";
import { isDemoMode } from "@/demo/demoMode";
import { DEMO_LOCATIONS, isDemoDistrict } from "@/demo/demoLocations";
import {
  BD_BOUNDS,
  DARK_MAP_STYLES,
  DEFAULT_CENTER,
  LIGHT_MAP_STYLES,
  districtLabel,
  isInBangladesh,
  rememberPlace,
  reverseGeocode,
  summarisePlace,
} from "./locationUtils";
import { ALL_DISTRICTS } from "../../../../public/AllDistrictsData/AllDistricts";

// Shortcuts to the main cities (and the only demo-data districts).
const QUICK_PLACES = DEMO_LOCATIONS.map((l) => ({
  key: l.key,
  label: l.districtName.split("(")[0].trim(),
  position: { lat: l.latitude, lng: l.longitude },
  district: ALL_DISTRICTS.find((d) => d._id === l.districtId),
}));

const GEO_ERRORS = {
  1: "Location access is off. Search for your address or move the map.",
  2: "Couldn't find your location. Search for your address or move the map.",
  3: "Finding your location took too long. Try again or move the map.",
};

/**
 * Map location picker: a fixed pin in the middle, the map moves under it.
 * The address under the pin is looked up when the map stops moving, and
 * Confirm saves it (with its district) as the delivery location.
 *
 * variant "modal" sizes the map for a dialog; "page" fills the screen.
 * onConfirm({ changed }) runs after saving; changed = new district.
 */
const LocationPicker = ({ variant = "modal", onConfirm }) => {
  const dispatch = useDispatch();
  const saved = useSelector((state) => state.user.currentUserLocation);

  const mapEl = useRef(null);
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const centerRef = useRef(null);
  const requestRef = useRef(0);
  const timerRef = useRef(null);

  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [dragging, setDragging] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [place, setPlace] = useState(null); // { title, subtitle, district }
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState(null);
  const [query, setQuery] = useState("");

  const isPage = variant === "page";

  const savedPosition =
    Number(saved?.userLatitude) && Number(saved?.userLongitude)
      ? { lat: Number(saved.userLatitude), lng: Number(saved.userLongitude) }
      : null;

  // Look up the address under the pin. Only the newest request may update
  // the card, so a slow answer for an old position can't overwrite it.
  const resolveCenter = useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;
    const c = map.getCenter();
    const position = { lat: c.lat(), lng: c.lng() };
    centerRef.current = position;

    const id = ++requestRef.current;
    setResolving(true);
    try {
      const summary = await reverseGeocode(position);
      if (id !== requestRef.current) return;
      setPlace(summary);
    } catch {
      if (id !== requestRef.current) return;
      setPlace(null);
      setNotice("Couldn't look up this address. Check your connection and move the map again.");
    } finally {
      if (id === requestRef.current) setResolving(false);
    }
  }, []);

  const goTo = useCallback((position, zoom = 17) => {
    const map = mapRef.current;
    if (!map) return;
    map.panTo(position);
    if (map.getZoom() !== zoom) map.setZoom(zoom);
  }, []);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setNotice("This browser can't share your location. Search for your address instead.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        const position = { lat: coords.latitude, lng: coords.longitude };
        if (!isInBangladesh(position)) {
          setNotice("You seem to be outside Bangladesh. Search for a delivery address instead.");
          return;
        }
        setNotice(null);
        goTo(position, 17);
      },
      (error) => {
        setLocating(false);
        setNotice(GEO_ERRORS[error.code] || GEO_ERRORS[2]);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }, [goTo]);

  // Create the map once. It opens on the saved location (or Dhaka) right
  // away instead of waiting for the browser's location permission.
  useEffect(() => {
    let cancelled = false;
    const listeners = [];

    (async () => {
      try {
        const [{ Map }, { Autocomplete }] = await Promise.all([
          loader.importLibrary("maps"),
          loader.importLibrary("places"),
        ]);
        if (cancelled || !mapEl.current) return;

        const dark = document.documentElement.classList.contains("dark");
        const map = new Map(mapEl.current, {
          center: savedPosition || DEFAULT_CENTER,
          zoom: savedPosition ? 16 : 13,
          minZoom: 6,
          maxZoom: 20,
          restriction: { latLngBounds: BD_BOUNDS, strictBounds: false },
          disableDefaultUI: true,
          zoomControl: !isPage,
          // Middle of the right edge, clear of the locate button below.
          zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_CENTER,
          },
          gestureHandling: "greedy",
          clickableIcons: false,
          backgroundColor: dark ? "#1f232b" : "#eef0f3",
          styles: dark ? DARK_MAP_STYLES : LIGHT_MAP_STYLES,
        });
        mapRef.current = map;

        listeners.push(
          map.addListener("dragstart", () => {
            clearTimeout(timerRef.current);
            setDragging(true);
          }),
          map.addListener("idle", () => {
            setDragging(false);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(resolveCenter, 250);
          }),
        );

        const autocomplete = new Autocomplete(inputRef.current, {
          fields: ["geometry", "formatted_address", "address_components", "name"],
          componentRestrictions: { country: "bd" },
        });
        autocomplete.bindTo("bounds", map);
        listeners.push(
          autocomplete.addListener("place_changed", () => {
            const result = autocomplete.getPlace();
            const location = result?.geometry?.location;
            if (!location) {
              setNotice("Pick an address from the list to move the map there.");
              return;
            }
            const position = { lat: location.lat(), lng: location.lng() };
            // The search result already has the address; cache it so the
            // lookup after the map moves is free.
            rememberPlace(position, summarisePlace(result, result.name));
            setQuery(result.name || result.formatted_address || "");
            setNotice(null);
            inputRef.current?.blur();
            goTo(position, 17);
          }),
        );

        setStatus("ready");
        if (!savedPosition) locate();
      } catch (error) {
        console.error("Google Maps failed to load:", error);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timerRef.current);
      listeners.forEach((l) => l.remove());
      mapRef.current = null;
    };
    // Runs once: the saved location is only the starting point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chooseQuickPlace = (quick) => {
    setNotice(null);
    if (mapRef.current) {
      goTo(quick.position, 14);
    } else {
      // Map unavailable: the city itself can still be confirmed.
      centerRef.current = quick.position;
      setPlace({ title: quick.label, subtitle: "City centre", district: quick.district });
    }
  };

  const confirm = () => {
    const district = place?.district;
    const position = centerRef.current;
    if (!district || !position) return;

    const changed = district._id !== saved?.districtId;
    dispatch(
      handleUserReducer({
        type: "SAVE_USER_CURRENT_LOCATION",
        data: {
          setCurrentLocation: false,
          userLatitude: position.lat,
          userLongitude: position.lng,
          districtId: district._id,
          districtName: district.district_name,
          districtAreaId: "00",
          districtAreaName: "",
          districtSubAreaId: "00",
          districtSubAreaName: "",
          address: place.subtitle || place.title,
        },
      }),
    );
    onConfirm?.({ changed });
  };

  const district = place?.district;
  const busy = dragging || resolving || status === "loading";
  const outsideDemo = isDemoMode() && district && !isDemoDistrict(district._id);

  return (
    <div className={`flex min-h-0 flex-col ${isPage ? "flex-1" : ""}`}>
      {/* Map */}
      <div
        className={`relative isolate overflow-hidden bg-gray-100 ${
          isPage ? "min-h-[280px] flex-1" : "h-[min(52vh,440px)] min-h-[260px]"
        }`}
      >
        <div ref={mapEl} className="absolute inset-0" />

        {/* Search */}
        <div className="absolute inset-x-3 top-3 z-10 sm:inset-x-4 sm:top-4">
          <label className="flex h-12 items-center gap-2 rounded-2xl border border-gray-200 bg-white pl-4 pr-1.5 shadow-lg shadow-gray-900/10 focus-within:border-[#0C3F8E] focus-within:ring-2 focus-within:ring-[#0C3F8E]/15">
            <HiMagnifyingGlass className="shrink-0 text-lg text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search area, road or building"
              aria-label="Search for an address"
              disabled={status === "error"}
              autoComplete="off"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <HiXMark className="text-lg" />
              </button>
            )}
          </label>
        </div>

        {/* Fixed pin: lifts while the map moves */}
        {status !== "error" && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
            <div
              className={`transition-transform duration-200 ease-out ${
                dragging ? "-translate-y-3" : "translate-y-0"
              }`}
            >
              <svg width="40" height="50" viewBox="0 0 40 50" aria-hidden="true" className="drop-shadow-lg">
                <path
                  d="M20 49c-1.2 0-2-1-2.6-2C11 37.6 1.5 29.4 1.5 19.5a18.5 18.5 0 0 1 37 0c0 9.9-9.5 18.1-15.9 27.5-.6 1-1.4 2-2.6 2Z"
                  fill="#EB5C2F"
                  stroke="#fff"
                  strokeWidth="2.5"
                />
                <circle cx="20" cy="19.5" r="6.5" fill="#fff" />
              </svg>
            </div>
            <div
              className={`mx-auto h-1.5 w-3 rounded-full bg-gray-900/30 blur-[1px] transition-all duration-200 ${
                dragging ? "scale-150 opacity-60" : "scale-100 opacity-100"
              }`}
            />
          </div>
        )}

        {/* Locate me */}
        {status === "ready" && (
          <button
            type="button"
            onClick={locate}
            disabled={locating}
            aria-label="Use my current location"
            title="Use my current location"
            className="absolute bottom-6 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-[#0C3F8E] shadow-lg shadow-gray-900/10 transition-colors hover:bg-gray-50 disabled:opacity-70 sm:right-4"
          >
            {locating ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#0C3F8E]/25 border-t-[#0C3F8E]" />
            ) : (
              <MdMyLocation className="text-xl" />
            )}
          </button>
        )}

        {/* Loading / error overlays */}
        {status === "loading" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center gap-3 text-sm text-gray-500">
              <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-300 border-t-[#0C3F8E]" />
              Loading map…
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-50 p-6 text-center">
            <div className="max-w-xs">
              <HiExclamationTriangle className="mx-auto text-3xl text-amber-500" />
              <p className="mt-2 font-semibold text-gray-900">The map couldn&apos;t load</p>
              <p className="mt-1 text-sm text-gray-500">
                Check your connection and try again, or pick your city below.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0C3F8E] hover:underline"
              >
                <HiArrowPath /> Try again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Address and confirm */}
      <div
        className={`space-y-3 border-t border-gray-200 bg-white p-4 sm:p-5 ${
          isPage ? "pb-[max(1rem,env(safe-area-inset-bottom))]" : ""
        }`}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EB5C2F]/10 text-[#EB5C2F]">
            <HiMapPin className="text-xl" />
          </span>
          <div className="min-w-0 flex-1" aria-live="polite">
            {busy && !place ? (
              <div className="space-y-2 pt-1">
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
              </div>
            ) : place ? (
              <div className={`transition-opacity ${busy ? "opacity-50" : "opacity-100"}`}>
                <p className="truncate font-semibold text-gray-900">{place.title}</p>
                {place.subtitle && (
                  <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-gray-500">
                    {place.subtitle}
                  </p>
                )}
              </div>
            ) : (
              <p className="pt-2 text-sm text-gray-500">
                {status === "error"
                  ? "Pick your city to continue."
                  : "Move the map to put the pin on your address."}
              </p>
            )}
          </div>
          {district && !busy && (
            <span className="mt-1 shrink-0 rounded-full bg-[#0C3F8E]/10 px-2.5 py-1 text-xs font-semibold text-[#0C3F8E] dark:text-[#7FB2FF]">
              {districtLabel(district).split("(")[0].trim()}
            </span>
          )}
        </div>

        {!busy && place && !district && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
            We don&apos;t deliver to this area yet. Move the pin inside a district we serve.
          </p>
        )}
        {!busy && outsideDemo && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Demo data is only available for Dhaka and Chittagong. Other districts will show
            empty lists.
          </p>
        )}
        {notice && (
          <p className="flex items-start gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-700">
            <span className="flex-1">{notice}</span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss"
              className="-mr-1 shrink-0 text-gray-400 hover:text-gray-700"
            >
              <HiXMark className="text-base" />
            </button>
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Jump to</span>
          {QUICK_PLACES.map((quick) => (
            <button
              key={quick.key}
              type="button"
              onClick={() => chooseQuickPlace(quick)}
              className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              {quick.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={confirm}
          disabled={!district || busy}
          className={`${PRIMARY_BUTTON} h-12 w-full text-[15px]`}
        >
          {busy && status !== "error" ? "Finding address…" : "Confirm location"}
        </button>
      </div>
    </div>
  );
};

export default LocationPicker;
