"use client";
import React, { useEffect, useState } from "react";
import { TbCurrencyTaka } from "react-icons/tb";
import { MdContactPhone } from "react-icons/md";
import { useSelector } from "react-redux";
import { useOrderMedicine } from "@/hooks/place-order/useOrderMedicine";
import { toast } from "react-toastify";
import FloatingInput from "@/components/LoginSection/FloatingInput";

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

  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);

  const [images, setImages] = useState([]);

  const [paymentOption, setPaymentOption] = useState(paymentData[0].label);
  const [remarks, setRemarks] = useState("");

  const { progressing, placeOrder, getOrderInfo } = useOrderMedicine();

  const userInfo = useSelector((state) => state.user.userInfo);

  const { merchantId, customstore_id } = useSelector(
    (state) => state.itemsByStore
  );

  const { medicineStoreInfo, medicineItems, totalAmountMedicine } = useSelector(
    (state) => state.cart
  );

  const totalPrice = totalAmountMedicine;

  const minOrderAmount = medicineStoreInfo?.min_purchage_amount || 0;
  const deliveryCharge = medicineStoreInfo?.max_delivery_charge || 0;
  const minDeliveryCharge = medicineStoreInfo?.min_delivery_charge || 0;
  const less = medicineStoreInfo?.less || 0;
  const less_type = medicineStoreInfo?.less_type || "Percent";
  const maximum_less = medicineStoreInfo?.maximum_less || 0;
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
          latitude: 1232323,
          longitude: 2432343,
        },
        merchant_id: merchantId,
        custom_merchant_id: customstore_id,
        // merchant_id: medicineStoreInfo?._id,
        // custom_merchant_id: medicineStoreInfo?.custom_store_id,
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

      console.log(itemOrderObj);

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

  return (
    <div className="flex justify-center py-20 mt-10">
      <div className="bg-white p-4 w-full md:w-96">
        <div className="border-2 rounded-sm p-6 text-lg space-y-1 shadow-sm text-gray-800">
          <p className="text-primaryMedicine text-xl font-medium underline flex items-center gap-2">
            <span className="mt-1">
              <MdContactPhone />
            </span>
            <span> Cotnact details</span>
          </p>

          <p className="font-medium">{userInfo.customer_name}</p>

          <p className="text-base">{userInfo.customer_address}</p>

          <p className="text-base">{userInfo.contact_no}</p>

          <div className="flex flex-col py-4 font-bold text-lg border-b">
            <div className="flex justify-between">
              <p>Subtotal Amount</p>
              <span>{totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <p>Delivery Charge</p>
              <span>{shippingCharge}</span>
            </div>

            <div className="flex justify-between">
              <p>Less</p>
              <span>{discount}</span>
            </div>
          </div>

          <div className="text-center font-bold text-xl text-green-600 flex justify-center">
            <p className="flex items-center justify-between w-full">
              <span>Total Amount</span>
              <span className="flex items-center">
                <TbCurrencyTaka className="text-xl mt-0.5" /> {grandTotal}
              </span>
            </p>
          </div>

          <div className="py-4">
            <FloatingInput
              label="User remark"
              id="remark"
              size="text-base"
              multiline={true}
            />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">Payment Option</h2>
            {paymentData.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 p-1 cursor-pointer transition-colors hover:bg-gray-100"
              >
                <input
                  type="radio"
                  name="paymentOption"
                  value={option.label}
                  checked={paymentOption === option.label}
                  onChange={() => setPaymentOption(option.label)}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <img src={option.icon} alt={option.label} className="h-6 w-6" />
                <span className="text-gray-800 font-medium">
                  {option.label}
                </span>
              </label>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleCustomerOrder}
              className="mt-4 px-4 py-1 bg-primaryMedicine hover:bg-secondaryMedicine text-white rounded-md w-full"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSection;
