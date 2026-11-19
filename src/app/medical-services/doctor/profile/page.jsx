import { redirect } from "next/navigation";

// Doctor profiles live at /medical-services/doctor/profile/[id]; the bare
// path has no doctor to show, so send old links to the doctor home.
export default function Page() {
  redirect("/medical-services/doctor");
}
