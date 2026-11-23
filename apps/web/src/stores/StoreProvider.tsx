"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { applyDemoDefaults } from "@/demo/installDemoMode";
import RoundLoader from "@/components/shared/RoundLoader/RoundLoader";
import { hydrateStores } from "./hydrate";

/**
 * Pages that only show saved state (the navbar's account and location) and
 * never write a store or prompt while loading. They render on the server and
 * fill in the saved session once the stores load.
 */
const RENDER_BEFORE_LOAD = new Set(["/", "/guide", "/marketing-policy", "/demo-accounts"]);

export const rendersBeforeStoresLoad = (pathname: string | null): boolean =>
  RENDER_BEFORE_LOAD.has(pathname ?? "");

/**
 * Loads the saved Zustand stores. Every other page waits for them behind a
 * loader: their effects read the session, carts and favourites (login prompts,
 * location redirects, the current module) and a store written before it loads
 * would overwrite the saved data.
 */
export default function StoreProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void hydrateStores().then(() => {
      applyDemoDefaults();
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (ready || rendersBeforeStoresLoad(pathname)) return <>{children}</>;

  return (
    // Same overlay as app/loading.js, so a slow load shows a spinner, not a blank page.
    <div className="fixed inset-0 z-50 bg-(--background) flex justify-center items-center">
      <RoundLoader />
    </div>
  );
}
