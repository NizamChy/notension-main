import { createSlice } from "@reduxjs/toolkit";

const doctorReducer = createSlice({
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
    handleDoctorReducer: (state = initialState, { payload }) => {
      if (payload.type == "CLEAR_ALL") {
        return {
          ...state,
          allDeptInfo: [],
          currentDept: {},
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
          consultationCenterByDistrict: [],
          deptInfoByConsultationCenter: [],
          nearestConsultationCenterInfo: [],
          diagnosticCenterInfoByDistrict: [],
          doctorsByConsultationCenterByDept: [],
        };
      } else if (payload.type == "SAVE_DEPT_INFO") {
        state.findDoctorBanner =
          payload?.data?.banner[0]?.find_doctor_banner || [];
        state.consultationCenterBanner =
          payload?.data?.banner[0]?.consultation_center_banner || [];
        state.nearestDoctorsSlider =
          payload?.data?.banner[0]?.nearest_doctor_banner || [];
        state.allDeptInfo = payload.data.allDepartments;
        state.popularDoctors = payload.data.popularDoctors;
        state.isLoading = false;
      } else if (payload.type == "SAVE_DOCTOR_INFO_BY_DEPT") {
        let Info = [];
        if (payload?.data?.length > 0) {
          Info = [...state.doctorsByDept, ...payload.data];
        }
        state.doctorsByDept = Info;
      } else if (payload.type == "SAVE_NEAREST_DOCTOR_INFO") {
        let Info = [];
        if (payload?.data?.length > 0) {
          Info = [...state.nearestDoctors, ...payload.data];
        }
        state.nearestDoctors = Info;
      } else if (payload.type == "SAVE_NEAREST_CONSULTATION_CENTER_INFO") {
        let Info = [];
        if (payload?.data?.length > 0) {
          Info = [...state.nearestConsultationCenterInfo, ...payload.data];
        }
        state.nearestConsultationCenterInfo = Info;
      } else if (payload.type == "SAVE_CONSULTATION_CENTER_BY_DISTRICT") {
        let Info = [];
        if (payload?.data?.length > 0) {
          Info = [...state.doctorsByConsultationCenterByDept, ...payload.data];
        }
        state.doctorsByConsultationCenterByDept = Info;
      } else if (payload.type == "SAVE_DEPT_INFO_BY_CONSULTATION_CENTER") {
        state.deptInfoByConsultationCenter = payload.data;
      } else if (payload.type == "SAVE_DOCTOR_INFO_BY_CONSULTATION_CENTER") {
        let Info = [];
        if (payload?.data?.length > 0) {
          Info = [...state.doctorsByDept, ...payload.data];
        }
        state.doctorsByDept = Info;
      } else if (payload.type == "SAVE_NEAREST_DIAGNOSTIC_CENTER") {
        let Info = [];
        if (payload?.data?.length > 0) {
          Info = [...state.nearestDiagnosticCenter, ...payload.data];
        }
        state.nearestDiagnosticCenter = Info;
      } else if (payload.type == "SAVE_DIAGNOSTIC_CENTER_BY_DISTRICT") {
        let Info = [];
        if (payload?.data?.length > 0) {
          Info = [...state.diagnosticCenterInfoByDistrict, ...payload.data];
        }
        state.diagnosticCenterInfoByDistrict = Info;
      } else if (payload.type == "SAVE_NEAREST_HOSPITAL") {
        let Info = [];
        if (payload?.data?.length > 0) {
          Info = [...state.nearestHospitalInfo, ...payload.data];
        }
        state.nearestHospitalInfo = Info;
      } else if (payload.type == "SAVE_TOP_HOSPITAL") {
        let Info = [];
        if (payload?.data?.length > 0) {
          Info = [...state.topHospitalInCountry, ...payload.data];
        }
        state.topHospitalInCountry = Info;
      } else if (payload.type == "SAVE_HOSPITAL_BY_DISTRICT") {
        let Info = [];
        if (payload?.data?.length > 0) {
          Info = [...state.hospitalInfoByDistrict, ...payload.data];
        }
        state.hospitalInfoByDistrict = Info;
      } else if (payload.type == "SAVE_CENTER_INFO") {
        state.currentCenter = payload.data;
      } else if (payload.type == "SAVE_CURRENT_DOCTOR_INFO") {
        state.currentDoctor = payload.data;
      } else if (payload.type == "SAVE_CURRENT_DEPT_INFO") {
        state.currentDept = payload.data;
      } else {
        return {
          ...state,
        };
      }
    },
  },
});

export const { handleDoctorReducer } = doctorReducer.actions;

export default doctorReducer.reducer;
