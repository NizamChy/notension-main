import Link from "next/link";
import NoStoreFound from "./NoStoreFound";
import { SECONDARY_BUTTON } from "../shared/UI/UI";

const STORE_LIST = {
  food: "/food",
  grocery: "/grocery/home/find-store",
  medicine: "/medicine/home/find-store",
};

// Shown by the store layouts when a store link points at a store that does
// not exist (or no longer exists) or is closed right now.
const StoreUnavailable = ({ moduleName, status }) => {
  const closed = status === "closed";

  return (
    <NoStoreFound
      title={closed ? "This store is closed right now" : "Store not found"}
      text={
        closed
          ? "It isn't taking orders at the moment. Please check back later or pick another store nearby."
          : "This link doesn't match any store. It may have moved or been removed."
      }
      action={
        <Link href={STORE_LIST[moduleName] || "/"} className={SECONDARY_BUTTON}>
          {moduleName === "food" ? "Browse restaurants" : "Find stores nearby"}
        </Link>
      }
    />
  );
};

export default StoreUnavailable;
