import { useDispatch, useSelector } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";

const useFoodItems = () => {
  const dispatch = useDispatch();

  const foodItems = useSelector((state) => state.cart.foodItems);
  const visitedFoodStore = useSelector(
    (state) => state.dashboard.visitedFoodStore
  );
  const foodStoreInfo = useSelector((state) => state.cart.foodStoreInfo);

  const getCurrentQty = (item) => {
    const cartItem = foodItems?.find((cartItem) => cartItem?._id === item?._id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    return currentQuantity;
  };

  const addProduct = (product) => {
    dispatch(
      handleCartAction({
        type: "ADD_TO_CART_FOOD",
        data: product,
      })
    );
  };

  const saveStoreAndProductInfo = (product) => {
    addProduct(product);
    dispatch(
      handleCartAction({
        type: "SAVE_FOOD_STORE_INFO",
        data: visitedFoodStore,
      })
    );
  };

  const emptyCartItems = (product) => {
    dispatch(
      handleCartAction({
        type: "CLEAR_CART_FOOD",
      })
    );
    saveStoreAndProductInfo(product);
  };

  const addToCart = (item) => {
    let product = {
      _id: item?._id,
      productCategory: item?.productCategory,
      product_title_eng: item?.product_title_eng || "",
      product_title_beng: item?.product_title_beng || "",
      pack_size: item?.pack_size || "",
      max_retail_price: item?.max_retail_price || 0,
      sale_price: item?.sale_price || 0,
      unit_symbol: item?.unit_symbol || "",
      max_allowed: item?.max_allowed || 0,
      quantity: 1,
      delivered_qty: 0,
      inc_qty: 1,
      app_image: item?.app_image,
    };

    if (foodItems.length > 0) {
      if (foodStoreInfo?._id && foodStoreInfo?._id !== visitedFoodStore?._id) {
        emptyCartItems(product);
      } else {
        addProduct(product);
      }
    } else {
      saveStoreAndProductInfo(product);
    }
  };

  const incrementQty = (itemId) => {
    dispatch(
      handleCartAction({
        type: "INCREMENT_QUANTITY_FOOD",
        data: { _id: itemId },
      })
    );
  };

  const decrementQty = (itemId) => {
    dispatch(
      handleCartAction({
        type: "DECREMENT_QUANTITY_FOOD",
        data: { _id: itemId },
      })
    );
  };

  return {
    addToCart,
    incrementQty,
    decrementQty,
    getCurrentQty,
  };
};

export default useFoodItems;
