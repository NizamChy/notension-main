import { useSessionStore } from "@/stores/sessionStore";
import { getApiClient } from "@/lib/apiClient";
import { useRef, useState } from "react";
import notify, { GENERIC_ERROR, friendlyMessage } from "@/utils/notify";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { handleUserReducer } from "@/redux/userReducer";
import { HEALTH_CARE_URL } from "@/api-endpoints/env";
import { BOOK_APPOINTMENT } from "@/api-endpoints/api-endpoint";

export const useAppointment = () => {
  const [message, setMessage] = useState("");
  const [progressing, setProgressing] = useState(false);
  const requestInFlight = useRef(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAppointmentBooked, setIsAppointmentBooked] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const userInfo = useSessionStore((s) => s.userInfo);
  const { patientInfo } = useSelector((state) => state.user);

  const Axios = getApiClient(HEALTH_CARE_URL);

  const bookAppointment = (appointmentData) => {
    // Ignore repeat clicks while the request is still in flight.
    if (requestInFlight.current) return Promise.resolve(false);
    requestInFlight.current = true;
    setProgressing(true);
    const {
      doctor_name,
      doctor_speciality,
      consultation_center_name,
      appointment_day,
      ...appointmentInfo
    } = appointmentData;

    appointmentInfo.createdBy = {
      user_id: userInfo?._id,
      user: userInfo?.contact_no?.slice(-11),
      user_type: "Customer",
    };

    // Resolves to true when the appointment was booked.
    return Axios.post(BOOK_APPOINTMENT, appointmentInfo)
      .finally(() => {
        requestInFlight.current = false;
      })
      .then((response) => {

        if (response?.data?.success) {
          setShowSuccessMessage(true);

          notify.success(
            friendlyMessage(response?.data?.message, "Appointment booked")
          );

          saveAppoinmentInfo("add", {
            ...response?.data?.result,
            ...appointmentData,
          });

          router.push("/medical-services/doctor/booked-appointment");
        } else {
          setShowErrorMessage(true);

          notify.info(
            friendlyMessage(
              response?.data?.message,
              "We couldn't book this appointment. Please try another time slot."
            )
          );
        }
        setIsAppointmentBooked(response?.data?.isBooked);
        setMessage(response?.data?.message);

        setProgressing(false);
        return Boolean(response?.data?.success);
      })
      .catch((error) => {
        setProgressing(false);
        notify.error(GENERIC_ERROR);
        return false;
      });

  };

  const saveAppoinmentInfo = (task, appointmentData) => {
    dispatch(
      handleUserReducer({
        type: "UPDATE_BOOKED_APPOINTMENT_INFO",
        data: { action: task, appoinmentData: appointmentData },
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
