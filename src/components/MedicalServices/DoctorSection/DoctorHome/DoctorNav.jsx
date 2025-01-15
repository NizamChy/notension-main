import React from "react";
import Link from "next/link";
import Image from "next/image";

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
          <Link href="/medical-services/doctor/consultation-center">
            <Image
              src="/images/medical-services/find-doctor-by-consult.png"
              alt="Product image"
              width={400}
              height={400}
              className="w-full lg:max-w-[400px] rounded-lg shadow-md hover:shadow-lg"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorNav;
