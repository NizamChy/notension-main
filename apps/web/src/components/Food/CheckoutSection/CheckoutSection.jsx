"use client";

import { useSessionStore } from "@/stores/sessionStore";
import { useShallow } from "zustand/react/shallow";
import notify from "@/utils/notify";
import { useSelector } from "react-redux";
import { useModuleCart } from "@/stores/useModuleCart";
import React, { useState } from "react";
import { CheckoutEmpty } from "@/components/shared/Checkout/CheckoutUI";
import CheckoutCard from "@/components/common/CheckoutCard";
import { useOrderFood } from "@/hooks/place-order/useOrderFood";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import { PAYMENT_DATA } from "@/components/shared/Checkout/paymentOptions";
import { orderTotals } from "@/utils/price";

const CheckoutSection = () => {
  const [remarks, setRemarks] = useState("");
  const [paymentOption, setPaymentOption] = useState(PAYMENT_DATA[0].label);

  // Logged-out visitors get the login modal until they sign in or close it.
  const [loginDismissed, setLoginDismissed] = useState(false);

  const { progressing, placeOrder } = useOrderFood();

  const { userLatitude, userLongitude, userInfo } = useSessionStore(
    useShallow((s) => ({ userLatitude: s.userLatitude, userLongitude: s.userLongitude, userInfo: s.userInfo })),
  );
  const {
    storeInfo: foodStoreInfo,
    items: foodItems,
    total: totalAmountFood,
  } = useModuleCart("food");

  const isModalOpen = !userInfo?._id && !loginDismissed;
  const closeModal = () => setLoginDismissed(true);

  const totalPrice = totalAmountFood;


  const { shippingCharge, discount, grandTotal } = orderTotals(
    foodStoreInfo,
    totalPrice,
  );

  const handleCustomerOrder = () => {
    if (foodItems.length > 0) {
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
        merchant_id: foodStoreInfo?._id,
        custom_merchant_id: foodStoreInfo?.custom_store_id,
        merchantInfo: {
          shop_name: foodStoreInfo?.shop_name,
          shop_address: foodStoreInfo?.shop_address,
          contact_no: foodStoreInfo?.contact_no,
          alternative_contact_no: foodStoreInfo?.alternative_contact_no,
        },
        orderItems: foodItems,
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

      placeOrder(itemOrderObj);
    } else {
      notify.warning("Your cart is empty.");
    }
  };

  return (
    <>
      {userInfo?._id && foodItems?.length > 0 && (
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
          moduleName="food"
          storeName={foodStoreInfo?.shop_name}
        />
      )}

      {userInfo?._id && foodItems?.length < 1 && (
        <CheckoutEmpty href="/food" />
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
