"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { HiOutlineArrowPath, HiOutlineSignalSlash } from "react-icons/hi2";
import {
  getBackendStatus,
  getServerBackendStatus,
  isSampleDataForced,
  subscribeBackendStatus,
} from "@/demo/backendStatus";

// Tells the visitor when the site falls back to demo data because the API
// is down, and when it is back (src/demo/backendStatus.js). Not shown when
// the visitor chose sample data (the Demo mode button says so), nor in the
// admin panel, which never shows demo data.
const BackendStatusBanner = () => {
  const pathname = usePathname();
  const status = useSyncExternalStore(
    subscribeBackendStatus,
    getBackendStatus,
    getServerBackendStatus,
  );

  if (!(status === "offline" || status === "back")) return null;
  if (pathname?.startsWith("/admin") || isSampleDataForced()) return null;

  const offline = status === "offline";
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 bottom-16 z-20 mx-auto flex max-w-xl items-start gap-3 rounded-2xl border border-[#F5C46B] bg-[#FFF8E6] px-4 py-3 text-sm text-[#6B4300] shadow-lg shadow-gray-900/10 dark:border-[#7A5A1C] dark:bg-[#2B2210] dark:text-[#F7D9A0]"
    >
      {offline ? (
        <HiOutlineSignalSlash aria-hidden="true" className="mt-0.5 shrink-0 text-lg" />
      ) : (
        <HiOutlineArrowPath aria-hidden="true" className="mt-0.5 shrink-0 text-lg" />
      )}
      <p className="flex-1 leading-snug">
        {offline ? (
          <>
            <span className="font-semibold">Our server isn&apos;t responding.</span> You&apos;re
            seeing sample data, so orders, bookings and sign-ins won&apos;t be saved until
            it&apos;s back.
          </>
        ) : (
          <>
            <span className="font-semibold">We&apos;re back online.</span> Reload to see live
            data.
          </>
        )}
      </p>
      {!offline && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="min-h-9 shrink-0 rounded-full bg-[#6B4300] px-4 text-sm font-semibold text-[#FFFFFF] hover:bg-[#553500] dark:bg-[#F7D9A0] dark:text-[#2B2210]"
        >
          Reload
        </button>
      )}
    </div>
  );
};

export default BackendStatusBanner;
