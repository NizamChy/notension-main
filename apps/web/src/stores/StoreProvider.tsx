"use client";

import { useEffect, useState, type ReactNode } from "react";
import { applyDemoDefaults } from "@/demo/installDemoMode";
import { hydrateStores } from "./hydrate";

/**
 * Loads the saved Zustand stores, then renders the app (what redux-persist's
 * PersistGate did). Pages read the session, carts and favourites in effects
 * (login prompts, redirects), so they wait for the saved state instead of
 * running once with the empty initial one.
 */
export default function StoreProvider({ children }: { children: ReactNode }) {
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

  return ready ? <>{children}</> : null;
}
