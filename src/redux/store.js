"use client";

import {
  FLUSH,
  PAUSE,
  PURGE,
  PERSIST,
  REGISTER,
  REHYDRATE,
  persistStore,
  persistReducer,
} from "redux-persist";
import userReducer from "./userReducer";
import cartReducer from "./cartReducer";
import { combineReducers } from "redux";
import doctorReducer from "./doctorReducer";
import itemsByStoreReducer from "./items-by-shop";
import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./dashboardReducer";
import userChoiceReducer from "./userChoiceReducer";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  doctorInfo: doctorReducer,
  dashboard: dashboardReducer,
  userChoice: userChoiceReducer,
  itemsByStore: itemsByStoreReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "user",
    "cart",
    "dashboard",
    "userChoice",
    "doctorInfo",
    "itemsByStore",
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
