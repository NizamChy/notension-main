import React from "react";
import Image from "next/image";

const doctorData = [
  {
    id: 1,
    name: "ডাঃ সুলেখা ভট্টাচাৰ্য্য",
    qualification:
      "এমবিবিএস, বিসিএস (স্বাস্থ্য) এফসিপিএস (গাইনী এন্ড অবস্) প্রসূতি ও স্ত্রীরোগ বিশেষজ্ঞ চট্টগ্রাম মেডিকেল কলেজ হাসপাতাল।",
    position: "সহকারী অধ্যাপক, গাইনী ও অবস্",
    expertise: "প্রসূতি, স্ত্রীরোগ ও ইনফাটিলিটি বিশেষজ্ঞ ও সা...",
    hospital: "মেডিকেল সেন্টার হাসপাতাল",
    image: "/images/medical-services/doctor-female.png",
  },
  {
    id: 2,
    name: "ডাঃ শ্যামল কুমার দাস",
    qualification:
      "এমবিবিএস, বিসিএস (স্বাস্থ্য) এফসিপিএস (মেডিসিন) অভিজ্ঞ চিকিৎসক চট্টগ্রাম মেডিকেল কলেজ।",
    position: "সহকারী অধ্যাপক, মেডিসিন",
    expertise: "চিকিৎসা বিশেষজ্ঞ ও সা...",
    hospital: "চট্টগ্রাম জেনারেল হাসপাতাল",
    image: "/images/medical-services/doctor-male.jpg",
  },
  {
    id: 3,
    name: "ডাঃ তানিয়া রহমান",
    qualification:
      "এমবিবিএস, বিসিএস (স্বাস্থ্য) ডিএমইউ (ডায়াবেটিস) অভিজ্ঞ ডায়াবেটোলজিস্ট।",
    position: "সহকারী অধ্যাপক, ডায়াবেটোলজি",
    expertise: "ডায়াবেটিস ও হরমোনজনিত রোগ বিশেষজ্ঞ ও সা...",
    hospital: "ডায়াবেটিস সেন্টার চট্টগ্রাম",
    image: "/images/medical-services/doctor-female.png",
  },
  {
    id: 4,
    name: "ডাঃ আরিফুল ইসলাম",
    qualification:
      "এমবিবিএস, বিসিএস (স্বাস্থ্য) এফসিপিএস (কার্ডিওলজি) অভিজ্ঞ হৃদরোগ বিশেষজ্ঞ।",
    position: "সহকারী অধ্যাপক, কার্ডিওলজি",
    expertise: "হৃদরোগ ও হাইপারটেনশন বিশেষজ্ঞ ও সা...",
    hospital: "হৃদরোগ সেন্টার চট্টগ্রাম",
    image: "/images/medical-services/doctor-male.jpg",
  },
  {
    id: 5,
    name: "ডাঃ ফাহমিদা আক্তার",
    qualification:
      "এমবিবিএস, বিসিএস (স্বাস্থ্য) এমএস (অর্থোপেডিক্স) অভিজ্ঞ অর্থোপেডিক্স বিশেষজ্ঞ।",
    position: "সহকারী অধ্যাপক, অর্থোপেডিক্স",
    expertise: "অর্থোপেডিক্স ও ট্রমা বিশেষজ্ঞ ও সা...",
    hospital: "অর্থোপেডিক্স ক্লিনিক চট্টগ্রাম",
    image: "/images/medical-services/doctor-female.png",
  },
  {
    id: 6,
    name: "ডাঃ মুকুল চন্দ্র ধর",
    qualification:
      "এমবিবিএস, বিসিএস (স্বাস্থ্য) এমডি (পেডিয়াট্রিক্স) অভিজ্ঞ শিশুরোগ বিশেষজ্ঞ।",
    position: "সহকারী অধ্যাপক, শিশুরোগ",
    expertise: "শিশুস্বাস্থ্য ও নবজাতক বিশেষজ্ঞ ও সা...",
    hospital: "শিশু হাসপাতাল চট্টগ্রাম",
    image: "/images/medical-services/doctor-male.jpg",
  },
];

const NearestDoctor = () => {
  return (
    <div className="flex justify-center px-4 lg:px-20 py-5 lg:py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-5 justify-center items-center">
        {doctorData.map((doctor) => (
          <div key={doctor.id} className="flex justify-center">
            <div className="bg-white w-full min-h-60 flex flex-col justify-center items-center border rounded-lg shadow-sm cursor-pointer py-3 my-2">
              <div className="flex gap-2 px-3 lg:px-8 justify-center items-center">
                <div className="w-1/3">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={86}
                    height={86}
                    className="object-contain w-[86px] h-[86px] py-2"
                  />
                </div>
                <div className="w-2/3 flex flex-col justify-start items-start">
                  <h3 className="mt-3 text-sm md:text-base font-semibold text-[#A93356]">
                    {doctor.name}
                  </h3>
                  <p className="text-xs md:text-sm text-mediumGray py-1">
                    {doctor.qualification}
                  </p>
                </div>
              </div>

              <p className="bg-[#CCB8F7] w-full text-white font-semibold text-sm md:text-base px-3 py-1">
                {doctor.expertise}
              </p>

              <div className="w-full">
                <p className="my-2 text-[#599E66] px-3 text-xm md:text-lg font-semibold">
                  {doctor.hospital}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearestDoctor;
