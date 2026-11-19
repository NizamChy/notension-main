"use client";

import { Provider } from "react-redux";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { applyDemoDefaults } from "@/demo/installDemoMode";

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={applyDemoDefaults}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
