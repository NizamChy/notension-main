"use client";

import notify from "@/utils/notify";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { CheckoutEmpty } from "@/components/shared/Checkout/CheckoutUI";
import CheckoutCard from "@/components/common/CheckoutCard";
import { useOrderGrocery } from "@/hooks/place-order/useOrderGrocery";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import { PAYMENT_DATA } from "@/components/shared/Checkout/paymentOptions";
import { orderTotals } from "@/utils/price";

const CheckoutSection = () => {
  const [remarks, setRemarks] = useState("");
  const [paymentOption, setPaymentOption] = useState(PAYMENT_DATA[0].label);

  // Logged-out visitors get the login modal until they sign in or close it.
  const [loginDismissed, setLoginDismissed] = useState(false);

  const { progressing, placeOrder } = useOrderGrocery();
  const { userLatitude, userLongitude, userInfo } = useSelector(
    (state) => state.user
  );
  const { groceryStoreInfo, groceryItems, totalAmountGrocery } = useSelector(
    (state) => state.cart
  );
  const { merchantId, customstore_id } = useSelector(
    (state) => state.itemsByStore
  );

  const isModalOpen = !userInfo?._id && !loginDismissed;
  const closeModal = () => setLoginDismissed(true);

  const totalPrice = totalAmountGrocery;


  const { shippingCharge, discount, grandTotal } = orderTotals(
    groceryStoreInfo,
    totalPrice,
  );

  const handleCustomerOrder = () => {
    if (groceryItems.length > 0) {
      const itemOrderObj = {
        customer_id: userInfo?._id,
        custom_customer_id: userInfo?.custom_id,
        customerInfo: {
          customer_name: userInfo?.customer_name,
          customer_address: userInfo?.customer_address,
          contact_no: userInfo?.contact_no,
          alternative_contact_no: userInfo?.alternative_contact_no,
          latitude: userLatitude,
          longitude: userLongitude,
        },
        merchant_id: merchantId,
        custom_merchant_id: customstore_id,
        merchantInfo: {
          shop_name: groceryStoreInfo?.shop_name,
          shop_address: groceryStoreInfo?.shop_address,
          contact_no: groceryStoreInfo?.contact_no,
          alternative_contact_no: groceryStoreInfo?.alternative_contact_no,
        },
        order_list_image: [],
        orderItems: groceryItems,
        subTotal: totalPrice,
        less_amount: discount,
        vatAmount: 0,
        deliveryCharge: shippingCharge,
        totalAmount: grandTotal,
        paymet_method: paymentOption,
        shortNote: remarks,
        customer_rating: 0,
        customer_review: "",
      };

      const formData = new FormData();

      formData.append("orderObj", JSON.stringify(itemOrderObj));

      placeOrder(formData);
    } else {
      notify.warning("Your cart is empty.");
    }
  };

  return (
    <>
      {userInfo?._id && groceryItems?.length > 0 && (
        <CheckoutCard
          userInfo={userInfo}
          totalPrice={totalPrice}
          shippingCharge={shippingCharge}
          discount={discount}
          grandTotal={grandTotal}
          remarks={remarks}
          setRemarks={setRemarks}
          paymentData={PAYMENT_DATA}
          paymentOption={paymentOption}
          setPaymentOption={setPaymentOption}
          onPlaceOrder={handleCustomerOrder}
          progressing={progressing}
          moduleName="grocery"
          storeName={groceryStoreInfo?.shop_name}
        />
      )}

      {userInfo?._id && groceryItems?.length < 1 && (
        <CheckoutEmpty href="/grocery" />
      )}

      {isModalOpen && (
        <>
          <CommonModal isOpen={isModalOpen} onClose={closeModal}>
            <LoginModalDetails onClose={closeModal} type="private-route" />
          </CommonModal>
        </>
      )}
    </>
  );
};

export default CheckoutSection;
