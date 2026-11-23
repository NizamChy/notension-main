"use client";

import { slugify } from "../utils/slugify";
import { useParams } from "next/navigation";
import FashionProductCard from "../shared/Card/FashionProductCard";
import type { FashionProduct } from "@/lib/api/fashion";

type Props = { product: FashionProduct };

const ProductCards = ({ product }: Props) => {
  const params = useParams<{ shopSlugId?: string }>();

  const href = params?.shopSlugId
    ? `/fashion-lifestyle/shop/${params?.shopSlugId}/view-product/${slugify(
        product?.product_title_eng
      )}_${product?._id}`
    : undefined;

  return (
    <FashionProductCard
      product={product}
      href={href}
      subtitle={
        product?.brand_info?.brand_name ||
        product?.category_info?.category_name
      }
    />
  );
};

export default ProductCards;
