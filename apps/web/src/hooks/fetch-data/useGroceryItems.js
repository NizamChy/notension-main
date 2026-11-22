import { useSelector } from "react-redux";
import { useModuleCart } from "@/stores/useModuleCart";
import { requestStoreSwitch } from "@/components/Cart/StoreSwitch";

const useGroceryItems = () => {
  const cart = useModuleCart("grocery");

  const groceryItems = cart.items;
  const visitedGroceryStore = useSelector(
    (state) => state.dashboard.visitedGroceryStore
  );
  const groceryStoreInfo = cart.storeInfo;

  const getCurrentQty = (item) => {
    const cartItem = groceryItems?.find(
      (cartItem) => cartItem?._id === item?._id
    );
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    return currentQuantity;
  };

  const addProduct = (product) => {
    cart.add(product);
  };

  const saveStoreAndProductInfo = (product) => {
    addProduct(product);
    cart.saveStoreInfo(visitedGroceryStore);
  };

  const emptyCartItems = (product) => {
    cart.clear();
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
        requestStoreSwitch({
          fromStore: groceryStoreInfo?.shop_name,
          toStore: visitedGroceryStore?.shop_name,
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

export default useGroceryItems;
