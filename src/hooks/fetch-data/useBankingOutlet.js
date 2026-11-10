import { getApiClient } from "@/lib/apiClient";
import { useState } from "react";
import { BASE_ADMIN_URL } from "@env";
import { useSelector } from "react-redux";
import { GET_BANKING_OUTLET } from "@/api-endpoints/api-endpoint";

export const useBankingOutlet = () => {
  const [progressing, setProgressing] = useState(false);
  const [bankingOutletInfo, setBankingOutletInfo] = useState([]);

  const { userLatitude, userLongitude, districtId } = useSelector(
    (state) => state.user
  );

  const Axios = getApiClient(BASE_ADMIN_URL);

  const findNearestBankingOutlet = () => {
    setProgressing(true);

    const props = {
      longitude: userLongitude,
      latitude: userLatitude,
      max_distance: 3000,
      districtId: districtId,
    };

    Axios.post(GET_BANKING_OUTLET, props)
      .then((response) => {
        setBankingOutletInfo(response.data.result);
        setProgressing(false);
      })
      .catch((error) => {
        // console.log("Error : ", error.response.data);
        setProgressing(false);
      });

  };

  return {
    progressing,
    bankingOutletInfo,
    findNearestBankingOutlet,
  };
};
