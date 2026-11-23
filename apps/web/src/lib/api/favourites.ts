import { favourites } from "@notension/shared";
import {
  FAVORITE_PRODUCT_PUSH,
  FAVORITE_PRODUCT_REMOVE,
  FAVORITE_STORE_PUSH,
  FAVORITE_STORE_REMOVE,
  PUSH_TO_FAVOURITE,
  REMOVE_FROM_FAVOURITE,
} from "@/api-endpoints/api-endpoint";
import { apiPost } from "./request";

// The customer's favourites: stores (grocery 0, medicine 1, food 2), items
// (grocery 0, medicine 1) and the "list" (consultation centres 3, doctors 4).

export type FavouriteKind = favourites.Kind;
export type FavouriteEntry = favourites.Entry;

// Only push/remove: the "add" endpoints replace the whole server list, which
// would drop favourites saved on another device.
const PATHS: Record<FavouriteKind, { push: string; remove: string }> = {
  store: { push: FAVORITE_STORE_PUSH, remove: FAVORITE_STORE_REMOVE },
  item: { push: FAVORITE_PRODUCT_PUSH, remove: FAVORITE_PRODUCT_REMOVE },
  list: { push: PUSH_TO_FAVOURITE, remove: REMOVE_FROM_FAVOURITE },
};

/** Saves one favourite; answers with the saved entry. */
export async function saveFavourite(kind: FavouriteKind, body: Record<string, unknown>): Promise<FavouriteEntry[]> {
  const res = await apiPost("USER", PATHS[kind].push, body, favourites.entriesResult);
  return res.result;
}

/** Removes one favourite; answers with what is left on the server. */
export async function removeFavourite(kind: FavouriteKind, body: Record<string, unknown>): Promise<FavouriteEntry[]> {
  const res = await apiPost("USER", PATHS[kind].remove, body, favourites.entriesResult);
  return res.result;
}
