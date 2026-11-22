"use client";

import { useSessionStore } from "@/stores/sessionStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlinePencilSquare,
  HiOutlineDevicePhoneMobile,
} from "react-icons/hi2";
import { ProfileHeader, InfoRow } from "./ProfileUI";
import LoginModalDetails from "../LoginSection/LoginModalDetails";
import CommonModal from "../shared/CommonModal/CommonModal";
import { CARD, PRIMARY_BUTTON } from "../shared/UI/UI";

const UserProfile = () => {
  const [loginDismissed, setLoginDismissed] = useState(false);

  const pathname = usePathname();
  const userInfo = useSessionStore((s) => s.userInfo);

  // The fashion module has its own copy of the user pages.
  const editHref = pathname?.startsWith("/fashion-lifestyle")
    ? "/fashion-lifestyle/user/update-address"
    : "/user/update-address";

  // Logged-out visitors get the login modal until they sign in or close it.
  const isModalOpen = !userInfo?._id && !loginDismissed;
  const closeModal = () => setLoginDismissed(true);

  return (
    <>
      {userInfo?._id && (
        <div className="mx-auto w-full max-w-2xl px-4 py-8 md:py-12">
          <div className={`${CARD} overflow-hidden`}>
            <ProfileHeader
              name={userInfo?.customer_name}
              phone={userInfo?.contact_no}
              as="h1"
            />

            <div className="p-5 md:p-6">
              <h2 className="text-sm font-semibold text-gray-900">
                Contact details
              </h2>
              <dl className="mt-2 divide-y divide-gray-100">
                <InfoRow
                  icon={<HiOutlinePhone />}
                  label="Phone"
                  value={userInfo?.contact_no}
                />
                <InfoRow
                  icon={<HiOutlineDevicePhoneMobile />}
                  label="Alternative number"
                  value={userInfo?.alternative_contact_no}
                />
                <InfoRow
                  icon={<HiOutlineMapPin />}
                  label="Delivery address"
                  value={userInfo?.customer_address}
                />
              </dl>

              <Link
                href={editHref}
                className={`${PRIMARY_BUTTON} mt-5 w-full sm:w-auto`}
              >
                <HiOutlinePencilSquare className="text-base" />
                Edit details
              </Link>
            </div>
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

export default UserProfile;
