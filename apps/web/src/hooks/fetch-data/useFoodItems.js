import { useSelector } from "react-redux";
import { useModuleCart } from "@/stores/useModuleCart";
import { requestStoreSwitch } from "@/components/Cart/StoreSwitch";

const useFoodItems = () => {
  const cart = useModuleCart("food");

  const foodItems = cart.items;
  const visitedFoodStore = useSelector(
    (state) => state.dashboard.visitedFoodStore
  );
  const foodStoreInfo = cart.storeInfo;

  const getCurrentQty = (item) => {
    const cartItem = foodItems?.find((cartItem) => cartItem?._id === item?._id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    return currentQuantity;
  };

  const addProduct = (product) => {
    cart.add(product);
  };

  const saveStoreAndProductInfo = (product) => {
    addProduct(product);
    cart.saveStoreInfo(visitedFoodStore);
  };

  const emptyCartItems = (product) => {
    cart.clear();
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
        requestStoreSwitch({
          fromStore: foodStoreInfo?.shop_name,
          toStore: visitedFoodStore?.shop_name,
          onConfirm: () => emptyCartItems(product),
        });
        return false;
      } else {
        addProduct(product);
      }
    } else {
      saveStoreAndProductInfo(product);
    }
    return true;
  };

  const incrementQty = (itemId) => {
    cart.increment(itemId);
  };

  const decrementQty = (itemId) => {
    cart.decrement(itemId);
  };

  const removeFromCart = (itemId) => {
    cart.remove(itemId);
  };

  return {
    addToCart,
    incrementQty,
    decrementQty,
    getCurrentQty,
    removeFromCart,
  };
};

export default useFoodItems;
