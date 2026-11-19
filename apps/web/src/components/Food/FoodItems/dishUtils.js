import { formatTaka } from "@/components/shared/CartUI/CartUI";

// "10% off" / "৳40 off" for a dish with a discount, otherwise null.
export const discountLabelOf = (item) =>
  item?.less > 0
    ? item?.less_type === "Percent"
      ? `${item?.less}% off`
      : `${formatTaka(item?.less).replace(/\.00$/, "")} off`
    : null;

export const dishImageOf = (item, baseUrl) =>
  item?.app_image ? `${baseUrl}/${item.app_image}` : "/png/dummyImage.png";
