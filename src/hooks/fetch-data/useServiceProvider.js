import axios from "axios";
import {
  EXPLORE_CONSULTATION_CENTER,
  NEAREST_CONSULTATION_CENTER,
  FIND_MEDICAL_SERVICE_PROVIDER,
  CONSULTATION_CENTER_BY_DISTRICT,
  EXPLORE_MEDICAL_SERVICE_PROVIDER,
} from "@/api-endpoints/api-endpoint";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HEALTH_CARE_URL } from "@/api-endpoints/secret";
import { handleDoctorReducer } from "@/redux/doctorReducer";

axios.defaults.withCredentials = true;

export const useServiceProvider = () => {
  const [banner, setBanner] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [allLoaded, setAllLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(true);
  const [progressing, setProgressing] = useState(false);
  const [itemNotfound, setItemNotfound] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showActivityIndicator, setShowActivityIndicator] = useState(false);

  const dispatch = useDispatch();

  const { consultationCenterBanner } = useSelector((state) => state.doctorInfo);
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

  // const AxiosTest = axios.create({
  //   baseURL: HEALTH_CARE_URL_LOCAL,
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  // });

  const exploreMedicalServiceProvider = (setProviderBanner) => {
    setProgressing(true);
    Axios.get(EXPLORE_MEDICAL_SERVICE_PROVIDER, {
      params: {
        district_id: districtId,
      },
    })
      .then((res) => {
        setProviderBanner(res?.data?.result[0]?.medical_service_banner);
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
        console.log(error);
      });
    setTimeout(() => {
      if (progressing) {
        setProgressing(false);
      }
    }, 10000);
  };

  const getMedicalServiceProvider = (serviceType, setProviderInfo) => {
    setProgressing(true);
    Axios.get(FIND_MEDICAL_SERVICE_PROVIDER, {
      params: {
        district_id: districtId,
        serviceType: serviceType,
      },
    })
      .then((res) => {
        //console.log(res?.data?.result?.length);
        if (res?.data?.result?.length < 1) {
          setMessage("This Service not available in your region!!");
        } else {
          setMessage("Please update or remove and reinstall App!!");
        }
        setShowSuccessMessage(true);
        //setProviderBanner(res?.data?.result[0]?.medical_service_banner);
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
        console.log(error);
      });
    setTimeout(() => {
      if (progressing) {
        setProgressing(false);
      }
    }, 10000);
  };

  const getNearestCenterInfo = (centerType, setCenterInfo) => {
    setProgressing(true);
    const props = {
      longitude: userLongitude,
      latitude: userLatitude,
      districtId: districtId,
      centerType: centerType, ////'Hospital' 'Diagnostic Centre'
    };

    Axios.post(NEAREST_CONSULTATION_CENTER, props)
      .then((response) => {
        //console.log(response.data);
        setCenterInfo(response.data.result);
        setProgressing(false);
      })
      .catch((error) => {
        console.log("Error : ", error.response.data);
        setProgressing(false);
      });
    setTimeout(() => {
      if (progressing) {
        setProgressing(false);
      }
    }, 10000);
  };

  const getCenterInfoByDistrict = (
    centerType,
    setCenterInfo,
    pageNo,
    setPageNo
  ) => {
    if (pageNo === 1) {
      setProgressing(true);
    }
    //setProgressing(true);
    const props = {
      page: pageNo,
      centerType: centerType,
      districtId: districtId,
    };

    Axios.post(CONSULTATION_CENTER_BY_DISTRICT, props)
      .then((response) => {
        if (response?.data?.result?.consultationCenterInfo.length > 0) {
          setPageNo(pageNo + 1);
          setCenterInfo((prevInfo) => [
            ...prevInfo,
            ...response?.data?.result?.consultationCenterInfo,
          ]);
        }

        if (response?.data?.result?.consultationCenterInfo.length < 20) {
          setAllLoaded(true);
        }

        //console.log('response?.data?.result?.consultationCenterInfo.length : ', response?.data?.result?.consultationCenterInfo.length);
        if (
          pageNo === 1 &&
          response?.data?.result?.consultationCenterInfo.length < 1
        ) {
          setItemNotfound(true);
        }

        if (pageNo === 1) {
          if (response?.data?.result?.banners.length > 0) {
            if (centerType === "Hospital") {
              setBanner(response?.data?.result?.banners[0]?.hospital_banner);
            } else {
              setBanner(
                response?.data?.result?.banners[0]?.diagnostic_center_banner
              );
            }
          } else {
            setBanner(consultationCenterBanner);
          }
        }
        setProgressing(false);
        setLoadingMore(false);
      })
      .catch((error) => {
        console.log("Error : ", error.response.data);
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

  const exploreConsultationCenter = (centerInfo, setExploreInfo) => {
    dispatch(
      handleDoctorReducer({
        type: "SAVE_CENTER_INFO",
        data: centerInfo,
      })
    );
    setProgressing(true);
    Axios.get(EXPLORE_CONSULTATION_CENTER, {
      params: {
        CenterID: centerInfo?._id,
      },
    })
      .then((res) => {
        setExploreInfo(res?.data?.result);
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
        console.log(error);
      });
    setTimeout(() => {
      if (progressing) {
        setProgressing(false);
      }
    }, 10000);
  };

  // useEffect(() => {
  //   if (error) {
  //     //userLogOut();
  //   }
  // }, [error]);

  return {
    showActivityIndicator,
    showSuccessMessage,
    showErrorMessage,
    itemNotfound,
    loadingMore,
    progressing,
    allLoaded,
    message,
    banner,
    setProgressing,
    setLoadingMore,
    setShowErrorMessage,
    getNearestCenterInfo,
    setShowSuccessMessage,
    getCenterInfoByDistrict,
    exploreConsultationCenter,
    getMedicalServiceProvider,
    exploreMedicalServiceProvider,
    // getNearestGroceryStoreInfo,
    // resetLoadingStatus,
    // saveItemsToReducer,
    // handleSearchStore,
    // setCurrentModule
    // resetReducer,
  };
};
