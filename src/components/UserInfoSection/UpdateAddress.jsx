"use client";

import toast from "react-hot-toast";
import { isLengthBetween } from "@/utils/validation";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
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

const UpdateAddress = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { progressing, userInfo, handleDataChange, registerUser } = useUser();
  const { userInfo: savedUserInfo } = useSelector((state) => state.user);

  const handleUpdateUser = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLengthBetween(userInfo?.customer_name, 3, 50)) {
      return toast("নাম কমপক্ষে ৩ অক্ষরের এবং সর্বাধিক ৫০ অক্ষরের হতে পারে!", {
        style: {
          border: "1px solid #FC8F1E",
        },
        icon: "ℹ️",
        iconTheme: {
          primary: "#FC8F1E",
          secondary: "#FFFAEE",
        },
      });
    }

    if (!isLengthBetween(userInfo?.customer_address, 5, 200)) {
      return toast(
        "ঠিকানা কমপক্ষে ৫ অক্ষরের এবং সর্বোচ্চ ২০০ অক্ষরের মধ্যে হতে হবে!",
        {
          style: {
            border: "1px solid #FC8F1E",
          },
          icon: "ℹ️",
          iconTheme: {
            primary: "#FC8F1E",
            secondary: "#FFFAEE",
          },
        }
      );
    }

    const success_message = "আপনার তথ্য আপডেট করা হয়েছে";
    registerUser(success_message);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!savedUserInfo?._id) {
      openModal();
    }
  }, []);

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
                  value={userInfo?.customer_name || ""}
                  onChange={(e) =>
                    handleDataChange(e.target.value, "customer_name")
                  }
                />
                <TextField
                  label="Address"
                  id="customer_address"
                  required
                  multiline
                  autoComplete="street-address"
                  value={userInfo?.customer_address || ""}
                  onChange={(e) =>
                    handleDataChange(e.target.value, "customer_address")
                  }
                />
                <TextField
                  label="Alternative number"
                  id="alternative_contact_no"
                  type="tel"
                  inputMode="tel"
                  placeholder="Optional"
                  value={userInfo?.alternative_contact_no || ""}
                  onChange={(e) =>
                    handleDataChange(e.target.value, "alternative_contact_no")
                  }
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

export default UpdateAddress;
