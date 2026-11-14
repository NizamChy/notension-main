import React from "react";
import { HiChevronDown } from "react-icons/hi";

// Styles for the HTML that comes from the merchant dashboard.
const RICH_TEXT =
  "text-sm leading-relaxed text-gray-600 md:text-[15px] [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-2[&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-5";

const Section = ({ title, open = false, children }) => (
  <details
    open={open}
    className="group border-b border-gray-200 [&_summary::-webkit-details-marker]:hidden"
  >
    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 text-base font-semibold text-gray-900">
      {title}
      <HiChevronDown className="text-lg text-gray-500 transition-transform group-open:rotate-180" />
    </summary>
    <div className="pb-5">{children}</div>
  </details>
);

const hasValue = (v) => v && v !== "null" && v !== "undefined";

const ProductDetails = ({ product }) => {
  const spec = product?.specification || product?.ingredients;

  return (
    <div className="mt-8 border-t border-gray-200">
      {hasValue(product?.description) && (
        <Section title="Description" open>
          <div
            className={RICH_TEXT}
            dangerouslySetInnerHTML={{ __html: product?.description }}
          />
        </Section>
      )}

      {hasValue(spec) && (
        <Section
          title={
            product?.ingredients
              ? "Product ingredients"
              : "Details & specification"
          }
          open
        >
          <div
            className={RICH_TEXT}
            dangerouslySetInnerHTML={{ __html: spec }}
          />
        </Section>
      )}

      {hasValue(product?.size_chart) && (
        <Section title="Size chart">
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <div
              className="text-sm text-gray-700 [&_table]:w-full [&_table]:border-collapse [&_td]:border-t [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2.5 [&_td]:text-center [&_td]:tabular-nums [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-center [&_th]:font-semibold [&_th]:text-gray-900"
              dangerouslySetInnerHTML={{ __html: product?.size_chart }}
            />
          </div>
        </Section>
      )}

      {hasValue(product?.use_directions) && (
        <Section title="How to use">
          <div
            className={RICH_TEXT}
            dangerouslySetInnerHTML={{ __html: product?.use_directions }}
          />
        </Section>
      )}
    </div>
  );
};

export default ProductDetails;
