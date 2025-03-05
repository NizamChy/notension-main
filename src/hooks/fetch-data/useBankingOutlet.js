import axios from "axios";
import { useState } from "react";
import { BASE_ADMIN_URL } from "@env";
import { useSelector } from "react-redux";
import { GET_BANKING_OUTLET } from "../../../helpers/Constants";

axios.defaults.withCredentials = true;

export const useBankingOutlet = () => {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [progressing, setProgressing] = useState(false);
  const [bankingOutletInfo, setBankingOutletInfo] = useState([]);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { userLatitude, userLongitude, districtId } = useSelector(
    (state) => state.user
  );

  const Axios = axios.create({
    baseURL: BASE_ADMIN_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

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
        console.log("Error : ", error.response.data);
        setProgressing(false);
      });
    setTimeout(() => {
      if (progressing) {
        setProgressing(false);
      }
    }, 10000);
  };

  //   useEffect(() => {
  //     if (error) {
  //       //userLogOut();
  //     }
  //   }, [error]);

  return {
    progressing,
    bankingOutletInfo,
    findNearestBankingOutlet,
  };
};
