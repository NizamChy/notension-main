"use client";

import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import CheckoutCard from "@/components/common/CheckoutCard";
import { CommonModal, LoginModalDetails } from "./legacyViews";
import { CheckoutEmpty } from "@/components/shared/Checkout/CheckoutUI";
import { PAYMENT_DATA } from "@/components/shared/Checkout/paymentOptions";
import { usePlaceGroceryOrder } from "@/hooks/grocery/usePlaceGroceryOrder";
import { usePlaceMedicineOrder } from "@/hooks/medicine/usePlaceMedicineOrder";
import type { ItemModuleName } from "./moduleItems";
import { useStoreRef } from "@/hooks/grocery/useStoreRef";
import { checkoutFormSchema, type CheckoutForm } from "@/lib/api/schemas/checkoutForm";
import { useZodForm } from "@/lib/forms/useZodForm";
import { useSessionStore } from "@/stores/sessionStore";
import { useModuleCart } from "@/stores/useModuleCart";
import notify from "@/utils/notify";
import { orderTotals } from "@/utils/price";

type Props = { moduleName: ItemModuleName };

// Per-module parts of the checkout. Medicine joins in PR 3.
const CHECKOUT_MODULES = {
  grocery: { usePlaceOrder: usePlaceGroceryOrder, homePath: "/grocery" },
  medicine: { usePlaceOrder: usePlaceMedicineOrder, homePath: "/medicine" },
} as const;

const StoreCheckout = ({ moduleName }: Props) => {
  const { usePlaceOrder, homePath } = CHECKOUT_MODULES[moduleName];

  const form = useZodForm(checkoutFormSchema, {
    defaultValues: { remarks: "", paymentOption: PAYMENT_DATA[0].label },
  });
  const remarks = form.watch("remarks");
  const paymentOption = form.watch("paymentOption");

  // Logged-out visitors get the login modal until they sign in or close it.
  const [loginDismissed, setLoginDismissed] = useState(false);

  const { progressing, placeOrder } = usePlaceOrder();
  const { userLatitude, userLongitude, userInfo } = useSessionStore(
    useShallow((s) => ({
      userLatitude: s.userLatitude,
      userLongitude: s.userLongitude,
      userInfo: s.userInfo,
    })),
  );
  const { storeInfo, items, total: totalPrice } = useModuleCart(moduleName);
  // The visited store, from the page URL.
  const storeRef = useStoreRef();

  const isLoggedIn = !!userInfo?._id;
  const isModalOpen = !isLoggedIn && !loginDismissed;
  const closeModal = () => setLoginDismissed(true);

  const { shippingCharge, discount, grandTotal } = orderTotals(storeInfo, totalPrice);

  const submit = (values: CheckoutForm) => {
    if (items.length < 1) {
      notify.warning("Your cart is empty.");
      return;
    }

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
      merchant_id: storeRef?.storeId,
      custom_merchant_id: storeRef?.customStoreId,
      merchantInfo: {
        shop_name: storeInfo?.shop_name,
        shop_address: storeInfo?.shop_address,
        contact_no: storeInfo?.contact_no,
        alternative_contact_no: storeInfo?.alternative_contact_no,
      },
      order_list_image: [],
      orderItems: items,
      subTotal: totalPrice,
      less_amount: discount,
      vatAmount: 0,
      deliveryCharge: shippingCharge,
      totalAmount: grandTotal,
      paymet_method: values.paymentOption,
      shortNote: values.remarks,
      customer_rating: 0,
      customer_review: "",
    };

    const formData = new FormData();
    formData.append("orderObj", JSON.stringify(itemOrderObj));
    placeOrder(formData);
  };

  return (
    <>
      {isLoggedIn && items.length > 0 && (
        <CheckoutCard
          userInfo={userInfo}
          totalPrice={totalPrice}
          shippingCharge={shippingCharge}
          discount={discount}
          grandTotal={grandTotal}
          remarks={remarks}
          setRemarks={(v: string) => form.setValue("remarks", v, { shouldValidate: true })}
          remarksError={form.formState.errors.remarks?.message}
          paymentData={PAYMENT_DATA}
          paymentOption={paymentOption}
          setPaymentOption={(v: string) => form.setValue("paymentOption", v)}
          onPlaceOrder={() => void form.handleSubmit(submit)()}
          progressing={progressing}
          disabled={false}
          moduleName={moduleName}
          storeName={storeInfo?.shop_name}
        />
      )}

      {isLoggedIn && items.length < 1 && <CheckoutEmpty href={homePath} />}

      {isModalOpen && (
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <LoginModalDetails onClose={closeModal} type="private-route" />
        </CommonModal>
      )}
    </>
  );
};

export default StoreCheckout;
