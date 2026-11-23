// Medicine endpoints with the paths and response shapes the web app already
// uses (MEDICINE_* in src/api-endpoints/api-endpoint.ts). Stores, products and
// store items live in the shared catalogue tables with module = "medicine";
// the medicine-only product fields (generic name, company, strength,
// prescription) are in products.attrs.
import { zValidator } from "@hono/zod-validator";
import { medicine as contract } from "@notension/shared";
import { and, asc, eq, getTableColumns, ilike, inArray, or, sql, type SQL } from "drizzle-orm";
import { Hono, type Context } from "hono";
import type { AuthEnv } from "../../auth/middleware";
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

// District names are stored as "Dhaka (ঢাকা)"; medicine stores show "Dhaka".
const shortDistrict = (name: string | null) => (name ?? "").replace(/\s*\(.*\)$/, "");
const shortDistrictSql = sql<string>`regexp_replace(coalesce(${districts.name}, ''), '\\s*\\(.*\\)$', '')`;

const ok = <T>(result: T, message = "OK") => ({ success: true as const, message, result });

// ------------------------------------------------------------ serializers

export const toMedicineStore = (s: StoreRow): contract.MedicineStore => ({
  _id: s.id,
  custom_store_id: s.code,
  shop_name: s.name,
  shop_address: s.address,
  contact_no: s.phone,
  alternative_contact_no: s.altPhone,
  district_id: s.districtId,
  district_name: shortDistrict(s.districtName),
  district_area_name: s.areaName,
  latitude: s.latitude,
  longitude: s.longitude,
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

export const toMedicineItem = ({ item, product, storeCode }: ItemRow): contract.MedicineItem => {
  const attrs = product.attrs as Record<string, unknown>;
  return {
    _id: item.id,
    medStoreProductInfo: product.id,
    merchantId: item.storeId,
    custom_store_id: storeCode,
    item_title_eng: product.titleEn,
    item_title_beng: product.titleBn,
    product_title_beng: product.titleBn,
    generic_name: String(attrs.generic_name ?? ""),
    company_name: String(attrs.company_name ?? ""),
    strength: String(attrs.strength ?? ""),
    pack_size: product.packSize,
    unit_symbol: product.unit,
    max_retail_price: item.mrp,
    less: item.discount,
    less_type: lessType(item.discountType),
    sale_price: item.salePrice,
    purchase_price: item.purchasePrice,
    prescription_required: attrs.prescription_required === true,
    productType: product.typeId,
    productSubtype: product.subtypeId,
    customType: item.customTypeIds,
    app_image: product.image,
    web_image: typeof attrs.web_image === "string" ? attrs.web_image : product.image,
    max_allowed: item.maxPerOrder,
    stock_qty: item.stockQty,
    is_available: item.isAvailable,
    is_active: true, // a listed store item is active
  };
};

// --------------------------------------------------------------- queries

const { location: _location, ...storeCols } = getTableColumns(stores);
const storeColumns = { ...storeCols, districtName: districts.name };

const selectStores = (db: Db) =>
  db.select(storeColumns).from(stores).leftJoin(districts, eq(districts.id, stores.districtId));

const isListed = and(eq(stores.module, "medicine"), eq(stores.isActive, true), eq(stores.isBanned, false));

export async function findMedicineStore(db: Db, ref: { id?: string; code?: string }) {
  const match = [ref.id ? eq(stores.id, ref.id) : undefined, ref.code ? eq(stores.code, ref.code) : undefined].filter(
    (x): x is SQL => !!x,
  );
  if (!match.length) return undefined;
  const [row] = await selectStores(db)
    .where(and(eq(stores.module, "medicine"), or(...match)))
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

// Medicine search matches from the first character (grocery needs two).
const searchText = (v: unknown) => {
  const text = String(v ?? "").trim();
  return text.length < 1 ? null : `%${text.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
};

// Per-store link ids, derived so they stay stable between requests.
const linkId = (refId: string, storeId: string) => `${refId.slice(0, 4)}${storeId.slice(-4)}${refId.slice(8)}`;

const EMPTY_EXPLORE: contract.MedicineExplore = {
  ShopDetails: [],
  ProductTypeByShop: [],
  ProductSubTypeByShop: [],
  DashboardSlider: [],
  specialOfferItem: [],
  dealOfTheDay: [],
  popularItem: [],
  storeId: "",
  customstoreId: "",
};

// ---------------------------------------------------------------- routes

const P = "/client-app-api/v1/medicine";

export const medicineCatalogRoutes = (db: Db) => {
  // Two paths answer "nearest stores"; both read query and body together.
  const nearest = async (c: Context<AuthEnv>) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = contract.nearbyStoresInput.safeParse({ ...c.req.query(), ...(body ?? {}) });
    const input = parsed.success ? parsed.data : { districtId: "" };
    const lat = parseFloat(String(input.shop_latitude ?? input.latitude));
    const lng = parseFloat(String(input.shop_longitude ?? input.longitude));
    const hasPosition = Number.isFinite(lat) && Number.isFinite(lng);
    const distance = hasPosition
      ? sql<number>`round(ST_Distance(${stores.location}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography))::int`
      : sql<number>`0::int`; // a bare 0 in ORDER BY would mean "column 0"
    const rows = await db
      .select({ ...storeColumns, distance })
      .from(stores)
      .leftJoin(districts, eq(districts.id, stores.districtId))
      .where(and(isListed, eq(stores.districtId, input.districtId)))
      .orderBy(asc(distance), asc(stores.code));
    return c.json(
      ok(rows.map((r) => (hasPosition ? { ...toMedicineStore(r), distance: r.distance } : toMedicineStore(r)))),
    );
  };

  return new Hono<AuthEnv>()
    .post(`${P}/get-nearest-store`, nearest)
    .post("/api/v1/medicine/public/nearest-store", nearest)

    .get(`${P}/find-store`, async (c) => {
      const like = searchText(c.req.query("search"));
      if (!like) return c.json(ok([]));
      const rows = await selectStores(db)
        .where(
          and(
            isListed,
            or(
              ilike(stores.name, like),
              ilike(stores.address, like),
              ilike(stores.areaName, like),
              ilike(shortDistrictSql, like),
            ),
          ),
        )
        .orderBy(asc(stores.code));
      return c.json(ok(rows.map(toMedicineStore)));
    })

    .get(`${P}/explore-store`, zValidator("query", contract.storeRefInput), async (c) => {
      const q = c.req.valid("query");
      const shop = await findMedicineStore(db, { id: q.storeId, code: q.custom_store_id });
      if (!shop) return c.json(ok(EMPTY_EXPLORE));

      const items = await listItems(db, shop.id);
      const typeIds = new Set(items.map((r) => r.product.typeId));
      const subtypeIds = [...new Set(items.map((r) => r.product.subtypeId))].filter((x): x is string => !!x);
      const customIds = new Set(items.flatMap((r) => r.item.customTypeIds));

      const [types, subtypes, slides] = await Promise.all([
        db.select().from(productTypes).where(eq(productTypes.module, "medicine")).orderBy(asc(productTypes.position)),
        subtypeIds.length
          ? db
              .select()
              .from(productSubtypes)
              .where(inArray(productSubtypes.id, subtypeIds))
              .orderBy(asc(productSubtypes.position))
          : Promise.resolve([]),
        db.select().from(sliders).where(eq(sliders.module, "medicine")).orderBy(asc(sliders.position)),
      ]);

      const byCustomType = (typeId: string) =>
        items.filter((r) => r.item.customTypeIds.includes(typeId)).map(toMedicineItem);
      const slot = (name: (typeof sliders.$inferSelect)["slot"]) =>
        slides.filter((s) => s.slot === name).map((s) => ({ _id: s.id, file_name: s.fileName }));

      const result: contract.MedicineExplore = {
        ShopDetails: [toMedicineStore(shop)],
        ProductTypeByShop: types
          .filter((t) => (t.kind === "General" ? typeIds.has(t.id) : customIds.has(t.id)))
          .map((t) => ({
            _id: linkId(t.id, shop.id),
            typeInfo: t.id,
            custom_type_id: t.code,
            typeName: t.name,
            statusType: t.kind,
          })),
        ProductSubTypeByShop: subtypes.map((s) => ({
          _id: linkId(s.id, shop.id),
          typeInfo: s.typeId,
          sub_type_name: s.name,
          subtypeInfo: { _id: s.id, sub_type_name: s.name, banner_type_1: s.banner },
        })),
        DashboardSlider: [
          {
            _id: contract.MEDICINE_SLIDER_ID,
            first_slider: slot("first_slider"),
            second_slider: slot("second_slider"),
            third_slider: slot("third_slider"),
            fourth_slider: slot("fourth_slider"),
          },
        ],
        specialOfferItem: byCustomType(contract.MEDICINE_CUSTOM_TYPE_IDS.specialOffer),
        dealOfTheDay: byCustomType(contract.MEDICINE_CUSTOM_TYPE_IDS.dealOfTheDay),
        popularItem: byCustomType(contract.MEDICINE_CUSTOM_TYPE_IDS.popularItem),
        storeId: shop.id,
        customstoreId: shop.code,
      };
      return c.json(ok(result));
    })

    .get(`${P}/search-items`, zValidator("query", contract.storeRefInput), async (c) => {
      const q = c.req.valid("query");
      const like = searchText(c.req.query("search"));
      const shop = like ? await findMedicineStore(db, { id: q.merchantId, code: q.custom_store_id }) : undefined;
      if (!like || !shop) return c.json(ok([]));
      const rows = await listItems(
        db,
        shop.id,
        or(
          ilike(products.titleEn, like),
          ilike(products.titleBn, like),
          ilike(sql`${products.attrs}->>'generic_name'`, like),
          ilike(sql`${products.attrs}->>'company_name'`, like),
        ),
        q.page,
      );
      return c.json(ok(rows.map(toMedicineItem)));
    })

    .get(`${P}/items-by-subtype`, zValidator("query", contract.storeRefInput), async (c) => {
      const q = c.req.valid("query");
      const shop = await findMedicineStore(db, { id: q.merchantId, code: q.custom_store_id });
      if (!shop) return c.json(ok([]));
      const rows = await listItems(db, shop.id, eq(products.subtypeId, c.req.query("productSubtype") ?? ""), q.page);
      return c.json(ok(rows.map(toMedicineItem)));
    })

    .get(`${P}/items-by-customType`, zValidator("query", contract.storeRefInput), async (c) => {
      const q = c.req.valid("query");
      const shop = await findMedicineStore(db, { id: q.merchantId, code: q.custom_store_id });
      if (!shop) return c.json(ok([]));
      const rows = await listItems(db, shop.id, hasCustomType(c.req.query("customType") ?? ""), q.page);
      return c.json(ok(rows.map(toMedicineItem)));
    })

    // Product pages link by the store item's _id, lists by the product's.
    .get(`${P}/item-details`, zValidator("query", contract.storeRefInput), async (c) => {
      const q = c.req.valid("query");
      const ref = c.req.query("medStoreProductInfo") ?? "";
      const shop = await findMedicineStore(db, { id: q.merchantId, code: q.custom_store_id });
      const [row] = shop ? await listItems(db, shop.id, or(eq(products.id, ref), eq(storeItems.id, ref))) : [];
      if (!row) return c.json({ success: false as const, message: "Item not available in this store", result: null });
      return c.json(ok(toMedicineItem(row)));
    });
};
