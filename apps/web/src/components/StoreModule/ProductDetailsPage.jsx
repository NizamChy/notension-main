"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HiChevronLeft } from "react-icons/hi";
import { HiOutlineCube } from "react-icons/hi2";
import { ProductDetailsSkeleton } from "./ProductDetailsView";
import { CARD, EmptyState, PRIMARY_BUTTON } from "@/components/shared/UI/UI";

// Frame for a product page inside a grocery / medicine store: a back link to
// the store, then the details card (or its skeleton / not-found state).
const ProductDetailsPage = ({ basePath, isLoading, notFound, children }) => {
  const params = useParams();
  const storeHref = `${basePath}/${params?.store}/${params?.storeId}/${params?.customStoreId}`;

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href={storeHref}
        className="mb-4 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <HiChevronLeft className="text-lg" />
        Back to store
      </Link>

      {notFound ? (
        <EmptyState
          icon={<HiOutlineCube />}
          title="Product not found"
          text="This product may have been removed or is no longer sold by this store."
          action={
            <Link href={storeHref} className={PRIMARY_BUTTON}>
              Continue shopping
            </Link>
          }
          className="min-h-[50vh]"
        />
      ) : (
        <div className={`p-4 sm:p-6 md:p-8 ${CARD}`}>
          {isLoading ? <ProductDetailsSkeleton /> : children}
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
