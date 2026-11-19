import { redirect } from "next/navigation";

// A store URL needs /[store]/[storeId]/[customStoreId]; without the ids there
// is no store to show, so send the visitor to the store list.
export default function Page() {
  redirect("/medicine");
}
