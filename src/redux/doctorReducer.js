import { createSlice } from "@reduxjs/toolkit";

// Helper function to append data to an array in the state
const appendData = (stateArray, newData) => {
  if (newData?.length > 0) {
    return [...stateArray, ...newData];
  }
  return stateArray;
};

const doctorSlice = createSlice({
  name: "doctorInfo",

  initialState: {
    allDeptInfo: [],
    currentDept: {},
    isLoading: true,
    currentCenter: {},
    currentDoctor: {},
    doctorsByDept: [],
    nearestDoctors: [],
    popularDoctors: [],
    findDoctorBanner: [],
    nearestHospitalInfo: [],
    topHospitalInCountry: [],
    nearestDoctorsSlider: [],
    hospitalInfoByDistrict: [],
    nearestDiagnosticCenter: [],
    consultationCenterBanner: [],
    popularHospitalByDistrict: [],
    deptInfoByConsultationCenter: [],
    consultationCenterByDistrict: [],
    nearestConsultationCenterInfo: [],
    diagnosticCenterInfoByDistrict: [],
    doctorsByConsultationCenterByDept: [],
  },

  reducers: {
    handleDoctorReducer: (state, { payload }) => {
      const { type, data } = payload;

      switch (type) {
        case "CLEAR_ALL":
          return {
            ...initialState,
          };

        case "SAVE_DEPT_INFO":
          state.findDoctorBanner = data?.banner[0]?.find_doctor_banner || [];
          state.consultationCenterBanner =
            data?.banner[0]?.consultation_center_banner || [];
          state.nearestDoctorsSlider =
            data?.banner[0]?.nearest_doctor_banner || [];
          state.allDeptInfo = data.allDepartments;
          state.popularDoctors = data.popularDoctors;
          state.isLoading = false;
          break;

        case "SAVE_DOCTOR_INFO_BY_DEPT":
          state.doctorsByDept = appendData(state.doctorsByDept, data);
          break;

        case "SAVE_NEAREST_DOCTOR_INFO":
          state.nearestDoctors = appendData(state.nearestDoctors, data);
          break;

        case "SAVE_NEAREST_CONSULTATION_CENTER_INFO":
          state.nearestConsultationCenterInfo = appendData(
            state.nearestConsultationCenterInfo,
            data
          );
          break;

        case "SAVE_CONSULTATION_CENTER_BY_DISTRICT":
          state.doctorsByConsultationCenterByDept = appendData(
            state.doctorsByConsultationCenterByDept,
            data
          );
          break;

        case "SAVE_DEPT_INFO_BY_CONSULTATION_CENTER":
          state.deptInfoByConsultationCenter = data;
          break;

        case "SAVE_DOCTOR_INFO_BY_CONSULTATION_CENTER":
          state.doctorsByDept = appendData(state.doctorsByDept, data);
          break;

        case "SAVE_NEAREST_DIAGNOSTIC_CENTER":
          state.nearestDiagnosticCenter = appendData(
            state.nearestDiagnosticCenter,
            data
          );
          break;

        case "SAVE_DIAGNOSTIC_CENTER_BY_DISTRICT":
          state.diagnosticCenterInfoByDistrict = appendData(
            state.diagnosticCenterInfoByDistrict,
            data
          );
          break;

        case "SAVE_NEAREST_HOSPITAL":
          state.nearestHospitalInfo = appendData(
            state.nearestHospitalInfo,
            data
          );
          break;

        case "SAVE_TOP_HOSPITAL":
          state.topHospitalInCountry = appendData(
            state.topHospitalInCountry,
            data
          );
          break;

        case "SAVE_HOSPITAL_BY_DISTRICT":
          state.hospitalInfoByDistrict = appendData(
            state.hospitalInfoByDistrict,
            data
          );
          break;

        case "SAVE_CENTER_INFO":
          state.currentCenter = data;
          break;

        case "SAVE_CURRENT_DOCTOR_INFO":
          state.currentDoctor = data;
          break;

        case "SAVE_CURRENT_DEPT_INFO":
          state.currentDept = data;
          break;

        default:
          // No need to return state, Immer handles it
          break;
      }
    },
  },
});

export const { handleDoctorReducer } = doctorSlice.actions;

export default doctorSlice.reducer;
