import { redirect } from "next/navigation";

// This segment has no landing page of its own.
export default function Page() {
  redirect("/grocery/home");
}
