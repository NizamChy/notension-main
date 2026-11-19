import { useSyncExternalStore } from "react";

const subscribe = (onChange) => {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
};

// Online / offline status of the browser. The server always reports online.
const useNetworkStatus = () => {
  const isOnline = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

  return { isOnline };
};

export default useNetworkStatus;
