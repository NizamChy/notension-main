// Loads the web app's medicine demo data (apps/web/src/demo/modules/medicine/
// data.js) into the shared catalogue tables, keeping the demo ids.
import { DEMO_LOCATIONS } from "@/demo/demoLocations";
import {
  DEMO_MEDICINE_ITEMS,
  DEMO_MEDICINE_PRODUCTS,
  DEMO_MEDICINE_SLIDER,
  DEMO_MEDICINE_STORES,
  DEMO_MEDICINE_SUBTYPES,
  DEMO_MEDICINE_TYPES,
} from "@/demo/modules/medicine/data";
import { eq, sql } from "drizzle-orm";
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
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function hasMedicineData(db: Db): Promise<boolean> {
  const [row] = await db
    .select({ one: sql<number>`1` })
    .from(stores)
    .where(eq(stores.module, "medicine"))
    .limit(1);
  return !!row;
}

export async function seedMedicine(db: Db) {
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

    await tx.insert(stores).values(
      DEMO_MEDICINE_STORES.map((s: Any) => ({
        id: s._id,
        module: "medicine" as const,
        code: s.custom_store_id,
        name: s.shop_name,
        address: s.shop_address,
        phone: s.contact_no,
        altPhone: s.alternative_contact_no,
        districtId: s.district_id,
        areaName: s.district_area_name,
        latitude: s.latitude,
        longitude: s.longitude,
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
      DEMO_MEDICINE_TYPES.map((t: Any, position: number) => ({
        id: t._id,
        module: "medicine" as const,
        code: t.custom_type_id,
        name: t.type_name,
        kind: t.statusType,
        position,
      })),
    );

    await tx.insert(productSubtypes).values(
      DEMO_MEDICINE_SUBTYPES.map((s: Any, position: number) => ({
        id: s._id,
        typeId: s.typeInfo,
        code: `MST${String(position + 1).padStart(4, "0")}`, // the demo data has none
        name: s.sub_type_name,
        banner: s.banner_type_1,
        position,
      })),
    );

    await tx.insert(products).values(
      DEMO_MEDICINE_PRODUCTS.map((p: Any) => ({
        id: p._id,
        module: "medicine" as const,
        slug: slugify(p.item_title_eng),
        titleEn: p.item_title_eng,
        titleBn: p.item_title_beng,
        packSize: p.pack_size,
        unit: p.unit_symbol,
        mrp: p.max_retail_price,
        image: p.app_image,
        typeId: p.productType,
        subtypeId: p.productSubtype,
        attrs: {
          generic_name: p.generic_name,
          company_name: p.company_name,
          strength: p.strength,
          prescription_required: p.prescription_required,
          web_image: p.web_image,
        },
      })),
    );

    await tx.insert(storeItems).values(
      DEMO_MEDICINE_ITEMS.map((i: Any, position: number) => ({
        id: i._id,
        storeId: i.merchantId,
        productId: i.medStoreProductInfo,
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

    const slider = DEMO_MEDICINE_SLIDER[0] as Any;
    await tx.insert(sliders).values(
      SLOTS.flatMap((slot) =>
        (slider[slot] as Any[]).map((s, position) => ({
          id: s._id,
          module: "medicine" as const,
          slot,
          fileName: s.file_name,
          position,
        })),
      ),
    );
  });
}
