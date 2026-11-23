// Fashion & lifestyle catalogue on the paths and response shapes the web app
// already uses (FASHION_BASE_URL + src/api-endpoints/api-endpoint.ts): the
// taxonomy, brands, product lists (by men/women/kids, or filtered by type),
// a shop and the taxonomy each shop sells.
import { zValidator } from "@hono/zod-validator";
import { fashion as contract } from "@notension/shared";
import { and, asc, eq, inArray, sql, type AnyColumn, type SQL } from "drizzle-orm";
import { Hono } from "hono";
import type { z } from "zod";
import type { AuthEnv } from "../../auth/middleware";
import type { Db } from "../../db/client";
import {
  fashionBrands,
  fashionCategories,
  fashionProductColors,
  fashionProducts,
  fashionStores,
  fashionSubCategories,
  fashionTypes,
  products,
  storeItems,
  stores,
} from "../../db/schema";

export const MEN_TYPE_ID = "6880c239098c458993b32675";
export const WOMEN_TYPE_ID = "6880c244098c458993b32677";
export const KIDS_TYPE_ID = "6880c24c098c458993b32679";

const ok = <T>(data: T) => ({ success: true as const, message: "Success", data });
const iso = (d: Date) => d.toISOString();
const unique = <T>(values: T[]) => [...new Set(values)];

// ------------------------------------------------------------ serializers

type StoreRow = Omit<typeof stores.$inferSelect, "location">;

const storeColumns = {
  id: stores.id,
  code: stores.code,
  name: stores.name,
  address: stores.address,
  phone: stores.phone,
  altPhone: stores.altPhone,
  bannerApp: stores.bannerApp,
  bannerWeb: stores.bannerWeb,
  isActive: stores.isActive,
  deliveryNotice: stores.deliveryNotice,
  createdAt: stores.createdAt,
};
type StoreInfo = Pick<StoreRow, keyof typeof storeColumns>;

const toProductStore = (s: StoreInfo): z.infer<typeof contract.fashionProductStore> => ({
  _id: s.id,
  custom_merchant_id: s.code,
  shop_name: s.name,
  shop_address: s.address,
  contact_no: s.phone,
  alternative_contact_no: s.altPhone,
  shop_banner_web: s.bannerWeb,
  shop_banner_app: s.bannerApp,
});

const toStore = (
  s: StoreInfo,
  extra: typeof fashionStores.$inferSelect | null,
): contract.FashionStore => ({
  ...toProductStore(s),
  shop_logo: extra?.logo ?? null,
  isShowingMsg: s.deliveryNotice !== "",
  popup_message: s.deliveryNotice,
  status: s.isActive,
  createdAt: iso(s.createdAt),
  updatedAt: iso(extra?.updatedAt ?? s.createdAt),
});

const toType = (t: typeof fashionTypes.$inferSelect) => ({
  _id: t.id,
  type_name: t.name,
  type_img: t.image,
  serial_no: t.position,
  status: t.isActive,
  createdAt: iso(t.createdAt),
  updatedAt: iso(t.updatedAt),
});

const toCategory = (c: typeof fashionCategories.$inferSelect) => ({
  _id: c.id,
  category_name: c.name,
  type_info: c.typeId,
  banner: c.banner,
  serial_no: c.position,
  status: c.isActive,
  createdAt: iso(c.createdAt),
  updatedAt: iso(c.updatedAt),
});

const toSubCategory = (
  s: typeof fashionSubCategories.$inferSelect,
  c: typeof fashionCategories.$inferSelect,
) => ({
  _id: s.id,
  sub_category_name: s.name,
  type_info: c.typeId,
  category_info: { _id: c.id, category_name: c.name, type_info: c.typeId, banner: c.banner },
  banner_type_1: s.banner1,
  banner_type_2: s.banner2,
  serial_no: s.position,
  status: s.isActive,
  createdAt: iso(s.createdAt),
  updatedAt: iso(s.updatedAt),
});

export const toBrand = (b: typeof fashionBrands.$inferSelect): contract.FashionBrand => ({
  _id: b.id,
  brand_name: b.name,
  status: b.isActive,
});

// ------------------------------------------------------------- products

export type ProductRow = {
  item: typeof storeItems.$inferSelect;
  product: typeof products.$inferSelect;
  details: typeof fashionProducts.$inferSelect;
  type: typeof fashionTypes.$inferSelect;
  category: typeof fashionCategories.$inferSelect;
  sub: typeof fashionSubCategories.$inferSelect;
  brand: typeof fashionBrands.$inferSelect | null;
  store: StoreInfo;
  colors: (typeof fashionProductColors.$inferSelect)[];
};

// Active products of active shops, in catalogue order, with their colours.
export async function loadProducts(db: Db, where?: SQL): Promise<ProductRow[]> {
  const rows = await db
    .select({
      item: storeItems,
      product: products,
      details: fashionProducts,
      type: fashionTypes,
      category: fashionCategories,
      sub: fashionSubCategories,
      brand: fashionBrands,
      store: storeColumns,
    })
    .from(fashionProducts)
    .innerJoin(products, eq(products.id, fashionProducts.productId))
    .innerJoin(storeItems, eq(storeItems.productId, products.id))
    .innerJoin(stores, eq(stores.id, storeItems.storeId))
    .innerJoin(fashionTypes, eq(fashionTypes.id, fashionProducts.typeId))
    .innerJoin(fashionCategories, eq(fashionCategories.id, fashionProducts.categoryId))
    .innerJoin(fashionSubCategories, eq(fashionSubCategories.id, fashionProducts.subCategoryId))
    .leftJoin(fashionBrands, eq(fashionBrands.id, fashionProducts.brandId))
    .where(
      and(
        eq(stores.module, "fashion"),
        eq(stores.isActive, true),
        eq(stores.isBanned, false),
        eq(fashionProducts.isActive, true),
        where,
      ),
    )
    .orderBy(asc(fashionProducts.position), asc(fashionProducts.productId));
  if (!rows.length) return [];
  const colors = await db
    .select()
    .from(fashionProductColors)
    .where(
      inArray(
        fashionProductColors.productId,
        rows.map((r) => r.product.id),
      ),
    )
    .orderBy(asc(fashionProductColors.position));
  const byProduct = new Map<string, typeof colors>();
  for (const color of colors) byProduct.set(color.productId, [...(byProduct.get(color.productId) ?? []), color]);
  return rows.map((r) => ({ ...r, colors: byProduct.get(r.product.id) ?? [] }));
}

// A product's colour photos: one per colour, or none.
export const colorImages = (colors: ProductRow["colors"]): string[] =>
  colors.length && colors.every((c) => c.image) ? colors.map((c) => c.image!) : [];

export const toProduct = (r: ProductRow): contract.FashionProduct => ({
  _id: r.product.id,
  product_code: r.details.code,
  product_title_eng: r.product.titleEn,
  product_title_beng: r.product.titleBn,
  type_info: { _id: r.type.id, type_name: r.type.name },
  category_info: { _id: r.category.id, category_name: r.category.name },
  sub_category_info: { _id: r.sub.id, sub_category_name: r.sub.name },
  brand_info: r.brand ? toBrand(r.brand) : null,
  store_info: toProductStore(r.store),
  web_image: r.product.image,
  app_image: r.details.appImage,
  images_by_color: colorImages(r.colors),
  detail_product_image: r.details.detailImages,
  sizes: r.details.sizes.join(","),
  colors: r.colors.map((c) => c.name).join(","),
  max_retail_price: r.item.mrp,
  sale_price: r.item.salePrice,
  purchase_price: r.item.purchasePrice,
  unit_symbol: r.product.unit,
  max_allowed: r.item.maxPerOrder,
  stock_qty: r.item.stockQty,
  is_popular: r.details.isPopular,
  new: r.details.isNew,
  bestseller: r.details.isBestseller,
  featured: r.details.isFeatured,
  rating: r.details.rating,
  reviews: r.details.reviews,
  description: r.details.description,
  specification: r.details.specification,
  size_chart: r.details.sizeChart,
  status: r.details.isActive && r.item.isAvailable,
  createdAt: iso(r.details.createdAt),
  updatedAt: iso(r.details.updatedAt),
});

// Empty filter values ("", null, missing) mean "any".
const isSet = (v: unknown) => v !== undefined && v !== null && v !== "";
// Ids compared as the demo does (strict equality): only strings can match.
const idIs = (column: AnyColumn, v: unknown) => (typeof v === "string" ? eq(column, v) : sql`false`);

function productFilter(typeId: string, input: contract.ProductFilterInput): SQL | undefined {
  const { store_id: storeId, category_info: categoryId, sub_category_info: subId, is_popular: popular } = input;
  return and(
    eq(fashionProducts.typeId, typeId),
    isSet(storeId) ? idIs(storeItems.storeId, storeId) : undefined,
    isSet(categoryId) ? idIs(fashionProducts.categoryId, categoryId) : undefined,
    isSet(subId) ? idIs(fashionProducts.subCategoryId, subId) : undefined,
    popular === true || popular === "true" ? eq(fashionProducts.isPopular, true) : undefined,
  );
}

// Search matches the title, category, subcategory or brand name (case-
// insensitive, anywhere). Done here rather than in SQL so Unicode names
// (styled letters in some category names) compare the same as in JS.
const matchesSearch = (r: ProductRow, searchText: unknown) => {
  if (!isSet(searchText)) return true;
  const needle = String(searchText).trim().toLowerCase();
  return [r.product.titleEn, r.category.name, r.sub.name, r.brand?.name ?? ""].some((f) =>
    f.toLowerCase().includes(needle),
  );
};

// --------------------------------------------------------------- routes

const P = "/api/v1";

export const fashionCatalogRoutes = (db: Db) => {
  const productsOfType = async (typeId: string) => (await loadProducts(db, eq(fashionProducts.typeId, typeId))).map(toProduct);

  // What one shop sells: its product rows (for the by-store taxonomy).
  const storeTaxonomy = (storeId: string) =>
    db
      .selectDistinct({
        typeId: fashionProducts.typeId,
        categoryId: fashionProducts.categoryId,
        subCategoryId: fashionProducts.subCategoryId,
      })
      .from(fashionProducts)
      .innerJoin(storeItems, eq(storeItems.productId, fashionProducts.productId))
      .innerJoin(stores, eq(stores.id, storeItems.storeId))
      .where(and(eq(storeItems.storeId, storeId), eq(stores.module, "fashion"), eq(fashionProducts.isActive, true)));

  return new Hono<AuthEnv>()
    .get(`${P}/type/all-type`, async (c) => {
      const rows = await db.select().from(fashionTypes).orderBy(asc(fashionTypes.position));
      return c.json(ok(rows.map(toType)));
    })
    .get(`${P}/brand/all-brand`, async (c) => {
      const rows = await db.select().from(fashionBrands).orderBy(asc(fashionBrands.position));
      return c.json(ok(rows.map(toBrand)));
    })
    .get(`${P}/category/all-category`, async (c) => {
      const rows = await db.select().from(fashionCategories).orderBy(asc(fashionCategories.position));
      return c.json(ok(rows.map(toCategory)));
    })
    .get(`${P}/sub-category/all-subcategory`, async (c) => {
      const rows = await db
        .select({ sub: fashionSubCategories, category: fashionCategories })
        .from(fashionSubCategories)
        .innerJoin(fashionCategories, eq(fashionCategories.id, fashionSubCategories.categoryId))
        .orderBy(asc(fashionSubCategories.position));
      return c.json(ok(rows.map((r) => toSubCategory(r.sub, r.category))));
    })
    .get(`${P}/men-product/product-info`, async (c) => c.json(ok(await productsOfType(MEN_TYPE_ID))))
    .get(`${P}/women-product/product-info`, async (c) => c.json(ok(await productsOfType(WOMEN_TYPE_ID))))
    .get(`${P}/kids-product/product-info`, async (c) => c.json(ok(await productsOfType(KIDS_TYPE_ID))))
    .put(
      `${P}/kids-product/product-info-by-type/:typeId`,
      zValidator("json", contract.productFilterInput),
      async (c) => {
        const input = c.req.valid("json");
        const rows = await loadProducts(db, productFilter(c.req.param("typeId"), input));
        return c.json(ok(rows.filter((r) => matchesSearch(r, input.search_text)).map(toProduct)));
      },
    )
    .get(`${P}/store-info/single-store/:storeId`, async (c) => {
      const [row] = await db
        .select({ store: storeColumns, extra: fashionStores })
        .from(stores)
        .leftJoin(fashionStores, eq(fashionStores.storeId, stores.id))
        .where(and(eq(stores.id, c.req.param("storeId")), eq(stores.module, "fashion")));
      if (!row) return c.json({ success: false as const, message: "Store not found", data: null }, 404);
      return c.json(ok(toStore(row.store, row.extra)));
    })
    .get(`${P}/type/all-type-by-store/:storeId`, async (c) => {
      const storeId = c.req.param("storeId");
      const ids = unique((await storeTaxonomy(storeId)).map((r) => r.typeId));
      if (!ids.length) return c.json(ok([]));
      const rows = await db
        .select()
        .from(fashionTypes)
        .where(inArray(fashionTypes.id, ids))
        .orderBy(asc(fashionTypes.position));
      return c.json(
        ok(
          rows.map((t) => ({
            _id: contract.linkId(t.id, storeId),
            store_info: storeId,
            type_info: { _id: t.id, type_name: t.name, type_img: t.image },
          })),
        ),
      );
    })
    .get(`${P}/category/all-category-by-store/:storeId`, async (c) => {
      const storeId = c.req.param("storeId");
      const ids = unique((await storeTaxonomy(storeId)).map((r) => r.categoryId));
      if (!ids.length) return c.json(ok([]));
      const rows = await db
        .select()
        .from(fashionCategories)
        .where(inArray(fashionCategories.id, ids))
        .orderBy(asc(fashionCategories.position));
      return c.json(
        ok(
          rows.map((cat) => ({
            _id: contract.linkId(cat.id, storeId),
            store_info: storeId,
            type_info: cat.typeId,
            category_info: { _id: cat.id, category_name: cat.name, banner: cat.banner, type_info: cat.typeId },
          })),
        ),
      );
    })
    .get(`${P}/sub-category/all-subcat-by-store/:storeId`, async (c) => {
      const storeId = c.req.param("storeId");
      const ids = unique((await storeTaxonomy(storeId)).map((r) => r.subCategoryId));
      if (!ids.length) return c.json(ok([]));
      const rows = await db
        .select({ sub: fashionSubCategories, category: fashionCategories })
        .from(fashionSubCategories)
        .innerJoin(fashionCategories, eq(fashionCategories.id, fashionSubCategories.categoryId))
        .where(inArray(fashionSubCategories.id, ids))
        .orderBy(asc(fashionSubCategories.position));
      return c.json(
        ok(
          rows.map(({ sub, category }) => ({
            _id: contract.linkId(sub.id, storeId),
            store_info: storeId,
            type_info: category.typeId,
            category_info: category.id,
            sub_category_info: {
              _id: sub.id,
              sub_category_name: sub.name,
              banner_type_1: sub.banner1,
              banner_type_2: sub.banner2,
            },
          })),
        ),
      );
    });
};
