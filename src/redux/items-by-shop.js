import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  typeName: "",
  merchantId: "",
  popularItem: [],
  dealOfTheDay: [],
  customstore_id: "",
  pageNoForPopular: 2,
  productCategory: [],
  specialOfferItem: [],
  productInfoByShop: [],
  subtypeByselectedType: [],
};

const itemsByStoreSlice = createSlice({
  name: "itemsByStore",
  initialState,
  reducers: {
    handleItemsByStoreReducer: (state, { payload }) => {
      const { type, data } = payload;

      switch (type) {
        case "CLEAR_ALL":
          return {
            ...initialState,
          };

        case "SAVE_PRODUCT_INFO": {
          const itemsInfo =
            data?.length > 0
              ? [...state.productInfoByShop, ...data]
              : state.productInfoByShop;
          state.productInfoByShop = itemsInfo;
          state.isLoading = false;
          break;
        }

        case "SAVE_TYPE_SUBTYPE_INFO_BY_SHOP":
          state.typeInfoByShop = data.typeInfoByShop;
          state.subtypeInfoByShop = data.subtypeInfoByShop;
          state.isLoading = false;
          break;

        case "EXPLORE_STORE_ITEMS":
          state.specialOfferItem = data?.specialOfferItem || [];
          state.dealOfTheDay = data?.dealOfTheDay || [];
          state.popularItem = data?.popularItem || [];
          state.merchantId = data?.storeId || "";
          state.customstore_id = data?.customstoreId || "";
          state.pageNoForPopular = 2;
          state.isLoading = false;
          break;

        case "EXPLORE_FOOD_STORE_ITEMS": {
          const productByCategory =
            data?.allProductCategory?.map((info) => ({
              _id: info?.categoryInfo?._id,
              catagory: info?.categoryName,
              itemsInfo: data?.allProduct?.filter(
                (item) => item?.productCategory === info?.categoryInfo?._id
              ),
            })) || [];

          state.productCategory = data?.allProductCategory || [];
          state.productInfoByShop = productByCategory;
          state.popularItem =
            data?.allProduct?.filter((p) => p.is_popular === true) || [];
          state.merchantId = data?.storeId || "";
          state.customstore_id = data?.customstoreId || "";
          state.isLoading = false;
          break;
        }

        case "FOOD_STORE_RESET":
          state.productCategory = [];
          state.productInfoByShop = [];
          state.popularItem = [];
          break;

        case "SAVE_SUBTYPE_INFO_BY_TYPE":
          state.typeName = data?.typeName;
          state.subtypeByselectedType = data?.subtype || [];
          break;

        case "SAVE_POPULAR_PRODUCT_INFO":
          state.popularItem = [...state.popularItem, ...data];
          state.pageNoForPopular += 1;
          break;

        default:
          break;
      }
    },
  },
});

export const { handleItemsByStoreReducer } = itemsByStoreSlice.actions;

export default itemsByStoreSlice.reducer;
