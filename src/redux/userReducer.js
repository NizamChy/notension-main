import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  apiKey: "",
  userPin: "",
  userInfo: {},
  allAddress: [],
  patientInfo: [],
  districtInfo: [],
  districtId: "00",
  foodOrderInfo: [],
  isLoggedin: false,
  fireBaseToken: "",
  userLatitude: "00",
  setManually: false,
  userLongitude: "00",
  deliveryAddress: "",
  groceryOrderInfo: [],
  medicineOrderInfo: [],
  deliveryLocations: [],
  defaultUserLocation: {},
  currentUserLocation: {},
  bookedAppoinmentInfo: [],
  setCurrentLocation: false,
  setDefaultLocation: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleUserReducer: (state, { payload }) => {
      const { type, data } = payload;

      switch (type) {
        case "SAVE_USER_INFO":
          return {
            ...state,
            setManually: false,
            userLatitude: data.userLatitude,
            userLongitude: data.userLongitude,
            isLoggedin: data.isLoggedin,
            deliveryAddress: data.deliveryAddress,
            allAddress: data.allAddress,
            fireBaseToken: data.fireBaseToken,
            apiKey: data.apiKey,
            userPin: data.userPin,
            default_outlet_id: data.default_outlet_id,
            default_outlet_name: data.default_outlet_name,
            default_outlet_address: data.default_outlet_address,
          };

        case "SAVE_CURRENT_GEOLOCATION":
          return {
            ...state,
            isUserLocationAvailable: true,
            userLatitude: data.latitude,
            userLongitude: data.longitude,
          };

        case "SAVE_DISTRICT_INFO":
          state.districtInfo = data || [];
          break;

        case "SAVE_DEFAULT_LOCATION":
          state.groceryOrderInfo = data;
          break;

        case "SAVE_CURRENT_LOCATION":
          state.currentUserLocation = data;
          break;

        case "SAVE_API_KEY":
          return {
            ...state,
            existing_outlet_id: data.existing_outlet_id,
            outlet_id: data.outlet_id,
            outlet_name: data.outlet_name,
            outlet_address: data.outlet_address,
          };

        case "SAVE_LOGGEDIN_INFO":
          state.isLoggedin = true;
          state.userInfo = data;
          break;

        case "LOGOUT_USER":
          state.isLoggedin = false;
          state.userInfo = data;
          break;

        case "SAVE_USER_CURRENT_LOCATION":
          state.currentUserLocation = data;
          state.setCurrentLocation = data?.setCurrentLocation;
          state.userLatitude = data?.userLatitude || "00";
          state.userLongitude = data?.userLongitude || "00";
          state.districtId = data?.districtId || "00";
          break;

        case "SAVE_USER_DEFAULT_LOCATION":
          state.defaultUserLocation = data;
          state.userLatitude = data?.userLatitude;
          state.userLongitude = data?.userLongitude;
          state.districtId = data?.districtId;
          break;

        case "SAVE_GROCERY_ORDER_INFO":
          state.groceryOrderInfo = data;
          break;

        case "SAVE_MEDICINE_ORDER_INFO":
          state.medicineOrderInfo = data;
          break;

        case "SAVE_FOOD_ORDER_INFO":
          state.foodOrderInfo = data;
          break;

        case "SAVE_PATIENT_INFO":
          state.patientInfo = data;
          break;

        case "UPDATE_PATIENT_INFO": {
          const { action, patientData } = data;
          let updatedPatientInfo = [...state.patientInfo];

          const existingIndex = updatedPatientInfo.findIndex(
            (info) => info?._id === patientData?._id
          );

          if (existingIndex > -1) {
            if (action === "delete") {
              updatedPatientInfo = updatedPatientInfo.filter(
                (info) => info?._id !== patientData?._id
              );
            } else if (action === "update") {
              updatedPatientInfo[existingIndex] = patientData;
            }
          } else if (action === "add") {
            updatedPatientInfo = [...updatedPatientInfo, patientData];
          }

          state.patientInfo = updatedPatientInfo;
          break;
        }

        case "UPDATE_BOOKED_APPOINTMENT_INFO": {
          const { action, appoinmentData } = data;
          let updatedAppointments = [...state.bookedAppoinmentInfo];

          if (action === "delete") {
            updatedAppointments = updatedAppointments.filter(
              (info) => info?._id !== appoinmentData?._id
            );
          } else if (action === "add") {
            updatedAppointments = [...updatedAppointments, appoinmentData];
          } else if (action === "update") {
            const currentDate = new Date().toISOString().split("T")[0];
            updatedAppointments = updatedAppointments.filter(
              (info) =>
                new Date(info?.appointment_date).getTime() >=
                new Date(currentDate).getTime()
            );
          }

          state.bookedAppoinmentInfo = updatedAppointments;
          break;
        }

        case "RESET_USER_LOCATION":
          state.setCurrentLocation = false;
          state.setDefaultLocation = true;
          state.defaultUserLocation = {};
          state.currentUserLocation = {};
          state.userLatitude = "00";
          state.userLongitude = "00";
          state.districtId = "00";
          break;

        case "RESET_USER_CURRENT_LOCATION":
          state.setCurrentLocation = true;
          state.setDefaultLocation = false;
          state.currentUserLocation = {};
          break;

        case "RESET_USER":
          return {
            ...initialState,
          };

        default:
          break;
      }
    },
  },
});

export const { handleUserReducer } = userSlice.actions;

export default userSlice.reducer;
