"use client";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import EmptyCart from "@/components/Cart/EmptyCart";
import CheckoutCard from "@/components/common/CheckoutCard";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import { useOrderMedicine } from "@/hooks/place-order/useOrderMedicine";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
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

  const [images, setImages] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [paymentOption, setPaymentOption] = useState(paymentData[0].label);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { progressing, placeOrder } = useOrderMedicine();
  const { userLatitude, userLongitude, userInfo } = useSelector(
    (state) => state.user
  );
  const { merchantId, customstore_id } = useSelector(
    (state) => state.itemsByStore
  );
  const { medicineStoreInfo, medicineItems, totalAmountMedicine } = useSelector(
    (state) => state.cart
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const totalPrice = totalAmountMedicine;

  const less = medicineStoreInfo?.less || 0;
  const maximum_less = medicineStoreInfo?.maximum_less || 0;
  const less_type = medicineStoreInfo?.less_type || "Percent";
  const minOrderAmount = medicineStoreInfo?.min_purchage_amount || 0;
  const deliveryCharge = medicineStoreInfo?.max_delivery_charge || 0;
  const minDeliveryCharge = medicineStoreInfo?.min_delivery_charge || 0;
  const minimum_order_for_less = medicineStoreInfo?.minimum_order_for_less || 0;

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
    if (medicineItems.length > 0 || images?.length > 0) {
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
          accent={{
            text: "text-primaryMedicine",
            button: "bg-primaryMedicine hover:bg-secondaryMedicine",
            selected: "border-primaryMedicine bg-primaryMedicine/5",
            radio: "accent-primaryMedicine",
          }}
        />
      )}

      {userInfo?._id && medicineItems?.length < 1 && (
        <div className="min-h-[50vh] flex justify-center items-center">
          <EmptyCart />
        </div>
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
