import React from "react";
import Link from "next/link";
import Image from "next/image";
import ConsultationCenter from "@/components/MedicalServices/DoctorSection/ConsultationCenter/ConsultationCenter";
import ConsultationCenterSlider from "@/components/MedicalServices/DoctorSection/ConsultationCenter/ConsultationCenterSlider";

const page = () => {
  return (
    <>
      <p className="text-center mt-2 md:mt-0 py-3 lg:text-xl text-primaryFood bg-[#FFF1EA]">
        Find Doctor By Consultation Center
      </p>
      <div className="lg:flex justify-center items-center gap-5 my-10 px-4 lg:px-10 xl:px-20 space-y-5 lg:space-y-0">
        <div className="w-full lg:w-1/2 lg:p-10">
          <ConsultationCenterSlider />
        </div>

        <div className="w-full lg:w-1/2 flex justify-center items-center lg:p-10">
          <Link href="/medical-services/doctor/consultation-center/nearest-center">
            <Image
              src="/images/medical-services/find-near-consultation.jpg"
              alt="find-near-consultation"
              width={800}
              height={400}
              className="rounded-lg w-full"
            />
          </Link>
        </div>
      </div>
      <ConsultationCenter />
    </>
  );
};

export default page;
