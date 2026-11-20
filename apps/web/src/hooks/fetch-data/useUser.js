import { getApiClient } from "@/lib/apiClient";
import Cookies from "js-cookie";
import { useState } from "react";
import notify, { errorMessage } from "@/utils/notify";
import {
  USER_REGISTRATION,
  OTP_FOR_REGISTRATION,
  VERIFY_OTP,
  DEMO_LOGIN,
  CUSTOMER_LOGOUT,
} from "@/api-endpoints/api-endpoint";
import { isLiveService } from "@/api-endpoints/live";
import { persistor } from "@/redux/store";
import { useRouter } from "next/navigation";
import { USER_URL } from "@/api-endpoints/env";
import { useDispatch, useSelector } from "react-redux";
import { handleUserReducer } from "@/redux/userReducer";
import { handleUserChoiceReducer } from "@/redux/userChoiceReducer";
import { toUserLocation } from "@/utils/userLocation";
import { DEMO_USER_CONTACT } from "@/demo/demoUser";
import { isSampleDataForced } from "@/demo/backendStatus";

const Axios = getApiClient(USER_URL);

// Login runs on the new API (OTP checked on the server, session cookie) when
// USER is a live service; otherwise the old flow, answered by demo mode.
// Chosen sample data uses the demo sign-in (demo/modules/user.js).
export const isLiveLogin = () => isLiveService("USER") && !isSampleDataForced();

export const useUser = () => {
  const [progressing, setProgressing] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const { userLatitude, userLongitude, districtId, currentUserLocation } =
    useSelector((state) => state.user);

  const loggedinUserInfo = useSelector((state) => state.user.userInfo);

  const [userInfo, setUserInfo] = useState({
    _id: loggedinUserInfo?._id || "",
    custom_id: loggedinUserInfo?.custom_id || "",
    customer_name: loggedinUserInfo?.customer_name || "",
    customer_address: loggedinUserInfo?.customer_address || "",
    email: loggedinUserInfo?.email || "",
    contact_no: loggedinUserInfo?.contact_no || "",
    alternative_contact_no: loggedinUserInfo?.alternative_contact_no || "",
    // NOTE: intentionally swapped to match what the backend already stores:
    // it saves [longitude, latitude] from these fields, and getOtp() reads
    // location.coordinates[0] back as latitude. Fixing only one side would
    // corrupt existing users' locations; change it together with the
    // backend (plus a data migration).
    longitude: userLatitude,
    latitude: userLongitude,
    district_area_id: "303030303030303030303030",
    district_subarea_id: "303030303030303030303030",
    district_id: currentUserLocation?.districtId || "303030303030303030303030",
    district_name_by_location: currentUserLocation?.districtName || "",
    ref_contact: "",

    // longitude: 32324324,
    // latitude: 234342,
    // district_id: districtId,
    // district_id: 10,
  });

  const getOtp = (props) => {

    handleDataChange(props.contact_no, "contact_no");
    setProgressing(true);
    setIsUserRegistered(false);

    if (isLiveLogin()) {
      return Axios.post(OTP_FOR_REGISTRATION, { contact_no: props.contact_no })
        .then((res) => {
          if (res?.data?.demo_otp) {
            // No SMS provider configured yet: the API returns the code.
            notify.otp(res.data.demo_otp);
          } else {
            notify.success("Verification code sent to your phone");
          }
          return true;
        })
        .catch((error) => {
          notify.error(
            errorMessage(error, "We couldn't send the code. Please try again.")
          );
          return false;
        })
        .finally(() => setProgressing(false));
    }

    // Resolves to true when the OTP request succeeded.
    return Axios.post(OTP_FOR_REGISTRATION, props)
      .then((res) => {

        if (res?.data?.user_exist) {
          setUserData(res?.data?.result);
          setIsUserRegistered(true);

          if (
            !currentUserLocation ||
            Object.keys(currentUserLocation).length === 0
          ) {
            const result = res?.data?.result;
            const userLocation = toUserLocation({
              latitude: result?.location?.coordinates?.[0],
              longitude: result?.location?.coordinates?.[1],
              districtId: result?.district_id,
              districtName: result?.district_name_by_location,
            });

            dispatch(
              handleUserReducer({
                type: "SAVE_USER_CURRENT_LOCATION",
                data: userLocation,
              })
            );
          }
        }

        // Answered by demo data (demo/modules/user.js), which shows the code
        // itself.
        setProgressing(false);
        return true;
      })

      .catch((error) => {
        setProgressing(false);

        notify.error("We couldn't send the code. Please try again.");
        return false;
      });
  };

  const handleDataChange = (value, name) => {
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setUserData = (user) => {
    setUserInfo((prev) => ({
      ...prev,
      _id: user?._id || "",
      custom_id: user?.custom_id || "",
      customer_name: user?.customer_name || "",
      customer_address: user?.customer_address || "",
      email: user?.email || "",
      contact_no: user?.contact_no || "",
      alternative_contact_no: user?.alternative_contact_no || "",
    }));
  };

  // Resolves to true when login/registration succeeded.
  const registerUser = (success_message = "") => {
    if (!currentUserLocation) return Promise.resolve(false);

    setProgressing(true);
    return Axios.post(USER_REGISTRATION, userInfo)
      .then((res) => {
        saveLoggedInUserInfo(res?.data?.result);

        if (res?.data?.success && success_message) {
          notify.success(success_message);
        }
        setProgressing(false);
        return Boolean(res?.data?.success);
      })
      .catch(() => {
        setProgressing(false);
        return false;
      });
  };

  // Live login: the server checks the code and sets the session cookie.
  // Resolves to { ok, isNew }; a new account still needs a name and address
  // (registerUser) before it counts as logged in here.
  const verifyOtp = (contactNo, otp) => {
    setProgressing(true);
    return Axios.post(VERIFY_OTP, { contact_no: contactNo, otp })
      .then((res) => {
        const user = res?.data?.result;
        if (!user?._id) throw new Error("No user in response");
        setUserData(user);
        const isNew = Boolean(res.data.is_new);
        if (!isNew) {
          saveLoggedInUserInfo(user);
          notify.success("Logged in successfully");
        }
        return { ok: true, isNew };
      })
      .catch((error) => {
        notify.error(
          errorMessage(
            error,
            "The verification code is incorrect. Please try again."
          )
        );
        return { ok: false, isNew: false };
      })
      .finally(() => setProgressing(false));
  };

  // Sign in as the ready-made demo customer without an OTP. Old flow:
  // send-otp without an `otp` just looks the account up (no SMS, no toast).
  const loginAsDemoUser = () => {
    setProgressing(true);
    const request = isLiveLogin()
      ? Axios.post(DEMO_LOGIN)
      : Axios.post(OTP_FOR_REGISTRATION, { contact_no: DEMO_USER_CONTACT });
    return request
      .then((res) => {
        const user = res?.data?.result;
        if (!user?._id) throw new Error("Demo user not found");

        saveLoggedInUserInfo(user);
        notify.success(`Logged in as ${user.customer_name || "demo user"}`);
        return true;
      })
      .catch((error) => {
        notify.error(errorMessage(error, "Demo login failed. Please try again."));
        return false;
      })
      .finally(() => setProgressing(false));
  };

  const saveLoggedInUserInfo = (user) => {
    dispatch(
      handleUserReducer({
        type: "SAVE_LOGGEDIN_INFO",
        data: user,
      })
    );

    // Only the user id is stored: it lets a future proxy/middleware route
    // guard know the user is logged in. No name/phone (PII) in cookies.
    Cookies.set("user_info", JSON.stringify({ _id: user._id }), {
      expires: 7, // days
      sameSite: "lax",
      secure: window.location.protocol === "https:",
    });
  };

  const handleUserLogout = async () => {
    // Ends the server session too (live login); network errors don't matter.
    if (isLiveLogin()) await Axios.post(CUSTOMER_LOGOUT).catch(() => {});
    Cookies.remove("user_info");

    dispatch(handleUserReducer({ type: "LOGOUT_USER" }));
    dispatch(handleUserChoiceReducer({ type: "CLEAR_FAVOURITES" }));

    persistor.purge().then(() => {
      router.push("/");
    });
  };

  return {
    isUserRegistered,
    progressing,
    userInfo,
    getOtp,
    setUserInfo,
    registerUser,
    setProgressing,
    handleDataChange,
    handleUserLogout,
    loginAsDemoUser,
    verifyOtp,
  };
};
