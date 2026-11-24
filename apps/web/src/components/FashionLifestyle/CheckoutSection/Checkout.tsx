"use client";

import { useSessionStore } from "@/stores/sessionStore";
import { lineTotal } from "@/utils/price";
import notify from "@/utils/notify";
import React, { useState } from "react";
import { useZodForm } from "@/lib/forms/useZodForm";
import {
  fashionCheckoutSchema,
  toastFirstError,
  type FashionCheckoutForm,
} from "@/lib/forms/customerForms";
import OrderSummary, { type BagLine } from "./OrderSummary";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { PAYMENT_DATA } from "@/components/shared/Checkout/paymentOptions";
import { useMutation } from "@tanstack/react-query";
import { placeOrder } from "@/lib/api/fashion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import { PrimaryButton } from "@/components/shared/CartUI/CartUI";
import {
  CheckoutEmpty,
  CheckoutLayout,
  CheckoutStep,
  PaymentOptions,
  TextField,
} from "@/components/shared/Checkout/CheckoutUI";

const FORM_ID = "fashion-checkout";

const Checkout = () => {
  const [totalStores, setTotalStores] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userInfo = useSessionStore((s) => s.userInfo);

  // The session's userInfo is an untyped record; these fields are strings.
  const form = useZodForm(fashionCheckoutSchema, {
    defaultValues: {
      name: (userInfo?.customer_name as string | undefined) || "",
      phone: (userInfo?.contact_no as string | undefined) || "",
      address: (userInfo?.customer_address as string | undefined) || "",
      paymentOption: PAYMENT_DATA[0].label || "",
    },
  });
  const { errors } = form.formState;
  const paymentOption = form.watch("paymentOption");

  const { cartItems: bagLines, removeFromCart, clearCart } = useCart();
  // The bag keeps each product's fields as it was added.
  const cartItems = bagLines as BagLine[];

  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const groupedItems = cartItems.reduce<Record<string, BagLine[]>>((groups, item) => {
    // A line without a store is grouped under "undefined", as before.
    const storeId = String(item?.store_info?._id);
    if (!groups[storeId]) groups[storeId] = [];
    groups[storeId].push(item);
    return groups;
  }, {});

  const groupedItemsLength = Object.keys(groupedItems)?.length;

  const postOrderMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      setTotalStores((prev) => prev + 1);
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (formData: FashionCheckoutForm) => {
    // Guard against double submit while orders are being placed.
    if (isSubmitting) return;

    setIsSubmitting(true);
    const failedStores: string[] = [];

    for (const [, items] of Object.entries(groupedItems)) {
      const merchantInfo = items[0]?.store_info;

      const subtotal = items.reduce(
        (sum, item) => sum + lineTotal(item),
        0
      );
      const deliveryCharge = 0;
      const total = subtotal + deliveryCharge;

      const orderData = {
        customer_id: userInfo?._id,
        custom_customer_id: userInfo?.custom_id,
        customerInfo: {
          customer_name: formData?.name,
          customer_address: formData?.address,
          contact_no: formData?.phone,
          alternative_contact_no: formData?.phone,
          latitude: userInfo?.latitude,
          longitude: userInfo?.longitude,
        },
        merchant_id: merchantInfo?._id,
        custom_merchant_id: merchantInfo?.custom_merchant_id || "",
        merchantInfo: {
          shop_name: merchantInfo?.shop_name,
          shop_address: merchantInfo?.shop_address,
          contact_no: merchantInfo?.contact_no || "N/A",
          alternative_contact_no: merchantInfo?.alternative_contact_no || "N/A",
        },
        orderItems: items.map((item) => ({
          _id: item?._id,
          type_info: item?.type_info?._id,
          brand_info: item?.brand_info || "",
          product_title_eng: item?.product_title_eng,
          product_title_beng: item?.product_title_beng,
          product_size: item?.selectedSize,
          product_color: item?.selectedColor || "",
          purchase_price: item?.sale_price,
          max_retail_price: item?.max_retail_price,
          sale_price: item?.sale_price,
          unit_symbol: "pcs",
          max_allowed: item?.max_allowed,
          quantity: item?.quantity,
          delivered_qty: 0,
          inc_qty: 1,
          ordered_img: item?.selectedImage,
        })),
        subTotal: subtotal,
        less_amount: 0,
        vatAmount: 0,
        deliveryCharge: deliveryCharge,
        totalAmount: total,
        shortNote: "",
        paymet_method: formData?.paymentOption,
      };

      try {
        await postOrderMutation.mutateAsync(orderData);
        // Remove this store's items right away so a retry after a partial
        // failure does not place the same order twice.
        items.forEach((item) =>
          removeFromCart(item?._id, item?.selectedSize, item?.selectedImage)
        );
      } catch {
        failedStores.push(merchantInfo?.shop_name || "a store");
      }
    }

    setIsSubmitting(false);

    if (failedStores.length) {
      notify.error(`We couldn't place your order with ${failedStores.join(", ")}. Please try again.`);
      return;
    }

    openModal();
    clearCart();
  };

  // All three fields share one message, shown once as before.
  const handleSubmit = form.handleSubmit(
    submit,
    toastFirstError<FashionCheckoutForm>(["name", "phone", "address"]),
  );

  const handleGoHomeClick = () => {
    router.push("/fashion-lifestyle");
    setTotalStores(0);

    closeModal();
  };

  const handleOrdersClick = () => {
    router.push("/fashion-lifestyle/orders");
    setTotalStores(0);
    closeModal();
  };

  if (cartItems?.length < 1)
    return (
      <>
        <div className="bg-gray-50 px-4 py-10 md:py-16">
          <CheckoutEmpty href="/fashion-lifestyle" />
        </div>
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl bg-white px-6 pb-6 text-center">
            <DotLottieReact
              src="https://lottie.host/7ea3cf4e-a72b-407b-8ea9-9103738dab49/nZY9k8iTb7.lottie"
              loop
              autoplay
            />
            <p className="text-xl font-semibold text-gray-900">
              {totalStores > 1
                ? `Orders placed with ${totalStores} shops`
                : "Order placed successfully"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              We&apos;ll let you know when it&apos;s on the way.
            </p>
            <div className="mt-5 flex w-full max-w-xs flex-col gap-2">
              <PrimaryButton onClick={handleOrdersClick}>View my orders</PrimaryButton>
              <button
                type="button"
                onClick={handleGoHomeClick}
                className="h-11 rounded-full text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
              >
                Continue shopping
              </button>
            </div>
          </div>
        </CommonModal>
      </>
    );

  const overallSubtotal = cartItems.reduce(
    (sum, item) => sum + lineTotal(item),
    0
  );
  const deliveryCharge = 0 * groupedItemsLength;
  const overallTotal = overallSubtotal + deliveryCharge;

  return (
    <div className="bg-gray-50 px-4 py-6 sm:px-6 md:py-10 lg:px-8">
      <CheckoutLayout
        subtitle="Tell us where to deliver and how you'd like to pay."
        stickyTopClass="lg:top-[136px]"
        main={
          <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
            <CheckoutStep step={1} title="Delivery details">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Full name"
                  required
                  id="checkout-name"
                  autoComplete="name"
                  error={errors.name?.message}
                  {...form.register("name")}
                />
                <TextField
                  label="Phone number"
                  required
                  type="tel"
                  id="checkout-phone"
                  autoComplete="tel"
                  error={errors.phone?.message}
                  {...form.register("phone")}
                />
                <TextField
                  label="Delivery address"
                  required
                  multiline
                  id="checkout-address"
                  autoComplete="street-address"
                  placeholder="House, road, area, city"
                  error={errors.address?.message}
                  className="sm:col-span-2"
                  {...form.register("address")}
                />
              </div>
            </CheckoutStep>

            <CheckoutStep step={2} title="Payment method">
              <PaymentOptions
                name="paymentOption"
                options={PAYMENT_DATA}
                value={paymentOption}
                onChange={(label) => form.setValue("paymentOption", label)}
              />
            </CheckoutStep>
          </form>
        }
        aside={
          <OrderSummary
            items={cartItems}
            subtotal={overallSubtotal}
            deliveryCharge={deliveryCharge}
            total={overallTotal}
            removeFromCart={removeFromCart}
            formId={FORM_ID}
            isSubmitting={isSubmitting}
          />
        }
      />
    </div>
  );
};

// Orders need an account, and the bag lives in the Zustand cart store: wait for it to
// load (so an empty bag doesn't flash), then ask guests to sign in. Keyed by
// user so the form picks up the account's name / phone / address after login.
const CheckoutGate = () => {
  const userInfo = useSessionStore((s) => s.userInfo);
  const { isInitialized } = useCart();
  const [loginOpen, setLoginOpen] = useState(true);

  if (!isInitialized) return <div className="min-h-[60vh] bg-gray-50" />;

  if (!userInfo?._id)
    return (
      <div className="bg-gray-50 px-4 py-10 md:py-16">
        <div className="mx-auto flex min-h-[40vh] max-w-md flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center">
          <p className="text-base font-semibold text-gray-900">
            Sign in to place your order
          </p>
          <p className="text-sm text-gray-500">
            Your bag is saved. Sign in and you can check out right away.
          </p>
          <PrimaryButton className="max-w-xs" onClick={() => setLoginOpen(true)}>
            Sign in
          </PrimaryButton>
        </div>
        <CommonModal isOpen={loginOpen} onClose={() => setLoginOpen(false)}>
          <LoginModalDetails
            onClose={() => setLoginOpen(false)}
            type="private-route"
          />
        </CommonModal>
      </div>
    );

  // The session's userInfo is an untyped record; _id is the account id string.
  return <Checkout key={userInfo._id as string} />;
};

export default CheckoutGate;
