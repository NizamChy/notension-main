// Imports the web app's demo data into the database, so the API and demo
// mode answer with the same records. The demo files are plain JS; this is the
// only place the API reads them.
import { DEMO_LOCATIONS } from "@/demo/demoLocations";
import {
  DEMO_GROCERY_ITEMS,
  DEMO_GROCERY_PRODUCTS,
  DEMO_GROCERY_SLIDER,
  DEMO_GROCERY_STORES,
  DEMO_GROCERY_SUBTYPES,
  DEMO_GROCERY_TYPES,
} from "@/demo/modules/grocery/data";
import type { Db } from "../db/client";
import {
  districts,
  products,
  productSubtypes,
  productTypes,
  sliders,
  storeItems,
  stores,
} from "../db/schema";

type Any = Record<string, any>;
const discountType = (v: unknown) => (v === undefined || v === "Percent" ? "percent" : "flat") as "percent" | "flat";
const SLOTS = ["first_slider", "second_slider", "third_slider", "fourth_slider"] as const;

export async function seedDemo(db: Db) {
  await db.transaction(async (tx) => {
    await tx
      .insert(districts)
      .values(
        DEMO_LOCATIONS.map((l: Any) => ({
          id: l.districtId,
          name: l.districtName,
          latitude: l.latitude,
          longitude: l.longitude,
        })),
      )
      .onConflictDoNothing();

    // ------------------------------------------------------------ grocery
    await tx.insert(stores).values(
      DEMO_GROCERY_STORES.map((s: Any) => ({
        id: s._id,
        module: "grocery" as const,
        code: s.custom_store_id,
        name: s.shop_name,
        address: s.shop_address,
        phone: s.contact_no,
        altPhone: s.alternative_contact_no,
        districtId: s.districtId,
        areaName: s.district_area_name,
        latitude: s.shop_latitude,
        longitude: s.shop_longitude,
        bannerApp: s.shop_banner_app,
        bannerWeb: s.shop_banner_web,
        isActive: s.is_active,
        isBanned: s.is_banned,
        isClosed: s.is_closed,
        showPrice: s.show_product_price,
        deliveryNotice: s.delivery_notice,
        minOrder: s.min_purchage_amount,
        minDeliveryCharge: s.min_delivery_charge,
        maxDeliveryCharge: s.max_delivery_charge,
        discount: s.less,
        discountType: discountType(s.less_type),
        maxDiscount: s.maximum_less,
        minOrderForDiscount: s.minimum_order_for_less,
        merchantType: s.merchant_type,
        opensAt: s.opening_time,
        closesAt: s.closing_time,
      })),
    );

    await tx.insert(productTypes).values(
      DEMO_GROCERY_TYPES.map((t: Any, position: number) => ({
        id: t._id,
        module: "grocery" as const,
        code: t.custom_type_id,
        name: t.type_name,
        kind: t.statusType,
        position,
      })),
    );

    await tx.insert(productSubtypes).values(
      DEMO_GROCERY_SUBTYPES.map((s: Any, position: number) => ({
        id: s._id,
        typeId: s.typeInfo,
        code: s.custom_sub_type_id,
        name: s.sub_type_name,
        banner: s.banner_type_1,
        position,
      })),
    );

    await tx.insert(products).values(
      DEMO_GROCERY_PRODUCTS.map((p: Any) => ({
        id: p._id,
        module: "grocery" as const,
        slug: p.slug,
        titleEn: p.product_title_eng,
        titleBn: p.product_title_beng,
        packSize: p.pack_size,
        unit: p.unit_symbol,
        mrp: p.max_retail_price,
        image: p.app_image,
        typeId: p.productType,
        subtypeId: p.productSubtype,
      })),
    );

    await tx.insert(storeItems).values(
      DEMO_GROCERY_ITEMS.map((i: Any, position: number) => ({
        id: i._id,
        storeId: i.groceryStoreId,
        productId: i.productInfoTable,
        salePrice: i.sale_price,
        purchasePrice: i.purchase_price,
        mrp: i.max_retail_price,
        discount: i.less,
        discountType: discountType(i.less_type),
        maxPerOrder: i.max_allowed,
        stockQty: i.stock_qty,
        isAvailable: i.is_available,
        customTypeIds: i.customType,
        position,
      })),
    );

    const slider = DEMO_GROCERY_SLIDER[0] as Any;
    await tx.insert(sliders).values(
      SLOTS.flatMap((slot) =>
        (slider[slot] as Any[]).map((s, position) => ({
          id: s._id,
          module: "grocery" as const,
          slot,
          fileName: s.file_name,
          position,
        })),
      ),
    );
  });
}
