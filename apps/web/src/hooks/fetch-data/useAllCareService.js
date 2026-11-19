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

  // Fetches services and sliders for the current district. Returns a cancel
  // function so a response for a district the user already left is ignored.
  const exploreAllCareService = () => {
    let cancelled = false;
    const requestedDistrictId = districtId;

    setCurrentModule();
    setProgressing(true);
    dispatch(
      handleAllCareReducer({
        type: "START_FETCH_ALL_SERVICES",
        data: { districtId: requestedDistrictId },
      })
    );

    Axios.get(EXPLORE_ALL_CARE_SERVICE, {
      params: {
        district_id: requestedDistrictId,
      },
    })
      .then((res) => {
        if (cancelled) return;
        dispatch(
          handleAllCareReducer({
            type: "SAVE_ALL_SERVICES_INFO",
            data: { ...res?.data?.result, districtId: requestedDistrictId },
          })
        );

        setProgressing(false);
      })
      .catch(() => {
        if (cancelled) return;
        dispatch(handleAllCareReducer({ type: "FETCH_ALL_SERVICES_FAILED" }));
        setProgressing(false);
      });

    return () => {
      cancelled = true;
    };
  };

  // Returns a cancel function, like exploreAllCareService.
  const exploreCareProvider = (
    serviceId,
    setPopularInfo,
    setNearestInfo,
    pageNo
  ) => {
    let cancelled = false;
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
        if (cancelled) return;
        setPopularInfo(response?.data?.result?.careProviderByDistrict || []);
        setNearestInfo(response?.data?.result?.nearestCareProvider || []);
        setProgressing(false);
      })
      .catch(() => {
        if (cancelled) return;
        setPopularInfo([]);
        setNearestInfo([]);
        setProgressing(false);
      });

    return () => {
      cancelled = true;
    };
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
