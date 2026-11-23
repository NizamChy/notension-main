import StoreItemTile from "./StoreItemTile";
import MedicineItems from "@/components/Medicine/MedicineItems/MedicineItems";

// The item card each store module renders in shared item lists. Cards get
// `moduleName` too; MedicineItems ignores it (it moves to StoreItemTile in PR 3).
export const ITEM_CARDS = {
  grocery: StoreItemTile,
  medicine: MedicineItems,
};
