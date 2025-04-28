import {
  ADD_TO_FAVOURITE,
  PUSH_TO_FAVOURITE,
  REMOVE_FROM_FAVOURITE,
} from "@/api-endpoints/api-endpoint";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { USER_URL } from "@/api-endpoints/secret";
import { useDispatch, useSelector } from "react-redux";
import { handleDashboardReducer } from "@/redux/dashboardReducer";
import { handleUserChoiceReducer } from "@/redux/userChoiceReducer";

axios.defaults.withCredentials = true;

const Axios = axios.create({
  baseURL: USER_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const useFavouriteList = () => {
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const loggedinUserInfo = useSelector((state) => state.user.userInfo);

  const { favouriteConsultationCentre, favouriteDoctors } = useSelector(
    (state) => state.userChoice
  );

  const isAddedToFavouriteList = (_id, merchantType) => {
    let existingIndex;

    if (merchantType === 3) {
      existingIndex = favouriteConsultationCentre.findIndex(
        (info) => info?.mongodbId === _id
      );
    } else if (merchantType === 4) {
      existingIndex = favouriteDoctors.findIndex(
        (info) => info?.mongodbId === _id
      );
    }

    if (existingIndex > -1) {
      return true;
    } else {
      return false;
    }
  };

  const addToFavouriteList = (data, merchantType) => {
    let favouriteList = 0;
    let favouriteInfo = {};
    let isAllowed = true;
    if (data?._id !== "" && loggedinUserInfo?._id) {
      setVisible(true);

      if (merchantType === 3) {
        favouriteInfo = {
          merchantType: merchantType,
          customerInfo: loggedinUserInfo?._id,
          custom_customer_id: loggedinUserInfo?.custom_id,
          mongodbId: data?._id,
          center_name: data?.center_name,
          address: data?.address,
          medical_center_banner_app: data?.medical_center_banner_app,
          //custom_id: data?.custom_center_id,
        };
        favouriteList = favouriteConsultationCentre.length;
        if (favouriteList > 24) {
          isAllowed = false;

          alert(
            "Hold on!, You can add up to twenty five (25) Center to your Favorites list !!"
          );
        }
      } else if (merchantType === 4) {
        favouriteInfo = {
          merchantType: merchantType,
          customerInfo: loggedinUserInfo?._id,
          custom_customer_id: loggedinUserInfo?.custom_id,
          mongodbId: data?._id,
          doctor_name: data?.doctor_name,
          qualifications: data?.qualifications,
          speciality: data?.speciality,
          gender: data?.gender,
          profile_pic: data?.profile_pic,
        };
        favouriteList = favouriteDoctors.length;
        if (favouriteList > 24) {
          isAllowed = false;

          alert(
            "Hold on!, You can add up to twenty five (25) Doctors to your Favorites list !!"
          );
        }
      }

      if (favouriteList < 1) {
        manageFavouriteStoreList(ADD_TO_FAVOURITE, favouriteInfo, "add");
      } else {
        if (isAllowed) {
          manageFavouriteStoreList(PUSH_TO_FAVOURITE, favouriteInfo, "push");
        } else {
          setVisible(false);
        }
      }
    }
  };

  const removeFromfavoriteList = (data, merchantType) => {
    setVisible(true);
    const favouriteInfo = {
      merchantType: merchantType,
      customerInfo: loggedinUserInfo?._id,
      custom_customer_id: loggedinUserInfo?.custom_id,
      mongodbId: data?.mongodbId,
    };
    manageFavouriteStoreList(REMOVE_FROM_FAVOURITE, favouriteInfo, "remove");
  };

  const manageFavouriteStoreList = (route, favouriteInfo, action) => {
    Axios.post(route, favouriteInfo)
      .then((res) => {
        manageReducer(favouriteInfo, action, res?.data?.result);
      })
      .catch((error) => {
        setVisible(false);
        // console.log("Error.........+", error);
      });
  };

  const manageReducer = (favouriteInfo, action, response) => {
    if (action === "remove") {
      removeFromReducer({
        merchantType: favouriteInfo?.merchantType,
        mongodbId: favouriteInfo?.mongodbId,
      });
    } else {
      addToReducer({
        merchantType: favouriteInfo?.merchantType,
        favouriteList: response,
      });
    }
    setVisible(false);
  };

  const addToReducer = (Info) => {
    dispatch(
      handleUserChoiceReducer({
        type: "ADD_TO_FAVOURITE_MERCHANT_LIST",
        data: Info,
      })
    );

    toast.success("💖 Added to your Favorites list!", {
      style: {
        border: "1px solid #FC8F1E",
      },
      iconTheme: {
        primary: "#FC8F1E",
        secondary: "#FFFAEE",
      },
    });
  };

  const removeFromReducer = (Info) => {
    dispatch(
      handleUserChoiceReducer({
        type: "REMOVE_FROM_FAVOURITE_MERCHANT_LIST",
        data: Info,
      })
    );

    toast("Removed from your Favorites!", {
      style: {
        border: "1px solid #FC8F1E",
      },
      icon: "🗑️",
      iconTheme: {
        primary: "#FC8F1E",
        secondary: "#FFFAEE",
      },
    });
  };

  const setCurrentModule = () => {
    dispatch(
      handleDashboardReducer({
        type: "SET_CURRENT_MODULE",
        data: "dashboard",
      })
    );
  };

  return {
    visible,
    setCurrentModule,
    addToFavouriteList,
    isAddedToFavouriteList,
    removeFromfavoriteList,
  };
};
