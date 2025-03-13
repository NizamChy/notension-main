import axios from "axios";
import { useState } from "react";
import {
  GET_DOCTOR_PROFILE,
  EXPLORE_FIND_DOCTOR,
  FIND_NEAREST_DOCTOR,
  FIND_DOCTOR_BY_DEPT,
  FIND_DOCTOR_BY_CONSULTATION_CENTER,
} from "@/api-endpoints/api-endpoint";
import { useDispatch, useSelector } from "react-redux";
import { HEALTH_CARE_URL } from "@/api-endpoints/secret";
import { handleDoctorReducer } from "@/redux/doctorReducer";

axios.defaults.withCredentials = true;

export const useDoctor = () => {
  const [allLoaded, setAllLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(true);
  const [progressing, setProgressing] = useState(false);
  const [itemNotfound, setItemNotfound] = useState(false);

  const dispatch = useDispatch();
  const { userLatitude, userLongitude, districtId } = useSelector(
    (state) => state.user
  );

  const Axios = axios.create({
    baseURL: HEALTH_CARE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const setCurrentModule = () => {
    dispatch(
      handleDashboardReducer({
        type: "SET_CURRENT_MODULE",
        data: "dashboard",
      })
    );
  };

  const exploreFindDoctor = () => {
    //console.log('exploreFindDoctor');
    // resetReducer();
    setProgressing(true);
    Axios.get(EXPLORE_FIND_DOCTOR, {
      params: {
        district_id: districtId,
      },
    })
      .then((res) => {
        dispatch(
          handleDoctorReducer({
            type: "SAVE_DEPT_INFO",
            data: res?.data?.result,
          })
        );
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
        // console.log(error);
      });
  };

  const getNearestDoctorsInfo = (setDoctorsInfo) => {
    setProgressing(true);
    const props = {
      longitude: userLongitude,
      latitude: userLatitude,
      districtId: districtId,
    };

    Axios.post(FIND_NEAREST_DOCTOR, props)
      .then((response) => {
        //console.log(response.data);
        setDoctorsInfo(response.data.result);
        setProgressing(false);
        setAllLoaded(true);
      })
      .catch((error) => {
        // console.log("Error : ", error.response.data);
        setProgressing(false);
        setAllLoaded(true);
      });
    setTimeout(() => {
      if (progressing) {
        setProgressing(false);
        setAllLoaded(true);
      }
    }, 10000);
  };

  const getDoctorsInfoByDistrict = (
    deptId,
    setDoctorsInfo,
    pageNo,
    setPageNo
  ) => {
    setProgressing(true);
    setLoadingMore(true);

    const props = {
      page: pageNo,
      deptId: deptId,
      districtId: districtId,
    };

    Axios.post(FIND_DOCTOR_BY_DEPT, props)
      .then((response) => {
        if (response?.data?.result.length > 0) {
          setProgressing(false);
          setPageNo(pageNo + 1);
          setDoctorsInfo((prevInfo) => [
            ...prevInfo,
            ...response?.data?.result,
          ]);
        }

        if (pageNo === 1 && response?.data?.result.length < 1) {
          setItemNotfound(true);
        }

        if (response?.data?.result.length < 20) {
          setAllLoaded(true);
          setLoadingMore(false);
        }
      })
      .catch((error) => {
        // console.log("Error : ", error.response.data);
        setProgressing(false);
        setAllLoaded(true);
      });
  };

  const getDoctorsInfoByCenter = (
    centerId,
    deptId,
    setDoctorsInfo,
    pageNo,
    setPageNo
  ) => {
    setProgressing(true);
    setLoadingMore(true);

    const props = {
      page: pageNo,
      deptId: deptId,
      centerId: centerId,
    };

    Axios.post(FIND_DOCTOR_BY_CONSULTATION_CENTER, props)
      .then((response) => {
        if (response?.data?.result.length > 0) {
          setProgressing(false);
          setPageNo(pageNo + 1);
          setDoctorsInfo((prevInfo) => [
            ...prevInfo,
            ...response?.data?.result,
          ]);
        }

        // console.log("response?.data?.result: ", response?.data?.result);

        if (pageNo === 1 && response?.data?.result.length < 1) {
          setItemNotfound(true);
        }

        if (response?.data?.result.length < 20) {
          setAllLoaded(true);
          setLoadingMore(false);
        }
      })
      .catch((error) => {
        // console.log("Error : ", error.response.data);
        setProgressing(false);
        setAllLoaded(true);
      });
  };

  const getProfileOfDoctor = (doctorId, setProfileInfo) => {
    setProgressing(true);
    Axios.get(GET_DOCTOR_PROFILE, {
      params: {
        doctorId: doctorId,
      },
    })
      .then((res) => {
        //console.log(res?.data?.result.length);
        setProfileInfo(res?.data?.result);
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
        // console.log(error);
      });
  };

  return {
    itemNotfound,
    loadingMore,
    progressing,
    allLoaded,
    setLoadingMore,
    setProgressing,
    exploreFindDoctor,
    getProfileOfDoctor,
    getNearestDoctorsInfo,
    getDoctorsInfoByCenter,
    getDoctorsInfoByDistrict,
  };
};
