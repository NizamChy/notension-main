import { createSlice } from "@reduxjs/toolkit";

const allCareReducer = createSlice({
  name: "allCare",

  initialState: {
    careSlider: [],
    allServicesInfo: [],
    popularInfo: [],
    nearestInfo: [],
    isLoading: true,
  },

  reducers: {
    handleAllCareReducer: (state = initialState, { payload }) => {
      if (payload.type == "SAVE_ALL_SERVICES_INFO") {
        state.careSlider = payload?.data?.sliderByDistrict || [];
        state.allServicesInfo = payload?.data?.servicesType || [];
        state.isLoading = false;
      } else if (payload.type == "SAVE_CURRENT_SERVICE_INFO") {
        state.popularInfo = payload?.data?.careProviderByDistrict || [];
        state.nearestInfo = payload?.data?.nearestCareProvider || [];
      } else {
        return {
          ...state,
        };
      }
    },
  },
});

export const { handleAllCareReducer } = allCareReducer.actions;

export default allCareReducer.reducer;
