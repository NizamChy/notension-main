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
import doctorReducer from "./doctorReducer";
import allCareReducer from "./allCareReducer";
import itemsByStoreReducer from "./items-by-shop";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./dashboardReducer";
import userChoiceReducer from "./userChoiceReducer";
import createMigrate from "redux-persist/lib/createMigrate";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import productReducer from "./productReducer";

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
  allCare: allCareReducer,
  doctorInfo: doctorReducer,
  dashboard: dashboardReducer,
  userChoice: userChoiceReducer,
  itemsByStore: itemsByStoreReducer,
  product: productReducer,
});

// Bump `version` and add a migration whenever the persisted shape changes.
const migrations = {
  // v1: drop never-used credential fields that older builds persisted.
  1: (state) => {
    if (!state?.user) return state;
    const { apiKey, userPin, fireBaseToken, ...user } = state.user;
    return { ...state, user };
  },
};

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  migrate: createMigrate(migrations, { debug: false }),
  whitelist: [
    "user",
    "cart",
    "allCare",
    "dashboard",
    "userChoice",
    "doctorInfo",
    "itemsByStore",
    "product",
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
