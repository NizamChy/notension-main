// Sidebar links for the service roles (rider, doctor, service provider).
// Kept apart from AdminShell so the role panels can grow without touching it.
import {
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineIdentification,
  HiOutlineTruck,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";

export function serviceNav(perms) {
  return [
    { href: "/admin/deliveries", label: "Deliveries", icon: HiOutlineTruck, show: perms.isRider },
    { href: "/admin/doctor/appointments", label: "Appointments", icon: HiOutlineCalendarDays, show: perms.isDoctor },
    { href: "/admin/doctor/chambers", label: "Chambers", icon: HiOutlineBuildingOffice2, show: perms.isDoctor },
    { href: "/admin/doctor/profile", label: "Profile", icon: HiOutlineIdentification, show: perms.isDoctor },
    { href: "/admin/my-service", label: "My service", icon: HiOutlineWrenchScrewdriver, show: perms.isProvider },
  ];
}
