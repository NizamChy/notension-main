// Imports the web app's food demo data (apps/web/src/demo/modules/food.js),
// keeping its ids so links and stored carts keep working.
//
// food.js and the demo routes index import each other; loading the index
// first lets food.js finish before the index reads its routes.
import "@/demo/routes";
import { DEMO_LOCATIONS } from "@/demo/demoLocations";
import {
  DEMO_FOOD_ITEMS,
  DEMO_FOOD_PRODUCT_CATEGORIES,
  DEMO_FOOD_SLIDERS,
  DEMO_FOOD_STORE_CATEGORIES,
  DEMO_FOOD_STORES,
} from "@/demo/modules/food";
import { count, eq } from "drizzle-orm";
import type { Db } from "../db/client";
import {
  districts,
  foodItemOptions,
  foodItems,
  foodMenuCategories,
  foodSlides,
  foodSliderSets,
  foodStoreCategories,
  foodStores,
  products,
  storeItems,
  stores,
} from "../db/schema";

type Any = Record<string, any>;
const discountType = (v: unknown) => (v === undefined || v === "Percent" ? "percent" : "flat") as "percent" | "flat";
const SLOTS = ["first_slider", "second_slider", "third_slider", "fourth_slider"] as const;

// The catalogue entry behind a dish: the dish id with its kind byte changed
// ("66f00d" + "40" + n -> "66f00d" + "41" + n).
export const foodProductId = (itemId: string) => `${itemId.slice(0, 6)}41${itemId.slice(8)}`;

export async function hasFoodData(db: Db): Promise<boolean> {
  const [row] = await db.select({ n: count() }).from(stores).where(eq(stores.module, "food"));
  return (row?.n ?? 0) > 0;
}

export async function seedFood(db: Db) {
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

    await tx.insert(foodStoreCategories).values(
      DEMO_FOOD_STORE_CATEGORIES.map((c: Any) => ({
        id: c._id,
        code: c.key,
        name: c.store_category_name,
        banner: c.banner,
        regularDistance: c.regularDistance,
        position: c.serial_no,
        isActive: c.is_active,
        createdAt: new Date(c.createdAt),
      })),
    );

    await tx.insert(foodMenuCategories).values(
      DEMO_FOOD_PRODUCT_CATEGORIES.map((c: Any, position: number) => ({
        id: c._id,
        code: c.key,
        name: c.category_name,
        banner: c.banner_type_1,
        isActive: c.is_active,
        position,
      })),
    );

    await tx.insert(stores).values(
      DEMO_FOOD_STORES.map((s: Any) => ({
        id: s._id,
        module: "food" as const,
        code: s.custom_store_id,
        name: s.shop_name,
        address: s.shop_address,
        phone: s.contact_no,
        altPhone: s.alternative_contact_no,
        districtId: s.district_id,
        areaName: s.district_area_name,
        latitude: s.shop_latitude,
        longitude: s.shop_longitude,
        bannerApp: s.shop_banner_app,
        bannerWeb: s.shop_banner_web,
        isActive: s.is_active,
        isBanned: s.is_banned,
        isClosed: s.is_closed,
        deliveryNotice: s.delivery_notice,
        minOrder: s.min_purchage_amount,
        minDeliveryCharge: s.min_delivery_charge,
        maxDeliveryCharge: s.max_delivery_charge,
        discount: s.less,
        discountType: discountType(s.less_type),
        maxDiscount: s.maximum_less,
        minOrderForDiscount: s.minimum_order_for_less,
        opensAt: s.opening_time,
        closesAt: s.closing_time,
        createdAt: new Date(s.createdAt),
      })),
    );

    await tx.insert(foodStores).values(
      DEMO_FOOD_STORES.map((s: Any) => ({
        storeId: s._id,
        logo: s.shop_logo,
        rating: s.rating,
        deliveryTime: s.delivery_time,
        vatPercent: s.vat_percent,
        categoryIds: s.StoreCategory,
      })),
    );

    await tx.insert(products).values(
      DEMO_FOOD_ITEMS.map((i: Any) => ({
        id: foodProductId(i._id),
        module: "food" as const,
        slug: String(i.custom_product_id).toLowerCase(),
        titleEn: i.product_title_eng,
        titleBn: i.product_title_beng,
        packSize: i.pack_size,
        unit: i.unit_symbol,
        mrp: i.max_retail_price,
        image: i.app_image,
        // Only kept when the web image differs from the app image.
        attrs: i.web_image && i.web_image !== i.app_image ? { web_image: i.web_image } : {},
      })),
    );

    await tx.insert(storeItems).values(
      DEMO_FOOD_ITEMS.map((i: Any, position: number) => ({
        id: i._id,
        storeId: i.storeId,
        productId: foodProductId(i._id),
        salePrice: i.sale_price,
        mrp: i.max_retail_price,
        discount: i.less,
        discountType: discountType(i.less_type),
        maxPerOrder: i.max_allowed,
        isAvailable: i.is_available,
        position,
      })),
    );

    await tx.insert(foodItems).values(
      DEMO_FOOD_ITEMS.map((i: Any) => ({
        storeItemId: i._id,
        code: i.custom_product_id,
        categoryId: i.productCategory,
        isPopular: i.is_popular,
        isActive: i.is_active,
        createdAt: new Date(i.createdAt),
      })),
    );

    // Variations and add-ons, when the demo data has any.
    const options = DEMO_FOOD_ITEMS.flatMap((i: Any) =>
      (["variation", "addon"] as const).flatMap((kind) =>
        ((kind === "variation" ? i.variations : i.addons) ?? []).map((o: Any, position: number) => ({
          id: o._id,
          storeItemId: i._id,
          kind,
          name: o.name,
          price: o.price,
          position,
        })),
      ),
    );
    if (options.length) await tx.insert(foodItemOptions).values(options);

    for (const set of Object.values(DEMO_FOOD_SLIDERS) as Any[]) {
      await tx.insert(foodSliderSets).values({ id: set._id, districtId: set.district_id });
      await tx.insert(foodSlides).values(
        SLOTS.flatMap((slot) =>
          (set[slot] as Any[]).map((s, position) => ({
            id: s._id,
            setId: set._id,
            slot,
            fileName: s.file_name,
            position,
          })),
        ),
      );
    }
  });
}
