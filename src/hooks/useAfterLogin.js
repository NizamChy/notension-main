"use client";

import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";

const ROUTE_BY_TYPE = {
  login: "/",
  doctor: "/medical-services/doctor",
  eyeCareCenter: "/medical-services/eye-care-center",
  dentalCareCenter: "/medical-services/dental-care-center",
  hospital: "/medical-services/hospital",
  diagnostic: "/medical-services/diagnostic",
  medicalService: "/medical-services",
  appointment: "/medical-services/doctor/book-appointment",
};

// Where to go after a successful login, based on what opened the login
// (`type`). Shared by OTP login and demo-user login.
export const useAfterLogin = (type = "login", onClose = () => {}) => {
  const router = useRouter();
  const params = useParams();

  const currentModule = useSelector((state) => state.dashboard.currentModule);
  const moduleName = currentModule.toLowerCase();

  return () => {
    onClose();

    if (type === "cart") {
      const storePath = `${params?.store}/${params?.storeId}/${params?.customStoreId}/checkout`;
      router.push(
        moduleName === "food"
          ? `/${moduleName}/store/${storePath}`
          : `/${moduleName}/${storePath}`,
      );
      return;
    }

    const route = ROUTE_BY_TYPE[type];
    if (route) router.push(route);
  };
};
