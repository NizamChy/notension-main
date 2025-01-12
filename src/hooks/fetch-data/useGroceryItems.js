import { useDispatch, useSelector } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";

const useGroceryItems = () => {
  const dispatch = useDispatch();

  const groceryItems = useSelector((state) => state.cart.groceryItems);
  const visitedGroceryStore = useSelector(
    (state) => state.dashboard.visitedGroceryStore
  );
  const groceryStoreInfo = useSelector((state) => state.cart.groceryStoreInfo);

  const getCurrentQty = (item) => {
    const cartItem = groceryItems?.find(
      (cartItem) => cartItem?._id === item?._id
    );
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    return currentQuantity;
  };

  const addProduct = (product) => {
    dispatch(
      handleCartAction({
        type: "ADD_TO_CART_GROCERY",
        data: product,
      })
    );
  };

  const saveStoreAndProductInfo = (product) => {
    addProduct(product);
    dispatch(
      handleCartAction({
        type: "SAVE_GROCERY_STORE_INFO",
        data: visitedGroceryStore,
      })
    );
  };

  const emptyCartItems = (product) => {
    dispatch(
      handleCartAction({
        type: "CLEAR_CART_GROCERY",
      })
    );
    saveStoreAndProductInfo(product);
  };

  const addToCart = (item) => {
    let product = {
      _id: item?._id,
      productInfoTable: item?.productInfoTable,
      product_title_eng: item?.product_title_eng || "",
      product_title_beng: item?.product_title_beng || "",
      pack_size: item?.pack_size || "",
      purchase_price: item?.purchase_price || 0,
      max_retail_price: item?.max_retail_price || 0,
      sale_price: item?.sale_price || 0,
      unit_symbol: item?.unit_symbol || "",
      max_allowed: item?.max_allowed || 0,
      quantity: 1,
      delivered_qty: 0,
      inc_qty: 1,
      app_image: item?.app_image,
    };

    if (groceryItems.length > 0) {
      if (
        groceryStoreInfo?._id &&
        groceryStoreInfo?._id !== visitedGroceryStore?._id
      ) {
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
        type: "INCREMENT_QUANTITY_GROCERY",
        data: { _id: itemId },
      })
    );
  };

  const decrementQty = (itemId) => {
    dispatch(
      handleCartAction({
        type: "DECREMENT_QUANTITY_GROCERY",
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

export default useGroceryItems;
