"use client";

import { createSlice } from "@reduxjs/toolkit";

const cartReducer = createSlice({
  name: "cart",
  initialState: {
    foodStoreInfo: {},
    foodItems: [],
    totalAmountFood: 0,
    foodCartStartAt: 0,

    groceryStoreInfo: {},
    groceryItems: [],
    totalAmountGrocery: 0,
    groceryCartStartAt: 0,

    medicineStoreInfo: {},
    medicineItems: [],
    totalAmountMedicine: 0,
    medicineCartStartAt: 0,
  },
  reducers: {
    handleCartAction: (state, { payload }) => {
      const { type, data } = payload;

      switch (type) {
        case "SAVE_FOOD_STORE_INFO": {
          state.foodStoreInfo = data;
          break;
        }

        case "SAVE_GROCERY_STORE_INFO": {
          state.groceryStoreInfo = data;
          break;
        }

        case "SAVE_MEDICINE_STORE_INFO": {
          state.medicineStoreInfo = data;
          break;
        }

        case "ADD_TO_CART_FOOD": {
          if (state.foodItems.length < 1) {
            state.foodCartStartAt = new Date().getTime();
          }
          const existingItem = state.foodItems.find(
            (item) => item._id === data._id
          );
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            state.foodItems.push({ ...data, quantity: 1 });
          }
          break;
        }

        case "ADD_TO_CART_GROCERY": {
          if (state.groceryItems.length < 1) {
            state.groceryCartStartAt = new Date().getTime();
          }
          const existingItem = state.groceryItems.find(
            (item) => item._id === data._id
          );
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            state.groceryItems.push({ ...data, quantity: 1 });
          }
          break;
        }

        case "ADD_TO_CART_MEDICINE": {
          if (state.medicineItems.length < 1) {
            state.medicineCartStartAt = new Date().getTime();
          }
          const existingItem = state.medicineItems.find(
            (item) => item._id === data._id
          );
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            state.medicineItems.push({ ...data, quantity: 1 });
          }
          break;
        }

        case "REMOVE_ITEM_FOOD": {
          state.foodItems = state.foodItems.filter(
            (item) => item._id !== data._id
          );
          break;
        }

        case "REMOVE_ITEM_GROCERY": {
          state.groceryItems = state.groceryItems.filter(
            (item) => item._id !== data._id
          );
          break;
        }

        case "REMOVE_ITEM_MEDICINE": {
          state.medicineItems = state.medicineItems.filter(
            (item) => item._id !== data._id
          );
          break;
        }

        case "INCREMENT_QUANTITY_FOOD": {
          const item = state.foodItems.find((item) => item._id === data._id);
          if (item) item.quantity += 1;
          break;
        }

        case "INCREMENT_QUANTITY_GROCERY": {
          const item = state.groceryItems.find((item) => item._id === data._id);
          if (item) item.quantity += 1;
          break;
        }

        case "INCREMENT_QUANTITY_MEDICINE": {
          const item = state.medicineItems.find(
            (item) => item._id === data._id
          );
          if (item) item.quantity += 1;
          break;
        }

        case "DECREMENT_QUANTITY_FOOD": {
          const item = state.foodItems.find((item) => item._id === data._id);
          if (item && item.quantity > 1) {
            item.quantity -= 1;
          } else {
            state.foodItems = state.foodItems.filter(
              (item) => item._id !== data._id
            );
          }
          break;
        }

        case "DECREMENT_QUANTITY_GROCERY": {
          const item = state.groceryItems.find((item) => item._id === data._id);
          if (item && item.quantity > 1) {
            item.quantity -= 1;
          } else {
            state.groceryItems = state.groceryItems.filter(
              (item) => item._id !== data._id
            );
          }
          break;
        }

        case "DECREMENT_QUANTITY_MEDICINE": {
          const item = state.medicineItems.find(
            (item) => item._id === data._id
          );
          if (item && item.quantity > 1) {
            item.quantity -= 1;
          } else {
            state.medicineItems = state.medicineItems.filter(
              (item) => item._id !== data._id
            );
          }
          break;
        }

        case "CLEAR_CART_FOOD": {
          state.foodCartStartAt = 0;
          state.foodItems = [];
          state.totalAmountFood = 0;
          break;
        }

        case "CLEAR_CART_GROCERY": {
          state.groceryCartStartAt = 0;
          state.groceryItems = [];
          state.totalAmountGrocery = 0;
          break;
        }

        case "CLEAR_CART_MEDICINE": {
          state.medicineCartStartAt = 0;
          state.medicineItems = [];
          state.totalAmountMedicine = 0;
          break;
        }

        default:
          return state;
      }

      state.totalAmountFood = state.foodItems.reduce(
        (total, item) => total + item.sale_price * item.quantity,
        0
      );

      state.totalAmountGrocery = state.groceryItems.reduce(
        (total, item) => total + item.sale_price * item.quantity,
        0
      );

      state.totalAmountMedicine = state.medicineItems?.reduce(
        (total, item) => total + item.sale_price * item.quantity,
        0
      );
    },
  },
});

export const { handleCartAction } = cartReducer.actions;
export default cartReducer.reducer;
