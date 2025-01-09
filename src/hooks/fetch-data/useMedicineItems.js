import { useDispatch, useSelector } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";

const useMedicineItems = () => {
  const dispatch = useDispatch();

  const medicineItems = useSelector((state) => state.cart.medicineItems);
  const visitedMedicineStore = useSelector(
    (state) => state.dashboard.visitedMedicineStore
  );
  const medicineStoreInfo = useSelector(
    (state) => state.cart.medicineStoreInfo
  );

  const getCurrentQty = (item) => {
    const cartItem = medicineItems?.find(
      (cartItem) => cartItem?._id === item?._id
    );
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    return currentQuantity;
  };

  const addProduct = (product) => {
    dispatch(
      handleCartAction({
        type: "ADD_TO_CART_MEDICINE",
        data: product,
      })
    );
  };

  const saveStoreAndProductInfo = (product) => {
    addProduct(product);
    dispatch(
      handleCartAction({
        type: "SAVE_MEDICINE_STORE_INFO",
        data: visitedMedicineStore,
      })
    );
  };

  const emptyCartItems = (product) => {
    dispatch(
      handleCartAction({
        type: "CLEAR_CART_MEDICINE",
      })
    );
    saveStoreAndProductInfo(product);
  };

  const addToCart = (item) => {
    let product = {
      _id: item?._id,
      medStoreProductInfo: item?.medStoreProductInfo,
      item_title_eng: item?.item_title_eng || "",
      item_title_beng: item?.item_title_beng || "",
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

    if (medicineItems.length > 0) {
      if (
        medicineStoreInfo?._id &&
        medicineStoreInfo?._id !== visitedMedicineStore?._id
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
        type: "INCREMENT_QUANTITY_MEDICINE",
        data: { _id: itemId },
      })
    );
  };

  const decrementQty = (itemId) => {
    dispatch(
      handleCartAction({
        type: "DECREMENT_QUANTITY_MEDICINE",
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

export default useMedicineItems;
