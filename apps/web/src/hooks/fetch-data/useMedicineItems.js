import { useSelector } from "react-redux";
import { useModuleCart } from "@/stores/useModuleCart";
import { requestStoreSwitch } from "@/components/Cart/StoreSwitch";

const useMedicineItems = () => {
  const cart = useModuleCart("medicine");

  const medicineItems = cart.items;
  const visitedMedicineStore = useSelector(
    (state) => state.dashboard.visitedMedicineStore
  );
  const medicineStoreInfo = cart.storeInfo;

  const getCurrentQty = (item) => {
    const cartItem = medicineItems?.find(
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
    cart.saveStoreInfo(visitedMedicineStore);
  };

  const emptyCartItems = (product) => {
    cart.clear();
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
        requestStoreSwitch({
          fromStore: medicineStoreInfo?.shop_name,
          toStore: visitedMedicineStore?.shop_name,
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

export default useMedicineItems;
