"use client";

import notify from "@/utils/notify";
import { useSelector } from "react-redux";
import { useModuleCart } from "@/stores/useModuleCart";
import React, { useState } from "react";
import { CheckoutEmpty } from "@/components/shared/Checkout/CheckoutUI";
import CheckoutCard from "@/components/common/CheckoutCard";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import { useOrderMedicine } from "@/hooks/place-order/useOrderMedicine";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import { PAYMENT_DATA } from "@/components/shared/Checkout/paymentOptions";
import { orderTotals } from "@/utils/price";

const CheckoutSection = () => {
  const [remarks, setRemarks] = useState("");
  const [paymentOption, setPaymentOption] = useState(PAYMENT_DATA[0].label);

  // Logged-out visitors get the login modal until they sign in or close it.
  const [loginDismissed, setLoginDismissed] = useState(false);

  const { progressing, placeOrder } = useOrderMedicine();
  const { userLatitude, userLongitude, userInfo } = useSelector(
    (state) => state.user
  );
  const { merchantId, customstore_id } = useSelector(
    (state) => state.itemsByStore
  );
  const {
    storeInfo: medicineStoreInfo,
    items: medicineItems,
    total: totalAmountMedicine,
  } = useModuleCart("medicine");

  const isModalOpen = !userInfo?._id && !loginDismissed;
  const closeModal = () => setLoginDismissed(true);

  const totalPrice = totalAmountMedicine;


  const { shippingCharge, discount, grandTotal } = orderTotals(
    medicineStoreInfo,
    totalPrice,
  );

  const handleCustomerOrder = () => {
    if (medicineItems.length > 0) {
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
          shop_name: medicineStoreInfo?.shop_name,
          shop_address: medicineStoreInfo?.shop_address,
          contact_no: medicineStoreInfo?.contact_no,
          alternative_contact_no: medicineStoreInfo?.alternative_contact_no,
        },
        order_list_image: [],
        orderItems: medicineItems,
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
      {userInfo?._id && medicineItems?.length > 0 && (
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
          moduleName="medicine"
          storeName={medicineStoreInfo?.shop_name}
        />
      )}

      {userInfo?._id && medicineItems?.length < 1 && (
        <CheckoutEmpty href="/medicine" />
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
