import { createSlice } from "@reduxjs/toolkit";

const allCareSlice = createSlice({
  name: "allCare",

  initialState: {
    careSlider: [],
    isLoading: true,
    currentService: {},
    allServicesInfo: [],
    currentProviderDetails: {},
  },

  reducers: {
    handleAllCareReducer: (state, { payload }) => {
      const { type, data } = payload;

      switch (type) {
        case "SAVE_ALL_SERVICES_INFO":
          state.careSlider = data?.sliderByDistrict || [];
          state.allServicesInfo = data?.servicesType || [];
          state.isLoading = false;
          break;

        case "SAVE_CURRENT_SERVICE_INFO":
          state.currentService = data || {};
          break;

        case "SAVE_CURRENT_PROVIDER_DETAILS":
          state.currentProviderDetails = data || {};
          break;

        default:
          // No need to return the state, as Immer handles it
          break;
      }
    },
  },
});

export const { handleAllCareReducer } = allCareSlice.actions;

export default allCareSlice.reducer;
