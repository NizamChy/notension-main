// Grocery endpoints with the paths and response shapes the web app already
// uses (src/api-endpoints/api-endpoint.js). Responses are built from the
// normalised tables and typed by the shared contract.
import { zValidator } from "@hono/zod-validator";
import { grocery as contract } from "@notension/shared";
import { and, asc, eq, getTableColumns, ilike, inArray, or, sql, type SQL } from "drizzle-orm";
import { Hono } from "hono";
import type { Db } from "../../db/client";
import {
  districts,
  products,
  productSubtypes,
  productTypes,
  sliders,
  storeItems,
  stores,
} from "../../db/schema";

type StoreRow = Omit<typeof stores.$inferSelect, "location"> & { districtName: string | null };
type ItemRow = {
  item: typeof storeItems.$inferSelect;
  product: typeof products.$inferSelect;
  storeCode: string;
};

const lessType = (t: "percent" | "flat") => (t === "percent" ? "Percent" : "Flat");

// ------------------------------------------------------------ serializers

export const toLegacyStore = (s: StoreRow): contract.GroceryStore => ({
  _id: s.id,
  custom_store_id: s.code,
  shop_name: s.name,
  shop_address: s.address,
  contact_no: s.phone,
  alternative_contact_no: s.altPhone,
  districtId: s.districtId,
  district_name: s.districtName ?? "",
  district_area_name: s.areaName,
  shop_latitude: s.latitude,
  shop_longitude: s.longitude,
  location: { type: "Point", coordinates: [s.longitude, s.latitude] },
  shop_banner_app: s.bannerApp,
  shop_banner_web: s.bannerWeb,
  is_active: s.isActive,
  is_banned: s.isBanned,
  is_closed: s.isClosed,
  show_product_price: s.showPrice,
  delivery_notice: s.deliveryNotice,
  min_purchage_amount: s.minOrder,
  min_delivery_charge: s.minDeliveryCharge,
  max_delivery_charge: s.maxDeliveryCharge,
  less: s.discount,
  less_type: lessType(s.discountType),
  maximum_less: s.maxDiscount,
  minimum_order_for_less: s.minOrderForDiscount,
  merchant_type: s.merchantType,
  opening_time: s.opensAt,
  closing_time: s.closesAt,
});

export const toLegacyItem = ({ item, product, storeCode }: ItemRow): contract.GroceryItem => ({
  ...(product.attrs as object),
  _id: item.id,
  productInfoTable: product.id,
  groceryStoreId: item.storeId,
  custom_store_id: storeCode,
  slug: product.slug,
  product_title_eng: product.titleEn,
  product_title_beng: product.titleBn,
  pack_size: product.packSize,
  unit_symbol: product.unit,
  max_retail_price: item.mrp,
  sale_price: item.salePrice,
  purchase_price: item.purchasePrice,
  productType: product.typeId,
  productSubtype: product.subtypeId,
  customType: item.customTypeIds,
  app_image: product.image,
  is_available: item.isAvailable,
  stock_qty: item.stockQty,
  less: item.discount,
  less_type: lessType(item.discountType),
  max_allowed: item.maxPerOrder,
});

// --------------------------------------------------------------- queries

// Every store column except the PostGIS point, plus the district name.
const { location: _location, ...storeCols } = getTableColumns(stores);
const storeColumns = { ...storeCols, districtName: districts.name };

const selectStores = (db: Db) =>
  db.select(storeColumns).from(stores).leftJoin(districts, eq(districts.id, stores.districtId));

const isListed = and(eq(stores.module, "grocery"), eq(stores.isActive, true), eq(stores.isBanned, false));

async function findStore(db: Db, ref: { id?: string; code?: string }) {
  const match = [ref.id ? eq(stores.id, ref.id) : undefined, ref.code ? eq(stores.code, ref.code) : undefined].filter(
    (x): x is SQL => !!x,
  );
  if (!match.length) return undefined;
  const [row] = await selectStores(db)
    .where(and(eq(stores.module, "grocery"), or(...match)))
    .limit(1);
  return row;
}

function listItems(db: Db, storeId: string, filter?: SQL, page?: number): Promise<ItemRow[]> {
  const q = db
    .select({ item: storeItems, product: products, storeCode: stores.code })
    .from(storeItems)
    .innerJoin(products, eq(products.id, storeItems.productId))
    .innerJoin(stores, eq(stores.id, storeItems.storeId))
    .where(and(eq(storeItems.storeId, storeId), filter))
    .orderBy(asc(storeItems.position))
    .$dynamic();
  return page === undefined
    ? q
    : q.limit(contract.PAGE_SIZE).offset((Math.max(page, 1) - 1) * contract.PAGE_SIZE);
}

const hasCustomType = (typeId: string) => sql`${storeItems.customTypeIds} @> ARRAY[${typeId}]::text[]`;

// Text search needs at least 2 characters, as in the apps.
const searchText = (v: unknown) => {
  const text = String(v ?? "").trim();
  return text.length < 2 ? null : `%${text.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
};

// ---------------------------------------------------------------- routes

const P = "/client-app-api/v1/grocery";

export const groceryRoutes = (db: Db) =>
  new Hono()
    .post(`${P}/get-nearest-store`, zValidator("json", contract.nearbyStoresInput), async (c) => {
      const { districtId, shop_latitude: lat, shop_longitude: lng } = c.req.valid("json");
      const hasPosition = Number.isFinite(lat) && Number.isFinite(lng);
      const distance = hasPosition
        ? sql<number>`round(ST_Distance(${stores.location}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography))::int`
        : sql<number>`0::int`; // a bare 0 in ORDER BY would mean "column 0"
      const rows = await db
        .select({ ...storeColumns, distance })
        .from(stores)
        .leftJoin(districts, eq(districts.id, stores.districtId))
        .where(and(isListed, eq(stores.districtId, districtId)))
        .orderBy(asc(distance), asc(stores.code));
      return c.json({
        success: true as const,
        result: rows.map((r) => ({ ...toLegacyStore(r), distance: r.distance })),
      });
    })

    .get(`${P}/find-store`, async (c) => {
      const like = searchText(c.req.query("search"));
      if (!like) return c.json({ success: true as const, result: [] });
      const rows = await selectStores(db)
        .where(and(isListed, or(ilike(stores.name, like), ilike(stores.address, like), ilike(stores.areaName, like))))
        .orderBy(asc(stores.code));
      return c.json({ success: true as const, result: rows.map(toLegacyStore) });
    })

    .get(`${P}/explore-store`, zValidator("query", contract.storeRefInput), async (c) => {
      const q = c.req.valid("query");
      const shop = await findStore(db, { id: q.storeId, code: q.custom_store_id });
      if (!shop) {
        return c.json({ success: false as const, message: "Store not found", result: { ShopDetails: [] } });
      }

      const items = await listItems(db, shop.id);
      const typeIds = new Set(items.map((r) => r.product.typeId));
      const subtypeIds = [...new Set(items.map((r) => r.product.subtypeId))].filter((x): x is string => !!x);
      const customIds = new Set(items.flatMap((r) => r.item.customTypeIds));

      const [types, subtypes, slides] = await Promise.all([
        db.select().from(productTypes).where(eq(productTypes.module, "grocery")).orderBy(asc(productTypes.position)),
        subtypeIds.length
          ? db
              .select()
              .from(productSubtypes)
              .where(inArray(productSubtypes.id, subtypeIds))
              .orderBy(asc(productSubtypes.position))
          : Promise.resolve([]),
        db.select().from(sliders).where(eq(sliders.module, "grocery")).orderBy(asc(sliders.position)),
      ]);

      // Per-store link rows. The apps only read their fields; the ids are
      // derived so they stay stable between requests.
      const linkId = (base: number, index: number) =>
        `${shop.id.slice(0, 20)}${(base + index).toString(16).padStart(4, "0")}`;
      const byCustomType = (typeId: string) =>
        items
          .filter((r) => r.item.customTypeIds.includes(typeId))
          .slice(0, contract.PAGE_SIZE)
          .map(toLegacyItem);
      const slot = (name: (typeof sliders.$inferSelect)["slot"]) =>
        slides.filter((s) => s.slot === name).map((s) => ({ _id: s.id, file_name: s.fileName }));

      const result: contract.GroceryExplore = {
        storeId: shop.id,
        customstoreId: shop.code,
        ShopDetails: [toLegacyStore(shop)],
        ProductTypeByShop: types
          .filter((t) => (t.kind === "General" ? typeIds.has(t.id) : customIds.has(t.id)))
          .map((t, i) => ({
            _id: linkId(0x100, i),
            storeInfo: shop.id,
            typeInfo: t.id,
            custom_type_id: t.code,
            typeName: t.name,
            statusType: t.kind,
          })),
        ProductSubTypeByShop: subtypes.map((s, i) => ({
          _id: linkId(0x200, i),
          storeInfo: shop.id,
          typeInfo: s.typeId,
          sub_type_name: s.name,
          subtypeInfo: { _id: s.id, sub_type_name: s.name, custom_sub_type_id: s.code, banner_type_1: s.banner },
        })),
        DashboardSlider: [
          {
            first_slider: slot("first_slider"),
            second_slider: slot("second_slider"),
            third_slider: slot("third_slider"),
            fourth_slider: slot("fourth_slider"),
          },
        ],
        specialOfferItem: byCustomType(contract.GROCERY_CUSTOM_TYPE_IDS.specialOffer),
        dealOfTheDay: byCustomType(contract.GROCERY_CUSTOM_TYPE_IDS.dealOfTheDay),
        popularItem: byCustomType(contract.GROCERY_CUSTOM_TYPE_IDS.popularItem),
      };
      return c.json({ success: true as const, result });
    })

    .get(`${P}/search-items`, zValidator("query", contract.storeRefInput), async (c) => {
      const q = c.req.valid("query");
      const like = searchText(c.req.query("search"));
      const shop = like ? await findStore(db, { id: q.groceryStoreId, code: q.custom_store_id }) : undefined;
      if (!like || !shop) return c.json({ success: true as const, result: [] });
      const rows = await listItems(
        db,
        shop.id,
        or(ilike(products.titleEn, like), ilike(products.titleBn, like)),
        q.page,
      );
      return c.json({ success: true as const, result: rows.map(toLegacyItem) });
    })

    .get(`${P}/items-by-subtype`, zValidator("query", contract.storeRefInput), async (c) => {
      const q = c.req.valid("query");
      const shop = await findStore(db, { id: q.groceryStoreId, code: q.custom_store_id });
      if (!shop) return c.json({ success: true as const, result: [] });
      const subtype = c.req.query("productSubtype") ?? "";
      const rows = await listItems(db, shop.id, eq(products.subtypeId, subtype), q.page);
      return c.json({ success: true as const, result: rows.map(toLegacyItem) });
    })

    .get(`${P}/items-by-customType`, zValidator("query", contract.storeRefInput), async (c) => {
      const q = c.req.valid("query");
      const shop = await findStore(db, { id: q.groceryStoreId, code: q.custom_store_id });
      if (!shop) return c.json({ success: true as const, result: [] });
      const rows = await listItems(db, shop.id, hasCustomType(c.req.query("customType") ?? ""), q.page);
      return c.json({ success: true as const, result: rows.map(toLegacyItem) });
    })

    .get(`${P}/item-details`, zValidator("query", contract.storeRefInput), async (c) => {
      const q = c.req.valid("query");
      const ref = c.req.query("productInfoTable") ?? "";
      const shop = await findStore(db, { id: q.groceryStoreId, code: q.custom_store_id });
      const [row] = shop ? await listItems(db, shop.id, or(eq(products.id, ref), eq(storeItems.id, ref))) : [];
      if (!row) return c.json({ success: false as const, message: "Item is not available in this store" });
      return c.json({ success: true as const, result: toLegacyItem(row) });
    });
