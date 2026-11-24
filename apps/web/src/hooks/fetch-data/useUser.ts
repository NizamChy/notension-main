import { useSessionStore } from "@/stores/sessionStore";
import { useShallow } from "zustand/react/shallow";
import Cookies from "js-cookie";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import notify, { errorMessage } from "@/utils/notify";
import { isLiveService } from "@/api-endpoints/live";
import { useRouter } from "next/navigation";
import { logout } from "@/stores/logout";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useFavouritesStore } from "@/stores/favouritesStore";
import { toUserLocation } from "@/utils/userLocation";
import { DEMO_USER_CONTACT } from "@/demo/demoUser";
import { isSampleDataForced } from "@/demo/backendStatus";
import {
  demoLogin,
  logoutCustomer,
  saveProfile,
  sendOtp,
  sendOtpLegacy,
  verifyOtp as verifyOtpRequest,
  type SessionCustomer,
} from "@/lib/api/user";
import type { ProfileForm } from "@/lib/forms/customerForms";

// What the store keeps for a customer (see saveLoggedInUserInfo); fields may
// be missing in sessions saved by older versions.
type CustomerInfo = Partial<SessionCustomer>;

const NO_AREA_ID = "303030303030303030303030";

// Login runs on the new API (OTP checked on the server, session cookie) when
// USER is a live service; otherwise the old flow, answered by demo mode.
// Chosen sample data uses the demo sign-in (demo/modules/user.ts).
export const isLiveLogin = () => isLiveService("USER") && !isSampleDataForced();

const saveLoggedInUserInfo = (user: SessionCustomer) => {
  useSessionStore.getState().login(user);

  // Only the user id is stored: it lets a future proxy/middleware route
  // guard know the user is logged in. No name/phone (PII) in cookies.
  Cookies.set("user_info", JSON.stringify({ _id: user._id }), {
    expires: 7, // days
    sameSite: "lax",
    secure: window.location.protocol === "https:",
  });
};

/** The profile fields of a customer, "" when missing. */
const profileOf = (user: CustomerInfo | null | undefined) => ({
  _id: user?._id || "",
  custom_id: user?.custom_id || "",
  customer_name: user?.customer_name || "",
  customer_address: user?.customer_address || "",
  email: user?.email || "",
  contact_no: user?.contact_no || "",
  alternative_contact_no: user?.alternative_contact_no || "",
});

export type UserInfo = ReturnType<typeof profileOf> & Record<string, unknown>;

export const useUser = () => {
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  const router = useRouter();

  const { userLatitude, userLongitude, currentUserLocation } = useSessionStore(
    useShallow((s) => ({ userLatitude: s.userLatitude, userLongitude: s.userLongitude, currentUserLocation: s.currentUserLocation })),
  );

  // The store keeps the customer the API sent (see saveLoggedInUserInfo).
  const loggedinUserInfo = useSessionStore((s) => s.userInfo) as CustomerInfo;

  // The account being logged in or edited, sent to /register with the
  // form's name / address / backup number.
  const [userInfo, setUserInfo] = useState<UserInfo>(() => ({
    ...profileOf(loggedinUserInfo),
    // NOTE: intentionally swapped to match what the backend already stores:
    // it saves [longitude, latitude] from these fields, and getOtp() reads
    // location.coordinates[0] back as latitude. Fixing only one side would
    // corrupt existing users' locations; change it together with the
    // backend (plus a data migration).
    longitude: userLatitude,
    latitude: userLongitude,
    district_area_id: NO_AREA_ID,
    district_subarea_id: NO_AREA_ID,
    district_id: (currentUserLocation?.districtId as string | undefined) || NO_AREA_ID,
    district_name_by_location: (currentUserLocation?.districtName as string | undefined) || "",
    ref_contact: "",
  }));

  const setUserData = (user: CustomerInfo | null | undefined) =>
    setUserInfo((prev) => ({ ...prev, ...profileOf(user) }));

  const sendOtpMutation = useMutation({
    mutationFn: async (props: { contact_no: string; otp?: number; smsKey?: string }) => {
      if (isLiveLogin()) {
        const res = await sendOtp(props.contact_no);
        if (res.demo_otp) {
          // No SMS provider configured yet: the API returns the code.
          notify.otp(res.demo_otp);
        } else {
          notify.success("Verification code sent to your phone");
        }
        return;
      }

      const res = await sendOtpLegacy(props);
      if (res.user_exist) {
        setUserData(res.result);
        setIsUserRegistered(true);

        if (!currentUserLocation || Object.keys(currentUserLocation).length === 0) {
          // Missing values end up as the store's "00" defaults.
          const result = res.result;
          const userLocation = toUserLocation({
            latitude: result?.location?.coordinates?.[0] ?? "",
            longitude: result?.location?.coordinates?.[1] ?? "",
            districtId: result?.district_id ?? "",
            districtName: result?.district_name_by_location,
          });

          useSessionStore.getState().saveLocation(userLocation);
        }
      }
      // Answered by demo data (demo/modules/user.ts), which shows the code
      // itself.
    },
  });

  const registerMutation = useMutation({
    mutationFn: (body: UserInfo) => saveProfile(body),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ contactNo, otp }: { contactNo: string; otp: string }) => verifyOtpRequest(contactNo, otp),
  });

  const demoLoginMutation = useMutation({
    mutationFn: async () => {
      // Old flow: send-otp without an `otp` just looks the account up (no
      // SMS, no toast).
      const res = isLiveLogin() ? await demoLogin() : await sendOtpLegacy({ contact_no: DEMO_USER_CONTACT });
      if (!res.result?._id) throw new Error("Demo user not found");
      return res.result;
    },
  });

  const progressing =
    sendOtpMutation.isPending ||
    registerMutation.isPending ||
    verifyMutation.isPending ||
    demoLoginMutation.isPending;

  /** Resolves to true when the OTP request succeeded. */
  const getOtp = (props: { contact_no: string; otp?: number; smsKey?: string }) => {
    setUserInfo((prev) => ({ ...prev, contact_no: props.contact_no }));
    setIsUserRegistered(false);

    return sendOtpMutation
      .mutateAsync(props)
      .then(() => true)
      .catch((error) => {
        notify.error(
          isLiveLogin()
            ? errorMessage(error, "We couldn't send the code. Please try again.")
            : "We couldn't send the code. Please try again.",
        );
        return false;
      });
  };

  /**
   * Saves the profile (with the form's fields) and logs in with the account
   * the API returns. Resolves to true when it succeeded.
   */
  const registerUser = (profile: Partial<ProfileForm>, success_message = "") => {
    if (!currentUserLocation) return Promise.resolve(false);

    return registerMutation
      .mutateAsync({ ...userInfo, ...profile })
      .then((res) => {
        if (res.result) saveLoggedInUserInfo(res.result);
        if (success_message) notify.success(success_message);
        return true;
      })
      .catch(() => false);
  };

  // Live login: the server checks the code and sets the session cookie.
  // Resolves to { ok, isNew }; a new account still needs a name and address
  // (registerUser) before it counts as logged in here.
  const verifyOtp = (contactNo: string, otp: string) =>
    verifyMutation
      .mutateAsync({ contactNo, otp })
      .then((res) => {
        const user = res.result;
        if (!user?._id) throw new Error("No user in response");
        setUserData(user);
        const isNew = res.is_new;
        if (!isNew) {
          saveLoggedInUserInfo(user);
          notify.success("Logged in successfully");
        }
        return { ok: true, isNew };
      })
      .catch((error) => {
        notify.error(errorMessage(error, "The verification code is incorrect. Please try again."));
        return { ok: false, isNew: false };
      });

  // Sign in as the ready-made demo customer without an OTP.
  const loginAsDemoUser = () =>
    demoLoginMutation
      .mutateAsync()
      .then((user) => {
        saveLoggedInUserInfo(user);
        notify.success(`Logged in as ${user.customer_name || "demo user"}`);
        return true;
      })
      .catch((error) => {
        notify.error(errorMessage(error, "Demo login failed. Please try again."));
        return false;
      });

  const handleUserLogout = async () => {
    // Ends the server session too (live login); network errors don't matter.
    if (isLiveLogin()) await logoutCustomer().catch(() => {});
    Cookies.remove("user_info");

    logout();
    // The account's wishlist and favourites go too.
    useWishlistStore.getState().clear();
    useFavouritesStore.getState().clear();

    router.push("/");
  };

  return {
    isUserRegistered,
    progressing,
    userInfo,
    getOtp,
    registerUser,
    handleUserLogout,
    loginAsDemoUser,
    verifyOtp,
  };
};
