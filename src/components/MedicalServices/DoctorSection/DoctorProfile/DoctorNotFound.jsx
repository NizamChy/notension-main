import Link from "next/link";
import { FaUserDoctor } from "react-icons/fa6";
import { EmptyState, SECONDARY_BUTTON } from "@/components/shared/UI/UI";

// Shown when a doctor profile link doesn't match a doctor (or chamber).
const DoctorNotFound = () => (
  <div className="mx-auto w-full max-w-[1312px] px-4 py-10 sm:px-6 lg:px-8">
    <EmptyState
      icon={<FaUserDoctor />}
      title="Doctor not found"
      text="This link doesn't match a doctor's profile. It may have moved or been removed."
      action={
        <Link href="/medical-services/doctor" className={SECONDARY_BUTTON}>
          Find doctors
        </Link>
      }
      className="min-h-[40vh]"
    />
  </div>
);

export default DoctorNotFound;
