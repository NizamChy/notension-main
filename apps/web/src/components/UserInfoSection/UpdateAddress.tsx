"use client";

import type { customer } from "@notension/shared";
import { useSessionStore } from "@/stores/sessionStore";
import React, { useState, type MouseEvent } from "react";
import { useZodForm } from "@/lib/forms/useZodForm";
import {
  profileFormSchema,
  toastFirstError,
  type ProfileForm,
} from "@/lib/forms/customerForms";
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineDevicePhoneMobile,
} from "react-icons/hi2";
import { useUser } from "@/hooks/fetch-data/useUser";
import { ProfileHeader, InfoRow } from "./ProfileUI";
import LoginModalDetails from "../LoginSection/LoginModalDetails";
import CommonModal from "../shared/CommonModal/CommonModal";
import { CARD, PageHeader } from "../shared/UI/UI";
import { TextField } from "../shared/Checkout/CheckoutUI";
import { PrimaryButton } from "../shared/CartUI/CartUI";

// The form; rendered only for a signed-in user and keyed by the account, so
// useUser() starts from that account's saved details.
const UpdateAddressForm = () => {
  const { progressing, userInfo, registerUser } = useUser();
  // The session keeps the customer the login returned.
  const savedUserInfo = useSessionStore((s) => s.userInfo) as Partial<customer.Customer>;

  const form = useZodForm(profileFormSchema, {
    defaultValues: {
      customer_name: userInfo.customer_name,
      customer_address: userInfo.customer_address,
      alternative_contact_no: userInfo.alternative_contact_no,
    },
  });
  const { errors } = form.formState;

  const submit = (values: ProfileForm) => {
    const success_message = "Your details have been updated";
    void registerUser(values, success_message);
  };

  const handleUpdateUser = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit(
      submit,
      toastFirstError<ProfileForm>(["customer_name", "customer_address"]),
    )();
  };

  return (
    <>
      {savedUserInfo?._id && (
        <div className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
          <PageHeader
            title="Update address"
            subtitle="Keep your name, delivery address and backup number up to date."
          />

          <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-6">
            {/* Current details */}
            <div className={`${CARD} overflow-hidden`}>
              <ProfileHeader
                name={savedUserInfo?.customer_name}
                phone={savedUserInfo?.contact_no}
              />
              <dl className="mt-2 divide-y divide-gray-100 px-5 pb-3 md:px-6">
                <InfoRow
                  icon={<HiOutlinePhone />}
                  label="Phone"
                  value={savedUserInfo?.contact_no}
                />
                <InfoRow
                  icon={<HiOutlineDevicePhoneMobile />}
                  label="Alternative number"
                  value={savedUserInfo?.alternative_contact_no}
                />
                <InfoRow
                  icon={<HiOutlineMapPin />}
                  label="Delivery address"
                  value={savedUserInfo?.customer_address}
                />
              </dl>
            </div>

            {/* Edit form */}
            <section className={`${CARD} p-5 md:p-6`}>
              <h2 className="text-base font-semibold text-gray-900">
                Edit details
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Orders will be delivered to this address.
              </p>

              <div className="mt-5 space-y-4">
                <TextField
                  label="Name"
                  id="customer_name"
                  required
                  autoComplete="name"
                  error={errors.customer_name?.message}
                  {...form.register("customer_name")}
                />
                <TextField
                  label="Address"
                  id="customer_address"
                  required
                  multiline
                  autoComplete="street-address"
                  error={errors.customer_address?.message}
                  {...form.register("customer_address")}
                />
                <TextField
                  label="Alternative number"
                  id="alternative_contact_no"
                  type="tel"
                  inputMode="tel"
                  placeholder="Optional"
                  {...form.register("alternative_contact_no")}
                />
              </div>

              <PrimaryButton
                onClick={(e) => handleUpdateUser(e)}
                disabled={progressing}
                className="mt-6"
              >
                {progressing ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
                    />
                    Please wait
                  </>
                ) : (
                  "Save changes"
                )}
              </PrimaryButton>
            </section>
          </div>
        </div>
      )}

    </>
  );
};

const UpdateAddress = () => {
  const userInfo = useSessionStore((s) => s.userInfo) as Partial<customer.Customer>;
  const [loginDismissed, setLoginDismissed] = useState(false);

  if (userInfo?._id) return <UpdateAddressForm key={userInfo._id} />;

  return (
    <CommonModal isOpen={!loginDismissed} onClose={() => setLoginDismissed(true)}>
      <LoginModalDetails
        onClose={() => setLoginDismissed(true)}
        type="private-route"
      />
    </CommonModal>
  );
};

export default UpdateAddress;
