import { formatTaka } from "@/components/shared/CartUI/CartUI";

type DiscountSource = { less?: number | null; less_type?: string | null } | null | undefined;
type ImageSource = { app_image?: string | null } | null | undefined;

// "10% off" / "৳40 off" for a dish with a discount, otherwise null.
export const discountLabelOf = (item: DiscountSource) => {
  const less = item?.less;
  return less != null && less > 0
    ? item?.less_type === "Percent"
      ? `${less}% off`
      : `${formatTaka(less).replace(/\.00$/, "")} off`
    : null;
};

export const dishImageOf = (item: ImageSource, baseUrl: string) =>
  item?.app_image ? `${baseUrl}/${item.app_image}` : "/png/dummyImage.png";
