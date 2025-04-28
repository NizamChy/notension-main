import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { handleUserReducer } from "@/redux/userReducer";
import { HEALTH_CARE_URL } from "@/api-endpoints/secret";
import { BOOK_APPOINTMENT } from "@/api-endpoints/api-endpoint";

axios.defaults.withCredentials = true;

export const useAppointment = () => {
  const [message, setMessage] = useState("");
  const [progressing, setProgressing] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAppointmentBooked, setIsAppointmentBooked] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const { userInfo, patientInfo } = useSelector((state) => state.user);

  const Axios = axios.create({
    baseURL: HEALTH_CARE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const bookAppointment = (bookAppoinmentData) => {
    setProgressing(true);
    const {
      doctor_name,
      doctor_speciality,
      consultation_center_name,
      appointment_day,
      ...bookAppoinmentInfo
    } = bookAppoinmentData;

    bookAppoinmentInfo.createdBy = {
      user_id: userInfo?._id,
      user: userInfo?.contact_no.slice(-11),
      user_type: "Customer",
    };

    Axios.post(BOOK_APPOINTMENT, bookAppoinmentInfo)
      .then((response) => {
        // console.log("response : ", response);

        if (response?.data?.success) {
          setShowSuccessMessage(true);

          toast.success(`${response?.data?.message}`, {
            style: {
              border: "1px solid #FC8F1E",
            },
            iconTheme: {
              primary: "#FC8F1E",
              secondary: "#FFFAEE",
            },

            duration: 4000,
          });

          saveAppoinmentInfo("add", {
            ...response?.data?.result,
            ...bookAppoinmentData,
          });

          router.push("/medical-services/doctor/booked-appointment");
        } else {
          setShowErrorMessage(true);

          toast(`${response?.data?.message}`, {
            style: {
              border: "1px solid #FC8F1E",
            },
            icon: "ℹ️",
            iconTheme: {
              primary: "#FC8F1E",
              secondary: "#FFFAEE",
            },
          });
        }
        setIsAppointmentBooked(response?.data?.isBooked);
        setMessage(response?.data?.message);

        setProgressing(false);
      })
      .catch((error) => {
        // console.log("Error :: ", error?.response?.data);
        setProgressing(false);
        toast.error("কিছু একটা ভুল হয়েছে! পরে আবার চেষ্টা করুন!");
      });

    setTimeout(() => {
      if (progressing) {
        setProgressing(false);
      }
    }, 10000);
  };

  const saveAppoinmentInfo = (task, bookAppoinmentData) => {
    dispatch(
      handleUserReducer({
        type: "UPDATE_BOOKED_APPOINTMENT_INFO",
        data: { action: task, appoinmentData: bookAppoinmentData },
      })
    );
  };

  return {
    message,
    progressing,
    showErrorMessage,
    showSuccessMessage,
    isAppointmentBooked,
    setShowSuccessMessage,
    setShowErrorMessage,
    saveAppoinmentInfo,
    bookAppointment,
    setProgressing,
  };
};
