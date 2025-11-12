import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  currentProductDetails: {},
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    handleProductReducer: (state, { payload }) => {
      const { type, data } = payload;

      switch (type) {
        case "SAVE_CURRENT_PRODUCT_DETAILS":
          state.currentProductDetails = data;
          state.isLoading = false;
          break;

        case "RESET_PRODUCT":
          return {
            ...initialState,
          };

        default:
          break;
      }
    },
  },
});

export const { handleProductReducer } = productSlice.actions;

export default productSlice.reducer;
