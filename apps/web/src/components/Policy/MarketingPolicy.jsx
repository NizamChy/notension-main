import React from "react";

// Merchant fees: [item, regular fee, discount, current price].
const FEES = [
  ["গ্রোসেরি/মেডিসিন/ফুড/সার্ভিস প্রভাইডার রেজিস্ট্রেশন ফি", "৳২০০০", "৫০% অফ", "১০০০৳"],
  ["গ্রোসেরি এর মাসিক সাবস্ক্রিপশন ফি", "৳২০০০", "৬০% অফ", "৮০০৳"],
  ["মেডিসিন এর মাসিক সাবস্ক্রিপশন ফি", "৳২০০০", "৬০% অফ", "৮০০৳"],
  ["ফুড এর মাসিক সাবস্ক্রিপশন ফি", "৳২০০০", "৭০% অফ", "৬০০৳"],
  ["সার্ভিস প্রভাইডার এর মাসিক সাবস্ক্রিপশন ফি", "৳১৫০০", "৬০% অফ", "৬০০৳"],
  ["ডেন্টাল/হসপিটাল/ডায়গনস্টিক সেন্টার রেজিস্ট্রেশন ফি", "৳৩০০০", "৩৩% অফ (অপসোনাল)", "মিনিমাম ১০০০৳"],
  ["ডেন্টাল/হসপিটাল/ডায়গনস্টিক সেন্টার এর মাসিক সাবস্ক্রিপশন ফি", "৳৩০০০", "৩৩% অফ (অপসোনাল)", "মিনিমাম ১০০০৳"],
];

const BENEFITS = [
  ["১", "৩ মাসের Professional Leadership Training."],
  [
    "২",
    "২০,০০০ টাকা মূল্যের একটি ২৪ মাসের জন্য Discount Card free. যা দিয়ে, সারা বাংলাদেশের যে সমস্ত হাসপাতাল, ডায়াগনস্টিক সেন্টার, খাবারের দোকান এবং সার্ভিস বিক্রি করে ঐ সমস্ত প্রতিষ্ঠান, যাদের সাথে আমাদের চুক্তি হবে, সেখান থেকে সর্বোচ্চ 50% পর্যন্ত ডিসকাউন্ট এর সুবিধা। ডিসকাউন্ট কার্ড দিয়ে দুই বছরে কমপক্ষে এক থেকে দুই লক্ষ টাকার সেভ হবে।",
  ],
  [
    "৩",
    "প্রতি কাস্টমার অ্যাকাউন্ট রেজিস্ট্রেশনে ১০ টাকা বোনাস (প্রথম ১০০ জনের জন্য), পরবর্তী সকল রেজিস্ট্রেশনে ৫ টাকা বোনাস।",
  ],
  ["৪", "১ম লেভেল থেকে ৯০০ টাকা মার্কেটিং পার্টনার রেফার কমিশন।"],
  ["৫", "২য় লেভেল থেকে ৩০০ টাকা মার্কেটিং পার্টনার রেফার কমিশন।"],
  ["৬", "৩য় লেভেল থেকে ২০০ টাকা মার্কেটিং পার্টনার রেফার কমিশন।"],
];

// [number, who it applies to, commission]
const MERCHANT_COMMISSION = [
  ["৭", null, "মার্চেন্ট রেজিষ্ট্রেশন ফি-এর উপর 50% instant commission."],
  ["৮", "সরাসরি রেফার এর ক্ষেত্রে", "মাসিক ফি-এর উপর প্রথম বছর ২০% কমিশন এবং ২য় বছর থেকে লাইফ টাইম কমিশন ১৫%"],
  ["৯", "১ম লেভেল থেকে", "মাসিক ফি-এর উপর প্রথম বছর ৩% কমিশন এবং ২য় বছর থেকে লাইফ টাইম কমিশন ২%"],
  ["১০", "২য় লেভেল থেকে", "মাসিক ফি-এর উপর প্রথম বছর ২% কমিশন এবং ২য় বছর থেকে লাইফ টাইম কমিশন ১%"],
  ["১১", "৩য় লেভেল থেকে", "মাসিক ফি-এর উপর লাইফ টাইম কমিশন ১%"],
];

const CASHBACK_RULES = [
  "যুক্ত হওয়ার প্রথম তিন মাসের মধ্যে (৩০) পয়েন্ট পেলে আপনাকে (২৯৯৯) টাকা ফেরত দেয়া হবে।",
  "একটি মার্চেন্ট = ১ পয়েন্ট।",
  "একজন ব্র্যান্ডিং/প্রমোশনাল পার্টনার = ৩ পয়েন্ট।",
];

const TOC = [
  ["marketing-policy", "Marketing Policy"],
  ["partner-policy", "Partner Policy"],
  ["merchant-commission", "মার্চেন্ট কমিশন"],
  ["cashback", "Cash back"],
];

const SECTION = "scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-5 md:p-8";
const H2 = "text-xl font-bold tracking-tight text-gray-900 md:text-2xl";
const H3 = "mt-8 text-base font-bold text-gray-900 md:text-lg";
const NUMBER =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0C3F8E]/10 text-xs font-bold text-[#0C3F8E] dark:text-[#7FB2FF]";

const MarketingPolicy = () => {
  return (
    <div className="min-h-content bg-gray-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 md:py-12">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EB5C2F] md:text-sm">
            Policies
          </p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Marketing &amp; Partner Policy
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 md:text-base">
            Merchant fees, current offers and the benefits of joining NoTension
            as a branding / promotional partner.
          </p>

          <nav aria-label="On this page" className="mt-5">
            <ul className="flex flex-wrap gap-2">
              {TOC.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="inline-flex min-h-10 items-center rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:text-[#0C3F8E] dark:hover:text-[#7FB2FF]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <div className="mt-8 flex flex-col gap-6">
          {/* Marketing policy: merchant fees */}
          <section id="marketing-policy" className={SECTION}>
            <h2 className={H2}>Marketing Policy</h2>
            <p className="mt-1 text-sm text-gray-500">
              রেজিস্ট্রেশন ও মাসিক সাবস্ক্রিপশন ফি এবং বর্তমান অফার
            </p>

            <ul className="mt-5 divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200">
              {FEES.map(([item, regular, discount, price]) => (
                <li
                  key={item}
                  className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <p className="text-sm font-medium leading-relaxed text-gray-800 md:text-base">
                    {item}
                  </p>
                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    <span className="text-sm text-gray-400 line-through">
                      {regular}
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      {price}
                    </span>
                    <span className="rounded-full bg-[#EB5C2F]/10 px-2.5 py-0.5 text-xs font-semibold text-[#C4320A] dark:text-[#FF8A5B]">
                      {discount}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Partner policy: benefits */}
          <section id="partner-policy" className={SECTION}>
            <h2 className={H2}>Partner Policy</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700 md:text-base">
              আমাদের সাথে প্লাটফর্ম ব্র্যান্ডিং/প্রমোশনাল পার্টনার হিসেবে যুক্ত
              হয়ে আপনার লাইফের নতুন একটি অধ্যায় তৈরি করুন।
            </p>

            <h3 className={H3}>সুবিধা সমূহ</h3>
            <ol className="mt-4 space-y-4">
              {BENEFITS.map(([no, text]) => (
                <li key={no} className="flex gap-3">
                  <span className={NUMBER}>{no}</span>
                  <p className="pt-0.5 text-sm leading-relaxed text-gray-700 md:text-base">
                    {text}
                  </p>
                </li>
              ))}
            </ol>

            <p className="mt-6 rounded-xl bg-[#12B76A]/10 px-4 py-3 text-sm font-semibold text-[#067647] dark:text-[#47CD89] md:text-base">
              মার্কেটিং একবার, আয় সারাজীবন
            </p>
          </section>

          {/* Merchant marketing commission */}
          <section id="merchant-commission" className={SECTION}>
            <h2 className={H2}>মার্চেন্ট মার্কেটিং এর উপর কমিশন</h2>
            <ol className="mt-5 space-y-4">
              {MERCHANT_COMMISSION.map(([no, scope, text]) => (
                <li key={no} className="flex gap-3">
                  <span className={NUMBER}>{no}</span>
                  <div className="pt-0.5">
                    {scope && (
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#EB5C2F]">
                        {scope}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-xl border border-[#F79009]/30 bg-[#F79009]/10 px-4 py-3 text-sm leading-relaxed text-gray-800 md:text-base">
              জেনারেল অ্যাফিলিয়েট মার্কেটিং পার্টনার হিসেবে জয়েনিং ফী{" "}
              <strong className="font-bold text-gray-900">2999 টাকা</strong> যা
              100% ক্যাশব্যাক (শর্ত প্রযোজ্য)।
            </div>
          </section>

          {/* Cash back rules */}
          <section id="cashback" className={SECTION}>
            <h2 className={H2}>Cash back (2999 টাকা)</h2>
            <ul className="mt-5 space-y-3">
              {CASHBACK_RULES.map((rule) => (
                <li
                  key={rule}
                  className="flex gap-3 text-sm leading-relaxed text-gray-700 md:text-base"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#EB5C2F]"
                  />
                  {rule}
                </li>
              ))}
            </ul>

            <ol className="mt-6 space-y-4">
              <li className="flex gap-3">
                <span className={NUMBER}>১২</span>
                <p className="pt-0.5 text-sm leading-relaxed text-gray-700 md:text-base">
                  সুতরাং, যে কোন ভাবে আপনার ৩০ পয়েন্ট হলেই ২৯৯৯ টাকা ফেরত পাবেন।
                </p>
              </li>
              <li className="flex gap-3">
                <span className={NUMBER}>১৩</span>
                <p className="pt-0.5 text-sm leading-relaxed text-gray-700 md:text-base">
                  এই 30 পয়েন্ট ফিলআপ করতে গিয়ে, রেজিষ্ট্রেশন এবং জয়েনিং থেকে
                  আপনার ইনকাম হবে ১৫ হাজার টাকা।
                </p>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MarketingPolicy;
