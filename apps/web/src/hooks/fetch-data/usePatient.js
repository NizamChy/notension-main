import { getApiClient } from "@/lib/apiClient";
import { useRef, useState } from "react";
import notify, { friendlyMessage } from "@/utils/notify";
import {
  GET_PATIENTS,
  MANAGE_PATIENT,
  REGISTER_PATIENT,
} from "@/api-endpoints/api-endpoint";
import { useDispatch, useSelector } from "react-redux";
import { handleUserReducer } from "@/redux/userReducer";
import { HEALTH_CARE_URL } from "@/api-endpoints/env";

export const usePatient = () => {
  const [progressing, setProgressing] = useState(false);
  const requestInFlight = useRef(false);

  const dispatch = useDispatch();
  const { userInfo, patientInfo } = useSelector((state) => state.user);

  const Axios = getApiClient(HEALTH_CARE_URL);

  const registerPatient = (patientData) => {
    // Ignore repeat clicks while the request is still in flight.
    if (requestInFlight.current) return Promise.resolve(false);
    requestInFlight.current = true;
    setProgressing(true);
    patientData.createdBy = {
      user_id: userInfo?._id,
      user: userInfo?.contact_no?.slice(-11),
      user_type: "Customer",
    };

    // Resolves to true when the patient was registered.
    return Axios.post(REGISTER_PATIENT, patientData)
      .finally(() => {
        requestInFlight.current = false;
      })
      .then((response) => {
        if (response?.data?.success) {
          notify.success(
            friendlyMessage(response?.data?.message, "Patient added")
          );
        }

        savePatientInfo("add", response?.data?.result);

        setProgressing(false);
        return Boolean(response?.data?.success);
      })
      .catch(() => {
        setProgressing(false);
        return false;
      });

  };

  const updatePatientProfile = (patientData) => {
    let updInfo = patientData;
    setProgressing(true);
    patientData.updatedBy = {
      user_id: userInfo?._id,
      user: userInfo?.contact_no?.slice(-11),
      user_type: "Customer",
    };

    Axios.put(MANAGE_PATIENT, patientData)
      .then((response) => {
        if (response?.data?.message === "delete") {
          savePatientInfo("delete", updInfo); // First delete existing data

          setTimeout(() => {
            savePatientInfo("add", response?.data?.result); // Then Save New One
          }, 500);
        } else if (response?.data?.message === "update") {
          savePatientInfo("update", updInfo);
        }

        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
      });

  };

  // Loads the account's patients. The list already in the store (persisted)
  // stays until the server answers with its own, so the demo backend, which
  // forgets patients on reload, doesn't wipe them.
  const getPatientInfo = () => {
    if (!userInfo?._id) return;
    setProgressing(true);
    Axios.get(GET_PATIENTS, {
      params: {
        userId: userInfo?._id,
        contact: userInfo?.contact_no?.slice(-11),
      },
    })
      .then((res) => {
        if (res?.data?.result?.length > 0) {
          savePatientInfo("save_all", res?.data?.result);
        }
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
      });

  };

  const savePatientInfo = (task, patientInfo) => {
    if (task === "save_all") {
      dispatch(
        handleUserReducer({
          type: "SAVE_PATIENT_INFO",
          data: patientInfo,
        })
      );
    } else {
      dispatch(
        handleUserReducer({
          type: "UPDATE_PATIENT_INFO",
          data: { action: task, patientData: patientInfo },
        })
      );
    }
  };

  return {
    progressing,
    getPatientInfo,
    setProgressing,
    registerPatient,
    updatePatientProfile,
  };
};
