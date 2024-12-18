import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_URL } from "@/api-endpoints/secret";
import {
  OTP_FOR_REGISTARTION,
  USER_REGISTARTION,
} from "@/api-endpoints/api-endpoint";
import { handleUserReducer } from "@/redux/userReducer";
axios.defaults.withCredentials = true;

const Axios = axios.create({
  baseURL: USER_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const useUser = () => {
  const loggedinUserInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [progressing, setProgressing] = React.useState(false);

  const [userInfo, setUserInfo] = useState({
    _id: loggedinUserInfo?._id || "",
    custom_id: loggedinUserInfo?.custom_id || "",
    customer_name: loggedinUserInfo?.customer_name || "",
    customer_address: loggedinUserInfo?.customer_address || "",
    email: loggedinUserInfo?.email || "",
    contact_no: loggedinUserInfo?.contact_no || "",
    alternative_contact_no: loggedinUserInfo?.alternative_contact_no || "",
    longitude: 32324324,
    latitude: 234342,
    // longitude: userLatitude,
    // latitude: userLongitude,
    district_name_by_location: "",
    // district_id: districtId,
    // district_id: 10,
    district_area_id: "303030303030303030303030",
    district_subarea_id: "303030303030303030303030",
    ref_contact: "",
  });

  const getOtp = (props) => {
    console.log("props : ", props);
    handleDataChange(props.contact_no, "contact_no");
    setProgressing(true);
    setIsUserRegistered(false);
    Axios.post(OTP_FOR_REGISTARTION, props)
      .then((res) => {
        console.log("res?.result?.data", res?.data);
        if (res?.data?.user_exist) {
          setUserData(res?.data?.result);
          setIsUserRegistered(true);
        }
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
        console.log("error.errors", error);
        console.log("result =", error?.response?.data?.errors);

        console.log("result =", error?.response);
        // alert("Hold on!", "Something went wrong. Please Try Again!", [
        //   {
        //     text: "OK",
        //     onPress: () => null,
        //     style: "OK",
        //   },
        // ]);
        // navigation.navigate("Login");
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

  const registerUser = () => {
    setProgressing(true);

    console.log("Click", userInfo);

    Axios.post(USER_REGISTARTION, userInfo)
      .then((res) => {
        saveLoggedInUserInfo(res?.data?.result);

        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);

        console.log("result =", error?.response?.data?.errors);
        // const errorMsg = formatServerError(error?.response?.data?.errors);
      });
  };

  const saveLoggedInUserInfo = (user) => {
    dispatch(
      handleUserReducer({
        type: "SAVE_LOGGEDIN_INFO",
        data: user,
      })
    );
  };

  useEffect(() => {
    if (error) logout();
  }, [error]);

  return {
    isUserRegistered,
    progressing,
    userInfo,
    setUserInfo,
    setProgressing,
    handleDataChange,
    getOtp,
    registerUser,
  };
};
