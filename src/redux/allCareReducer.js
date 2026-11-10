import { createSlice } from "@reduxjs/toolkit";

const allCareSlice = createSlice({
  name: "allCare",

  initialState: {
    careSlider: [],
    isLoading: true,
    currentService: {},
    allServicesInfo: [],
    // District the services/sliders above were fetched for. The slice is
    // persisted, so this tells the home page whether the saved data still
    // matches the user's current location.
    servicesDistrictId: null,
    currentProviderDetails: {},
  },

  reducers: {
    handleAllCareReducer: (state, { payload }) => {
      const { type, data } = payload;

      switch (type) {
        case "START_FETCH_ALL_SERVICES":
          // Data saved for another district must not be shown while the new
          // district loads.
          if (state.servicesDistrictId !== data?.districtId) {
            state.careSlider = [];
            state.allServicesInfo = [];
            state.isLoading = true;
          }
          break;

        case "SAVE_ALL_SERVICES_INFO":
          state.careSlider = data?.sliderByDistrict || [];
          state.allServicesInfo = data?.servicesType || [];
          state.servicesDistrictId = data?.districtId ?? null;
          state.isLoading = false;
          break;

        case "FETCH_ALL_SERVICES_FAILED":
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
