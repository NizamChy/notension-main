// Food reads with the paths and response shapes the web app already uses
// (EXPLORE_FOOD_MODULE, NEAREST_FOOD_STORE, SEARCH_FOOD_STORE,
// EXPLORE_FOOD_STORE). Responses match demo mode (src/demo/modules/food.js)
// and are typed by the shared contract.
import { zValidator } from "@hono/zod-validator";
import { food as contract } from "@notension/shared";
import { and, asc, eq, exists, getTableColumns, ilike, inArray, or, sql, type SQL } from "drizzle-orm";
import { Hono } from "hono";
import type { z } from "zod";
import type { AuthEnv } from "../../auth/middleware";
import type { Db } from "../../db/client";
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
} from "../../db/schema";

export const P = "/client-app-api/v1/food";

const lessType = (t: "percent" | "flat") => (t === "percent" ? "Percent" : "Flat");

// The demo envelope: { success, status, message, result }.
export const ok = <T>(result: T) => ({ success: true as const, status: 200 as const, message: "Success", result });

// ------------------------------------------------------------ serializers

const { location: _location, ...storeCols } = getTableColumns(stores);
export const storeColumns = {
  ...storeCols,
  districtName: districts.name,
  logo: foodStores.logo,
  rating: foodStores.rating,
  deliveryTime: foodStores.deliveryTime,
  vatPercent: foodStores.vatPercent,
  categoryIds: foodStores.categoryIds,
};

type StoreRow = Omit<typeof stores.$inferSelect, "location"> & {
  districtName: string | null;
  logo: string | null;
  rating: number;
  deliveryTime: string;
  vatPercent: number;
  categoryIds: string[];
};

export const toFoodStore = (s: StoreRow): contract.FoodStore => ({
  _id: s.id,
  custom_store_id: s.code,
  shop_name: s.name,
  shop_address: s.address,
  district_area_name: s.areaName,
  contact_no: s.phone,
  alternative_contact_no: s.altPhone,
  delivery_time: s.deliveryTime,
  rating: s.rating,
  min_purchage_amount: s.minOrder,
  max_delivery_charge: s.maxDeliveryCharge,
  min_delivery_charge: s.minDeliveryCharge,
  less: s.discount,
  less_type: lessType(s.discountType),
  maximum_less: s.maxDiscount,
  minimum_order_for_less: s.minOrderForDiscount,
  delivery_notice: s.deliveryNotice,
  shop_banner_app: s.bannerApp,
  shop_banner_web: s.bannerWeb,
  shop_logo: s.logo,
  district_id: s.districtId,
  district_name: s.districtName ?? "",
  shop_latitude: s.latitude,
  shop_longitude: s.longitude,
  location: { type: "Point", coordinates: [s.longitude, s.latitude] },
  StoreCategory: s.categoryIds,
  opening_time: s.opensAt,
  closing_time: s.closesAt,
  is_active: s.isActive,
  is_banned: s.isBanned,
  is_closed: s.isClosed,
  vat_percent: s.vatPercent,
  createdAt: s.createdAt.toISOString(),
});

type ItemRow = {
  item: typeof storeItems.$inferSelect;
  product: typeof products.$inferSelect;
  food: typeof foodItems.$inferSelect;
  storeCode: string;
};
type OptionRow = typeof foodItemOptions.$inferSelect;

const toOption = (o: OptionRow): contract.ItemOption => ({ _id: o.id, name: o.name, price: o.price });

const toFoodItem = ({ item, product, food, storeCode }: ItemRow, options: OptionRow[]): contract.FoodItem => {
  const variations = options.filter((o) => o.kind === "variation").map(toOption);
  const addons = options.filter((o) => o.kind === "addon").map(toOption);
  return {
    _id: item.id,
    custom_product_id: food.code,
    storeId: item.storeId,
    custom_store_id: storeCode,
    productCategory: food.categoryId,
    product_title_eng: product.titleEn,
    product_title_beng: product.titleBn,
    pack_size: product.packSize,
    max_retail_price: item.mrp,
    sale_price: item.salePrice,
    less: item.discount,
    less_type: lessType(item.discountType),
    unit_symbol: product.unit,
    max_allowed: item.maxPerOrder,
    app_image: product.image,
    web_image: ((product.attrs as { web_image?: string }).web_image ?? product.image) || null,
    is_popular: food.isPopular,
    is_available: item.isAvailable,
    is_active: food.isActive,
    createdAt: food.createdAt.toISOString(),
    ...(variations.length && { variations }),
    ...(addons.length && { addons }),
  };
};

// --------------------------------------------------------------- queries

const selectStores = (db: Db) =>
  db
    .select(storeColumns)
    .from(stores)
    .innerJoin(foodStores, eq(foodStores.storeId, stores.id))
    .leftJoin(districts, eq(districts.id, stores.districtId));

const isListed = and(eq(stores.module, "food"), eq(stores.isActive, true), eq(stores.isBanned, false));

const inCategory = (categoryId: string | undefined) =>
  categoryId ? sql`${foodStores.categoryIds} @> ARRAY[${categoryId}]::text[]` : undefined;

// Case-insensitive "contains", with LIKE wildcards escaped.
const likeText = (text: string) => `%${text.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;

// Dishes of a store in menu order, active ones only, with their options.
export async function listMenu(db: Db, storeId: string) {
  const rows = await db
    .select({ item: storeItems, product: products, food: foodItems, storeCode: stores.code })
    .from(storeItems)
    .innerJoin(products, eq(products.id, storeItems.productId))
    .innerJoin(foodItems, eq(foodItems.storeItemId, storeItems.id))
    .innerJoin(stores, eq(stores.id, storeItems.storeId))
    .where(and(eq(storeItems.storeId, storeId), eq(foodItems.isActive, true)))
    .orderBy(asc(storeItems.position));
  const options = rows.length
    ? await db
        .select()
        .from(foodItemOptions)
        .where(
          and(
            inArray(
              foodItemOptions.storeItemId,
              rows.map((r) => r.item.id),
            ),
            eq(foodItemOptions.isAvailable, true),
          ),
        )
        .orderBy(asc(foodItemOptions.position))
    : [];
  return rows.map((r) => ({ row: r, options: options.filter((o) => o.storeItemId === r.item.id) }));
}

const SLOTS = ["first_slider", "second_slider", "third_slider", "fourth_slider"] as const;

// ---------------------------------------------------------------- routes

export const foodRoutes = (db: Db) =>
  new Hono<AuthEnv>()
    .get(`${P}/explore-module`, zValidator("query", contract.exploreModuleInput), async (c) => {
      const { district_id: districtId } = c.req.valid("query");
      const [categories, [set]] = await Promise.all([
        db.select().from(foodStoreCategories).orderBy(asc(foodStoreCategories.position)),
        districtId
          ? db.select().from(foodSliderSets).where(eq(foodSliderSets.districtId, districtId)).limit(1)
          : Promise.resolve([]),
      ]);
      const slides = set
        ? await db.select().from(foodSlides).where(eq(foodSlides.setId, set.id)).orderBy(asc(foodSlides.position))
        : [];
      const slot = (name: (typeof SLOTS)[number]) =>
        slides.filter((s) => s.slot === name).map((s) => ({ _id: s.id, file_name: s.fileName }));

      return c.json(
        ok({
          shopCategory: categories.map((cat) => ({
            _id: cat.id,
            store_category_name: cat.name,
            banner: cat.banner,
            regularDistance: cat.regularDistance,
            serial_no: cat.position,
            is_active: cat.isActive,
            createdAt: cat.createdAt.toISOString(),
          })),
          DashboardSlider: set
            ? [
                {
                  _id: set.id,
                  district_id: set.districtId,
                  first_slider: slot("first_slider"),
                  second_slider: slot("second_slider"),
                  third_slider: slot("third_slider"),
                  fourth_slider: slot("fourth_slider"),
                },
              ]
            : [],
        } satisfies z.infer<typeof contract.exploreModule>),
      );
    })

    .post(`${P}/get-nearest-store`, zValidator("json", contract.nearbyStoresInput), async (c) => {
      const q = c.req.valid("json");
      if (!q.district_id) return c.json(ok([]));
      const lat = q.shop_latitude;
      const lng = q.shop_longitude;
      const hasPoint = lat !== undefined && lng !== undefined;
      const distance = hasPoint
        ? sql<number>`round(ST_Distance(${stores.location}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography))::int`
        : sql<number>`0::int`; // a bare 0 in ORDER BY would mean "column 0"
      const rows = await db
        .select({ ...storeColumns, distance })
        .from(stores)
        .innerJoin(foodStores, eq(foodStores.storeId, stores.id))
        .leftJoin(districts, eq(districts.id, stores.districtId))
        .where(and(isListed, eq(stores.districtId, q.district_id), inCategory(q.StoreCategory)))
        .orderBy(asc(distance), asc(stores.code));
      const result = rows
        .filter((r) => !hasPoint || !q.max_distance || r.distance <= q.max_distance)
        .map((r) => ({ ...toFoodStore(r), ...(hasPoint && { distance: r.distance }) }));
      return c.json(ok(result));
    })

    .get(`${P}/find-store`, zValidator("query", contract.findStoreInput), async (c) => {
      const q = c.req.valid("query");
      const text = (q.search ?? "").trim();
      if (!text) return c.json(ok([]));
      const like = likeText(text);
      // A store matches on its name, address, area or a dish on its menu.
      const onMenu = exists(
        db
          .select({ one: sql`1` })
          .from(storeItems)
          .innerJoin(products, eq(products.id, storeItems.productId))
          .where(and(eq(storeItems.storeId, stores.id), ilike(products.titleEn, like))),
      );
      const rows = await selectStores(db)
        .where(
          and(
            isListed,
            inCategory(q.StoreCategory),
            or(ilike(stores.name, like), ilike(stores.address, like), ilike(stores.areaName, like), onMenu),
          ),
        )
        .orderBy(asc(stores.code));
      return c.json(ok(rows.map(toFoodStore)));
    })

    .get(`${P}/explore-store`, zValidator("query", contract.storeRefInput), async (c) => {
      const q = c.req.valid("query");
      const match = [
        q.storeId ? eq(stores.id, q.storeId) : undefined,
        q.custom_store_id ? eq(stores.code, q.custom_store_id) : undefined,
      ].filter((x): x is SQL => !!x);
      const [shop] = match.length
        ? await selectStores(db)
            .where(and(eq(stores.module, "food"), or(...match)))
            .orderBy(asc(stores.code))
            .limit(1)
        : [];
      if (!shop) {
        return c.json(
          ok<contract.ExploreStore>({
            shopDetails: [],
            allProductCategory: [],
            allProduct: [],
            storeId: q.storeId || "",
            customstoreId: q.custom_store_id || "",
          }),
        );
      }

      const menu = await listMenu(db, shop.id);
      const categoryIds = [...new Set(menu.map((m) => m.row.food.categoryId))].filter((x): x is string => !!x);
      const categories = categoryIds.length
        ? await db
            .select()
            .from(foodMenuCategories)
            .where(inArray(foodMenuCategories.id, categoryIds))
            .orderBy(asc(foodMenuCategories.position))
        : [];

      return c.json(
        ok<contract.ExploreStore>({
          shopDetails: [toFoodStore(shop)],
          allProductCategory: categories.map((cat) => ({
            _id: cat.id,
            categoryName: cat.name,
            categoryInfo: { _id: cat.id, category_name: cat.name, banner_type_1: cat.banner, is_active: cat.isActive },
            totalProduct: menu.filter((m) => m.row.food.categoryId === cat.id).length,
          })),
          allProduct: menu.map((m) => toFoodItem(m.row, m.options)),
          storeId: shop.id,
          customstoreId: shop.code,
        }),
      );
    });
