"use client";

import { useSyncExternalStore } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

// Light / dark switch. The theme is the "dark" class on <html>: the inline
// script in app/layout.js sets it before the first paint (saved choice, or
// the system preference), and this button flips it and saves the choice.

const subscribe = (onChange) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
};

const isDarkNow = () => document.documentElement.classList.contains("dark");

const ThemeToggle = ({ className = "" }) => {
  // The server always renders the light icon; the client switches after
  // hydration if the page is dark.
  const isDark = useSyncExternalStore(subscribe, isDarkNow, () => false);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked (private mode): the switch still works for this visit.
    }
  };

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`shrink-0 h-9 w-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors ${className}`}
    >
      {isDark ? (
        <MdLightMode className="text-xl" />
      ) : (
        <MdDarkMode className="text-xl" />
      )}
    </button>
  );
};

export default ThemeToggle;
