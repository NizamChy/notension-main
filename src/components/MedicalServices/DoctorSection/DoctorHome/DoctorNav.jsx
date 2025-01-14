import Image from "next/image";
import Link from "next/link";
import React from "react";

const DoctorNav = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center gap-5 py-4 lg:py-0">
        <div>
          <Link href="/medical-services/doctor/nearest-doctor">
            <Image
              src="/images/medical-services/find-nearest-doctor.png"
              alt="Product image"
              width={400}
              height={400}
              className="w-full lg:max-w-[400px] rounded-lg shadow-md hover:shadow-lg"
            />
          </Link>
        </div>
        <div>
          <Image
            src="/images/medical-services/find-nearest-doctor.png"
            alt="Product image"
            width={400}
            height={400}
            className="w-full lg:max-w-[400px] rounded-lg shadow-md hover:shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorNav;
