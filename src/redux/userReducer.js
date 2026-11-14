import { createSlice } from "@reduxjs/toolkit";
import { toLocalYMD } from "@/utils/date";

const initialState = {
  userInfo: {},
  allAddress: [],
  patientInfo: [],
  districtId: "00",
  foodOrderInfo: [],
  isLoggedin: false,
  userLatitude: "00",
  userLongitude: "00",
  deliveryAddress: "",
  groceryOrderInfo: [],
  medicineOrderInfo: [],
  currentUserLocation: {},
  bookedAppoinmentInfo: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleUserReducer: (state, { payload }) => {
      const { type, data } = payload;

      switch (type) {
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
          state.userLatitude = data?.userLatitude || "00";
          state.userLongitude = data?.userLongitude || "00";
          state.districtId = data?.districtId || "00";
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
            const currentDate = toLocalYMD();
            updatedAppointments = updatedAppointments.filter(
              (info) =>
                new Date(info?.appointment_date).getTime() >=
                new Date(currentDate).getTime()
            );
          }

          state.bookedAppoinmentInfo = updatedAppointments;
          break;
        }

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
