import { useState } from "react";
import { removeFavourite, saveFavourite } from "@/lib/api/favourites";
import {
  ID_FIELD,
  listKey,
  useFavouritesStore,
  type Favourite,
  type FavouriteKind,
} from "@/stores/favouritesStore";
import { useSessionStore } from "@/stores/sessionStore";
import notify from "@/utils/notify";

// Saving and removing favourites (replaces the Redux side of the old
// favorite-shop / favorite-item / favorite-list hooks). The API answer
// updates the saved lists in useFavouritesStore.

/** How many favourites each list keeps, and what the warning calls them. */
const LIMITS: Record<string, { max: number; noun: string }> = {
  "store:0": { max: 10, noun: "stores" },
  "store:1": { max: 10, noun: "stores" },
  "store:2": { max: 30, noun: "stores" },
  "item:0": { max: 100, noun: "items" },
  "item:1": { max: 100, noun: "items" },
  "list:3": { max: 25, noun: "centres" },
  "list:4": { max: 25, noun: "doctors" },
};

export function useFavourites(kind: FavouriteKind) {
  const [visible, setVisible] = useState(false);
  const userInfo = useSessionStore((s) => s.userInfo);
  const lists = useFavouritesStore((s) => s.lists);
  const idField = ID_FIELD[kind];

  const isSaved = (refId: unknown, merchantType: number) =>
    (lists[listKey(kind, merchantType)] ?? []).some((e) => e[idField] === refId);

  const owner = () => ({ customerInfo: userInfo._id, custom_customer_id: userInfo.custom_id });

  /** Saves `snapshot` (it carries the id field) for the signed-in user. */
  const save = async (merchantType: number, snapshot: Favourite) => {
    if (!snapshot[idField] || !userInfo._id) return;
    const key = listKey(kind, merchantType);
    const limit = LIMITS[key];
    if (limit && (lists[key]?.length ?? 0) >= limit.max) {
      notify.warning(`You can save up to ${limit.max} ${limit.noun} in favourites.`);
      return;
    }
    setVisible(true);
    try {
      const saved = await saveFavourite(kind, { merchantType, ...owner(), ...snapshot });
      useFavouritesStore.getState().add(kind, merchantType, saved);
      notify.success("Added to favourites");
    } catch {
      // Network or server error: nothing changed.
    } finally {
      setVisible(false);
    }
  };

  const remove = async (merchantType: number, snapshot: Favourite) => {
    const refId = snapshot[idField];
    if (typeof refId !== "string") return;
    setVisible(true);
    try {
      await removeFavourite(kind, { merchantType, ...owner(), ...snapshot });
      // Removed locally by id: the demo backend forgets favourites on reload,
      // so its remaining list is not the device's list.
      useFavouritesStore.getState().remove(kind, merchantType, refId);
      notify.success("Removed from favourites");
    } catch {
      // Network or server error: nothing changed.
    } finally {
      setVisible(false);
    }
  };

  return { visible, isSaved, save, remove };
}
