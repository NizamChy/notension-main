// Loads the web app's fashion demo data (apps/web/src/demo/modules/fashion/
// data.js), keeping its ids so links and saved bags keep working. The demo's
// past orders (shown to every demo user) are not imported: orders belong to
// real accounts.
import { DEMO_LOCATIONS } from "@/demo/demoLocations";
import {
  fashionBrands,
  fashionCategories,
  fashionProducts,
  fashionStores,
  fashionSubCategories,
  fashionTypes,
} from "@/demo/modules/fashion/data";
import { toSlug } from "@notension/shared";
import { count, eq } from "drizzle-orm";
import type { Db } from "../db/client";
import {
  districts,
  fashionBrands as brandTable,
  fashionCategories as categoryTable,
  fashionProductColors,
  fashionProducts as productTable,
  fashionStores as storeExtraTable,
  fashionSubCategories as subCategoryTable,
  fashionTypes as typeTable,
  products,
  storeItems,
  stores,
} from "../db/schema";

type Any = Record<string, any>;

const DHAKA = "64f032f6c6635d0242c01e03";
const CHITTAGONG = "64f03388fdd8ffc6aa95bdb9";

// The fashion backend had no store locations; these are the shops' areas
// (store.district_id / latitude / longitude are required).
const STORE_PLACES: Record<string, { districtId: string; area: string; latitude: number; longitude: number }> = {
  FMR000001: { districtId: DHAKA, area: "Gulshan 1", latitude: 23.7806, longitude: 90.4166 },
  FMR000002: { districtId: DHAKA, area: "Dhanmondi", latitude: 23.7461, longitude: 90.3742 },
  FMR000003: { districtId: CHITTAGONG, area: "Agrabad", latitude: 22.3264, longitude: 91.8123 },
  FMR000004: { districtId: DHAKA, area: "Banani", latitude: 23.7937, longitude: 90.4066 },
  FMR000005: { districtId: DHAKA, area: "Mirpur 10", latitude: 23.8069, longitude: 90.3687 },
};
const DEFAULT_PLACE = STORE_PLACES.FMR000001!;

const date = (v: string) => new Date(v);
const list = (csv: string) =>
  String(csv ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export async function hasFashionData(db: Db): Promise<boolean> {
  const [row] = await db.select({ n: count() }).from(stores).where(eq(stores.module, "fashion"));
  return (row?.n ?? 0) > 0;
}

export async function seedFashion(db: Db) {
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
      fashionStores.map((s: Any) => {
        const place = STORE_PLACES[s.custom_merchant_id] ?? DEFAULT_PLACE;
        return {
          id: s._id,
          module: "fashion" as const,
          code: s.custom_merchant_id,
          name: s.shop_name,
          address: s.shop_address,
          phone: s.contact_no,
          altPhone: s.alternative_contact_no,
          districtId: place.districtId,
          areaName: place.area,
          latitude: place.latitude,
          longitude: place.longitude,
          bannerApp: s.shop_banner_app,
          bannerWeb: s.shop_banner_web,
          isActive: s.status,
          deliveryNotice: s.isShowingMsg ? s.popup_message : "",
          createdAt: date(s.createdAt),
        };
      }),
    );
    await tx.insert(storeExtraTable).values(
      fashionStores.map((s: Any) => ({ storeId: s._id, logo: s.shop_logo, updatedAt: date(s.updatedAt) })),
    );

    await tx.insert(typeTable).values(
      fashionTypes.map((t: Any) => ({
        id: t._id,
        name: t.type_name,
        image: t.type_img,
        position: t.serial_no,
        isActive: t.status,
        createdAt: date(t.createdAt),
        updatedAt: date(t.updatedAt),
      })),
    );
    await tx.insert(categoryTable).values(
      fashionCategories.map((c: Any) => ({
        id: c._id,
        typeId: c.type_info,
        name: c.category_name,
        banner: c.banner,
        position: c.serial_no,
        isActive: c.status,
        createdAt: date(c.createdAt),
        updatedAt: date(c.updatedAt),
      })),
    );
    await tx.insert(subCategoryTable).values(
      fashionSubCategories.map((s: Any) => ({
        id: s._id,
        categoryId: s.category_info._id,
        name: s.sub_category_name,
        banner1: s.banner_type_1,
        banner2: s.banner_type_2,
        position: s.serial_no,
        isActive: s.status,
        createdAt: date(s.createdAt),
        updatedAt: date(s.updatedAt),
      })),
    );
    await tx.insert(brandTable).values(
      fashionBrands.map((b: Any, position: number) => ({
        id: b._id,
        name: b.brand_name,
        isActive: b.status,
        position,
      })),
    );

    // Products (several hundred): insert in chunks to keep statements small.
    const chunks = <T>(rows: T[], size = 100) =>
      Array.from({ length: Math.ceil(rows.length / size) }, (_, i) => rows.slice(i * size, (i + 1) * size));

    for (const batch of chunks(fashionProducts as Any[])) {
      await tx.insert(products).values(
        batch.map((p) => ({
          id: p._id,
          module: "fashion" as const,
          slug: `${toSlug(p.product_title_eng) || "item"}-${String(p.product_code).toLowerCase()}`,
          titleEn: p.product_title_eng,
          titleBn: p.product_title_beng,
          unit: p.unit_symbol,
          mrp: p.max_retail_price,
          image: p.web_image,
        })),
      );
      // One store per product: the store item shares the product's id.
      await tx.insert(storeItems).values(
        batch.map((p) => ({
          id: p._id,
          storeId: p.store_info._id,
          productId: p._id,
          salePrice: p.sale_price,
          purchasePrice: p.purchase_price,
          mrp: p.max_retail_price,
          maxPerOrder: p.max_allowed,
          stockQty: p.stock_qty,
          isAvailable: p.status,
        })),
      );
      await tx.insert(productTable).values(
        batch.map((p) => ({
          productId: p._id,
          code: p.product_code,
          typeId: p.type_info._id,
          categoryId: p.category_info._id,
          subCategoryId: p.sub_category_info._id,
          brandId: p.brand_info?._id ?? null,
          appImage: p.app_image,
          detailImages: p.detail_product_image ?? [],
          sizes: list(p.sizes),
          description: p.description ?? "",
          specification: p.specification ?? "",
          sizeChart: p.size_chart ?? null,
          isPopular: p.is_popular,
          isNew: p.new,
          isBestseller: p.bestseller,
          isFeatured: p.featured,
          rating: p.rating,
          reviews: p.reviews,
          isActive: p.status,
          position: (fashionProducts as Any[]).indexOf(p),
          createdAt: date(p.createdAt),
          updatedAt: date(p.updatedAt),
        })),
      );
      const colors = batch.flatMap((p) => {
        const names = list(p.colors);
        const images: string[] = p.images_by_color ?? [];
        // Colour photos only count when there is one per colour.
        const withImages = images.length === names.length;
        return names.map((name, position) => ({
          productId: p._id as string,
          position,
          name,
          image: withImages ? (images[position] ?? null) : null,
        }));
      });
      if (colors.length) await tx.insert(fashionProductColors).values(colors);
    }
  });
}
