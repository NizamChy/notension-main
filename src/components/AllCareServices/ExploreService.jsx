"use client";

import Loader from "../common/Loader";
import { useParams } from "next/navigation";
import NearestInfoCard from "./NearestInfoCard";
import React, { useEffect, useState } from "react";
import { useAllCareService } from "@/hooks/fetch-data/useAllCareService";

const ExploreService = () => {
  const [pageNo, setPageNo] = useState(1);
  const [popularInfo, setPopularInfo] = useState([]);
  const [nearestInfo, setNearestInfo] = useState([]);

  const params = useParams();
  const serviceId = params?.serviceId || null;

  const { exploreCareProvider, progressing } = useAllCareService();

  useEffect(() => {
    exploreCareProvider(serviceId, setPopularInfo, setNearestInfo, pageNo);
  }, []);

  console.log("params :", params);
  console.log("serviceId :", serviceId);
  console.log("popularInfo :", popularInfo);
  console.log("nearestInfo :", nearestInfo);

  return (
    <div>
      {progressing ? (
        <Loader />
      ) : (
        <div className="py-0 md:py-5 lg:py-10">
          <p className="md:text-2xl font-semibold pb-1 md:pb-5 text-[#0C3F8E]">
            Nearest Information
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nearestInfo?.map((provider) => (
              <NearestInfoCard key={provider?._id} provider={provider} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreService;

//   {
//     "_id": "675d4813f800a9a528996f62",
//     "provider_name": "অল টেক কর্পোরেশন",
//     "service_details": "ইলেকট্রিক সেবা আপনার ঘরোয়া ও বাণিজ্যিক বিদ্যুৎ সমস্যা সমাধানে পেশাদার ও নির্ভরযোগ্য সমাধান নিয়ে এসেছে। নতুন সংযোগ থেকে শুরু করে মেরামত পর্যন্ত, সব ধরনের বিদ্যুৎ সেবা আমরা দিচ্ছি দক্ষতার সাথে।\r\n\r\nআমাদের সেবাসমূহ:\r\nনতুন বিদ্যুৎ সংযোগ ও তার স্থাপন।\r\nবৈদ্যুতিক সরঞ্জামের ইনস্টলেশন (ফ্যান, লাইট, এয়ার কন্ডিশনার ইত্যাদি)।\r\nবৈদ্যুতিক তারের মেরামত ও পরিবর্তন।\r\nফিউজ, সার্কিট ব্রেকার ও অন্যান্য ডিভাইসের সমাধান।\r\nসিস্টেম আপগ্রেড ও পরিদর্শন।\r\nকেন আমাদের সেবা বেছে নেবেন?\r\nবিশেষজ্ঞ টিম\r\nআমাদের ইলেকট্রিশিয়ানরা প্রশিক্ষিত এবং অভিজ্ঞ।\r\nনিরাপদ সেবা\r\nসর্বোচ্চ নিরাপত্তা মান বজায় রেখে কাজ সম্পন্ন করি।\r\nদ্রুত ও সময়মত পরিষেবা\r\nনির্ধারিত সময়ে আপনার সমস্যার সমাধান।\r\nসাশ্রয়ী মূল্য\r\nউচ্চমানের সেবা পাচ্ছেন সবচেয়ে প্রতিযোগিতামূলক দামে।\r\nএমারজেন্সি সাপোর্ট\r\nজরুরি অবস্থায়ও আমরা আছি আপনার পাশে, ২৪/৭।\r\nআমাদের প্রতিশ্রুতি:\r\nআপনার বিদ্যুৎ সমস্যার দ্রুত, নিরাপদ এবং স্থায়ী সমাধান দিতে আমরা প্রতিশ্রুতিবদ্ধ। আমাদের সেবা আপনাকে এনে দেবে শান্তি ও নির্ভরতার নিশ্চয়তা।",
//     "address": "Chatteshwari Rd, Chattogram",
//     "contact_person_name": "সায়ান ",
//     "contact_no": "+8801855505190",
//     "alternative_contact_no": "+8801855505199",
//     "provider_banner_app": "1734166544116-730091021.jpg",
//     "custom_provider_id": "8efbb9b4-f659-43fd-bee7-3af8b59c5894",
//     "distance": 137.88417370365704
// }
