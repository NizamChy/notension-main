"use client";
import { createSlice } from "@reduxjs/toolkit";

const cartReducer = createSlice({
  name: "cart",
  initialState: {
    foodStoreInfo: {},
    foodCartStartAt: 0,
    cartItems: [],
    totalPrice: 0,
  },
  reducers: {
    handleCartAction: (state, { payload }) => {
      const { type, data } = payload;

      switch (type) {
        case "SAVE_FOOD_STORE_INFO": {
          state.foodStoreInfo = data;
        }

        case "ADD_TO_CART": {
          if (state.cartItems.length < 1) {
            state.foodCartStartAt = new Date().getTime();
          }
          const existingItem = state.cartItems.find(
            (item) => item._id === data._id
          );
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            state.cartItems.push({ ...data, quantity: 1 });
          }
          break;
        }

        case "REMOVE_ITEM": {
          state.cartItems = state.cartItems.filter(
            (item) => item._id !== data._id
          );
          break;
        }

        case "INCREMENT_QUANTITY": {
          const item = state.cartItems.find((item) => item._id === data._id);
          if (item) item.quantity += 1;
          break;
        }

        case "DECREMENT_QUANTITY": {
          const item = state.cartItems.find((item) => item._id === data._id);
          if (item && item.quantity > 1) {
            item.quantity -= 1;
          } else {
            state.cartItems = state.cartItems.filter(
              (item) => item._id !== data._id
            );
          }
          break;
        }

        case "PLACE_ORDER": {
          state.foodCartStartAt = 0;
          state.cartItems = [];
          state.totalPrice = 0;
          break;
        }

        default:
          return state;
      }

      state.totalPrice = state.cartItems.reduce(
        (total, item) => total + item.sale_price * item.quantity,
        0
      );
    },
  },
});

export const { handleCartAction } = cartReducer.actions;
export default cartReducer.reducer;
