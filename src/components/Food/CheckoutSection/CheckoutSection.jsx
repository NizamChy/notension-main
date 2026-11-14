"use client";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { CheckoutEmpty } from "@/components/shared/Checkout/CheckoutUI";
import CheckoutCard from "@/components/common/CheckoutCard";
import { useOrderFood } from "@/hooks/place-order/useOrderFood";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import { PAYMENT_DATA } from "@/components/FashionLifestyle/utils/constants";

const CheckoutSection = () => {
  const paymentData = [
    {
      id: "cash_on_delivery",
      label: "Cash on Delivery",
      icon: "/png/cash-on-delivery.png",
    },
    { id: "nagad", label: "Nagad", icon: "/png/nagad.png" },
    { id: "mobile_banking", label: "Mobile Banking", icon: "/png/bkash.png" },
  ];

  const [remarks, setRemarks] = useState("");
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [paymentOption, setPaymentOption] = useState(paymentData[0].label);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { progressing, placeOrder } = useOrderFood();

  const { userLatitude, userLongitude, userInfo } = useSelector(
    (state) => state.user
  );
  const { foodStoreInfo, foodItems, totalAmountFood } = useSelector(
    (state) => state.cart
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const totalPrice = totalAmountFood;

  const minOrderAmount = foodStoreInfo?.min_purchage_amount || 0;
  const deliveryCharge = foodStoreInfo?.max_delivery_charge || 0;
  const minDeliveryCharge = foodStoreInfo?.min_delivery_charge || 0;
  const less = foodStoreInfo?.less || 0;
  const less_type = foodStoreInfo?.less_type || "Percent";
  const maximum_less = foodStoreInfo?.maximum_less || 0;
  const minimum_order_for_less = foodStoreInfo?.minimum_order_for_less || 0;

  const getGrandTotal = () => {
    let shippingCost = deliveryCharge;
    if (parseFloat(totalPrice) >= parseFloat(minOrderAmount)) {
      shippingCost = minDeliveryCharge;
    }
    let total = 0;
    let Discount = 0;
    if (
      parseFloat(less) > 0 &&
      parseFloat(maximum_less) > 0 &&
      parseFloat(totalPrice) >= parseFloat(minimum_order_for_less)
    ) {
      if (less_type === "Percent") {
        Discount = ((parseFloat(less) / 100) * parseFloat(totalPrice)).toFixed(
          2
        );
        if (parseFloat(Discount) > parseFloat(maximum_less)) {
          Discount = parseFloat(maximum_less).toFixed(2);
        }
      } else {
        Discount = less;
      }
    }
    setShippingCharge(shippingCost);
    setDiscount(Discount);
    total = (
      parseFloat(totalPrice) +
      parseFloat(shippingCost) -
      parseFloat(Discount)
    ).toFixed(2);
    setGrandTotal(total);
  };

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
      toast.error("Cart is empty.");
    }
  };

  useEffect(() => {
    getGrandTotal();
  }, [totalPrice]);

  useEffect(() => {
    if (!userInfo?._id) {
      openModal();
    }
  }, []);

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
