import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleUserReducer } from "@/redux/userReducer";
import { HEALTH_CARE_URL } from "@/api-endpoints/secret";
import { BOOK_APPOINTMENT } from "@/api-endpoints/api-endpoint";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

export const useAppointment = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [allLoaded, setAllLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(true);
  const [progressing, setProgressing] = useState(false);
  const [itemNotfound, setItemNotfound] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAppointmentBooked, setIsAppointmentBooked] = useState(false);
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);

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

    //console.log(patientData);

    Axios.post(BOOK_APPOINTMENT, bookAppoinmentInfo)
      .then((response) => {
        console.log("response : ", response);

        if (response?.data?.success) {
          setShowSuccessMessage(true);

          toast.success(`${response?.data?.message}`, {
            position: "top-center",
          });

          saveAppoinmentInfo("add", {
            ...response?.data?.result,
            ...bookAppoinmentData,
          });
          // navigation.navigate('BookedAppointmentInfo');
        } else {
          setShowErrorMessage(true);

          toast.error(`${response?.data?.message}`, {
            position: "top-center",
          });

          //navigation.navigate('BookedAppointmentInfo');
        }
        setIsAppointmentBooked(response?.data?.isBooked);
        setMessage(response?.data?.message);

        //navigation.goBack();
        setProgressing(false);
      })
      .catch((error) => {
        console.log("Error :: ", error?.response?.data);
        setProgressing(false);
        alert("কিছু একটা ভুল হয়েছে! পরে আবার চেষ্টা করুন!");
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

  //   useEffect(() => {
  //     if (error) {
  //       //userLogOut();
  //     }
  //   }, [error]);

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
