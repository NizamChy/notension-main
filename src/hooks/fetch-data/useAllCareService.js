import { getApiClient } from "@/lib/apiClient";
import { useState } from "react";
import {
  EXPLORE_CARE_PROVIDER,
  EXPLORE_ALL_CARE_SERVICE,
} from "@/api-endpoints/api-endpoint";
import { useDispatch, useSelector } from "react-redux";
import { handleAllCareReducer } from "@/redux/allCareReducer";
import { ALL_CARE_SERVICE_URL } from "@/api-endpoints/env";
import { handleDashboardReducer } from "@/redux/dashboardReducer";

export const useAllCareService = () => {
  const [allLoaded, setAllLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(true);
  const [progressing, setProgressing] = useState(false);
  const [itemNotfound, setItemNotfound] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const dispatch = useDispatch();

  const { userLatitude, userLongitude, districtId } = useSelector(
    (state) => state.user
  );

  const Axios = getApiClient(ALL_CARE_SERVICE_URL);

  const setCurrentModule = () => {
    dispatch(
      handleDashboardReducer({
        type: "SET_CURRENT_MODULE",
        data: "dashboard",
      })
    );
  };

  const exploreAllCareService = () => {
    setCurrentModule();
    setProgressing(true);

    Axios.get(EXPLORE_ALL_CARE_SERVICE, {
      params: {
        district_id: districtId,
      },
    })
      .then((res) => {
        dispatch(
          handleAllCareReducer({
            type: "SAVE_ALL_SERVICES_INFO",
            data: res?.data?.result,
          })
        );

        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
      });
  };

  const exploreCareProvider = (
    serviceId,
    setPopularInfo,
    setNearestInfo,
    pageNo
  ) => {
    setProgressing(true);

    const props = {
      longitude: userLongitude,
      latitude: userLatitude,
      district_id: districtId,
      service_id: serviceId,
      page: pageNo,
    };

    Axios.post(EXPLORE_CARE_PROVIDER, props)
      .then((response) => {

        if (response?.data?.result?.nearestCareProvider) {
          setPopularInfo(response?.data?.result?.careProviderByDistrict);
        }

        if (response?.data?.result?.nearestCareProvider) {
          setNearestInfo(response?.data?.result?.nearestCareProvider);
        }
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
      });
  };

  return {
    showErrorMessage,
    itemNotfound,
    progressing,
    loadingMore,
    allLoaded,
    setLoadingMore,
    setProgressing,
    setShowErrorMessage,
    exploreCareProvider,
    exploreAllCareService,
  };
};
