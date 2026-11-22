"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { applyDemoDefaults } from "@/demo/installDemoMode";
import { hydrateStores } from "@/stores/hydrate";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={async () => {
          await hydrateStores();
          applyDemoDefaults();
        }}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
