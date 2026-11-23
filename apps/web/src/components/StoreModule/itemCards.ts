import type { ComponentType } from "react";
import StoreItemTile from "./StoreItemTile";
import type { ItemModuleName, StoreItem } from "./moduleItems";

type ItemCardProps = { moduleName: ItemModuleName; item: StoreItem; isFavorite?: boolean };

// The item card each store module renders in shared item lists.
export const ITEM_CARDS: Record<ItemModuleName, ComponentType<ItemCardProps>> = {
  grocery: StoreItemTile,
  medicine: StoreItemTile,
};
