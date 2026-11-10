import { getApiClient } from "@/lib/apiClient";
import Cookies from "js-cookie";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  USER_REGISTRATION,
  OTP_FOR_REGISTRATION,
} from "@/api-endpoints/api-endpoint";
import { persistor } from "@/redux/store";
import { useRouter } from "next/navigation";
import { USER_URL } from "@/api-endpoints/env";
import { useDispatch, useSelector } from "react-redux";
import { handleUserReducer } from "@/redux/userReducer";

const Axios = getApiClient(USER_URL);

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
            let userLocation = {
              setCurrentLocation: false,
              userLatitude: res?.data?.result?.location?.coordinates[0],
              userLongitude: res?.data?.result?.location?.coordinates[1],
              districtId: res?.data?.result?.district_id,
              districtName: res?.data?.result?.district_name_by_location,
              districtAreaId: "00",
              districtAreaName: "",
              districtSubAreaId: "00",
              districtSubAreaName: "",
              // formatted_address: formatted_address,
            };

            dispatch(
              handleUserReducer({
                type: "SAVE_USER_CURRENT_LOCATION",
                data: userLocation,
              })
            );
          }
        }

        toast.success("OTP sent to your phone!");
        setProgressing(false);
        return true;
      })

      .catch((error) => {
        setProgressing(false);

        toast.error("Something went wrong. Please Try Again!");
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

        if (res?.data?.success) {
          toast.success(`${success_message}`, {
            style: {
              border: "1px solid #FC8F1E",
            },
            iconTheme: {
              primary: "#FC8F1E",
              secondary: "#FFFAEE",
            },
          });
        }
        setProgressing(false);
        return Boolean(res?.data?.success);
      })
      .catch(() => {
        setProgressing(false);
        return false;
      });
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

  const handleUserLogout = () => {
    Cookies.remove("user_info");

    dispatch(handleUserReducer({ type: "LOGOUT_USER", data: {} }));

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
  };
};
