import { getApiClient } from "@/lib/apiClient";
import {
  SEARCH_CONSULTATION_CENTER,
  EXPLORE_CONSULTATION_CENTER,
  NEAREST_CONSULTATION_CENTER,
  CONSULTATION_CENTER_BY_DISTRICT,
} from "@/api-endpoints/api-endpoint";
import { useState } from "react";
import { useSelector } from "react-redux";
import { HEALTH_CARE_URL } from "@/api-endpoints/env";

export const useCenter = () => {
  const [banner, setBanner] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(true);
  const [progressing, setProgressing] = useState(false);
  const [itemNotfound, setItemNotfound] = useState(false);

  const { consultationCenterBanner } = useSelector((state) => state.doctorInfo);
  const { userLatitude, userLongitude, districtId } = useSelector(
    (state) => state.user
  );

  const Axios = getApiClient(HEALTH_CARE_URL);

  const getNearestCenterInfo = (centerType, setCenterInfo) => {
    setProgressing(true);

    const props = {
      longitude: userLongitude,
      latitude: userLatitude,
      districtId: districtId,
      centerType: centerType, // 'Hospital' 'Diagnostic Centre' "Eye Care Centre" "Deltal Care Centre"
    };

    Axios.post(NEAREST_CONSULTATION_CENTER, props)
      .then((response) => {
        setCenterInfo(response.data.result);
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
      });

  };

  const getCenterInfoByDistrict = (
    centerType,
    setCenterInfo,
    pageNo,
    setPageNo
  ) => {
    // if (pageNo === 1) {
    //   setProgressing(true);
    // }
    setProgressing(true);
    setLoadingMore(true);

    const props = {
      page: pageNo,
      centerType: centerType,
      districtId: districtId,
    };


    Axios.post(CONSULTATION_CENTER_BY_DISTRICT, props)
      .then((response) => {

        if (response?.data?.result?.consultationCenterInfo.length > 0) {
          setProgressing(false);
          setPageNo(pageNo + 1);
          setCenterInfo((prevInfo) => [
            ...prevInfo,
            ...response?.data?.result?.consultationCenterInfo,
          ]);
        }

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
            } else if (centerType === "Diagnostic Centre") {
              setBanner(
                response?.data?.result?.banners[0]?.diagnostic_center_banner
              );
            } else if (centerType === "Eye Care Centre") {
              setBanner(
                response?.data?.result?.banners[0]?.eye_care_center_banner
              );
            } else if (centerType === "Deltal Care Centre") {
              setBanner(
                response?.data?.result?.banners[0]?.deltal_care_center_banner
              );
            }
          } else {
            setBanner(consultationCenterBanner);
          }
        }

        if (response?.data?.result?.consultationCenterInfo.length < 20) {
          setAllLoaded(true);
          setLoadingMore(false);
        }

        // setProgressing(false);
        // setLoadingMore(false);
      })
      .catch((error) => {
        setProgressing(false);
        setAllLoaded(true);
      });

  };

  const searchConsultationCenter = (centerType, searchText, setCenterInfo) => {
    if (searchText.length > 1) {
      setProgressing(true);
      const props = {
        centerType: centerType,
        search: searchText,
      };
      Axios.post(SEARCH_CONSULTATION_CENTER, props)
        .then((res) => {
          setCenterInfo(res.data.result);
          setProgressing(false);
        })
        .catch((error) => {
          setProgressing(false);
        });

    }
  };

  const exploreConsultationCenter = (centerInfo, setExploreInfo) => {

    setProgressing(true);
    Axios.get(EXPLORE_CONSULTATION_CENTER, {
      params: {
        CenterID: centerInfo?._id,
        centerType: centerInfo?.center_type,
      },
    })
      .then((res) => {
        setExploreInfo(res?.data?.result);
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
      });
  };

  return {
    itemNotfound,
    loadingMore,
    progressing,
    allLoaded,
    banner,
    setLoadingMore,
    setProgressing,
    getNearestCenterInfo,
    getCenterInfoByDistrict,
    searchConsultationCenter,
    exploreConsultationCenter,
  };
};
