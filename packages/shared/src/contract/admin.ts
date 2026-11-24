// The admin / merchant panel API (/api/v1/admin/*): request bodies the API
// validates and the response shapes the panel reads. The API imports the
// request schemas, so both sides check the same rules. Dates arrive as ISO
// strings; money as numbers.
import { z } from "zod";

export const MODULES = ["grocery", "medicine", "food", "fashion"] as const;
export const ORDER_STATUSES = ["Pending", "Accepted", "Processing", "On the way", "Delivered", "Cancelled"] as const;
export const ROLES = [
  "super_admin",
  "admin",
  "support",
  "finance",
  "content_manager",
  "merchant_owner",
  "merchant_manager",
  "merchant_staff",
  "rider",
  "doctor",
  "service_provider",
  "customer",
] as const;
export const STORE_ROLES = ["merchant_owner", "merchant_manager", "merchant_staff"] as const;
export const APPOINTMENT_STATUSES = ["Booked", "Visited", "Cancelled", "No-show"] as const;

export const moduleName = z.enum(MODULES);
export const orderStatus = z.enum(ORDER_STATUSES);
export const role = z.enum(ROLES);
export const discountType = z.enum(["percent", "flat"]);
export const appointmentStatus = z.enum(APPOINTMENT_STATUSES);

// ================================================================ requests

export const password = z.string().min(8, "Use at least 8 characters").max(128);
export const money = z.coerce.number().min(0).max(1_000_000);

// Hours are stored the way the customer pages show them ("08:00 AM").
// Accepts that form or 24-hour "20:30".
export const time = z
  .string()
  .trim()
  .transform((s, ctx) => {
    const m = s.match(/^(\d{1,2}):(\d{2})(?:\s*([AaPp])[Mm])?$/);
    let h = m ? Number(m[1]) : NaN;
    const min = m ? Number(m[2]) : NaN;
    const ampm = m?.[3]?.toUpperCase();
    if (!m || min > 59 || (ampm ? h < 1 || h > 12 : h > 23)) {
      ctx.addIssue({ code: "custom", message: "Use a time like 09:00 AM or 21:30" });
      return z.NEVER;
    }
    if (ampm) h = (h % 12) + (ampm === "P" ? 12 : 0);
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, "0")}:${String(min).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  })
  .nullable();

export const loginInput = z.object({ phone: z.string(), password: z.string().min(1).max(128) });
export const setupInput = z.object({ token: z.string(), password });
export const passwordInput = z.object({ current: z.string().min(1), next: password });

// Fields merchants may change on their own store.
export const merchantStoreFields = z.object({
  isClosed: z.boolean(),
  deliveryNotice: z.string().max(300),
  opensAt: time,
  closesAt: time,
  phone: z.string().max(20),
  altPhone: z.string().max(20),
  minOrder: money,
  minDeliveryCharge: money,
  maxDeliveryCharge: money,
  discount: money,
  discountType,
  maxDiscount: money,
  minOrderForDiscount: money,
  bannerApp: z.string().max(300).nullable(),
  bannerWeb: z.string().max(300).nullable(),
});
export const adminStoreFields = merchantStoreFields.extend({
  name: z.string().trim().min(2).max(120),
  address: z.string().trim().min(3).max(300),
  areaName: z.string().max(120).nullable(),
  districtId: z.string().min(1),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  isActive: z.boolean(),
  isBanned: z.boolean(),
  showPrice: z.boolean(),
});
// PATCH /stores/:id (merchants get merchantStoreFields only).
export const storePatchInput = (isAdmin: boolean) => (isAdmin ? adminStoreFields : merchantStoreFields).partial().strict();
// POST /stores
export const createStoreInput = adminStoreFields
  .partial()
  .required({ name: true, address: true, districtId: true, latitude: true, longitude: true })
  .extend({ module: moduleName, ownerPhone: z.string().optional() });

export const stockFields = z.object({ stockQty: z.coerce.number().int().min(0).max(1_000_000), isAvailable: z.boolean() });
export const priceFields = stockFields.extend({
  salePrice: money,
  purchasePrice: money,
  mrp: money,
  maxPerOrder: z.coerce.number().int().min(0).max(10_000),
  discount: money,
  discountType,
});
// PATCH /items/:id (store staff get stockFields only).
export const itemPatchInput = (full: boolean) => (full ? priceFields : stockFields).partial().strict();
// POST /stores/:id/items
export const createItemInput = priceFields.partial().extend({ productId: z.string().min(1) });

export const productFields = z.object({
  titleEn: z.string().trim().min(2).max(200),
  titleBn: z.string().trim().max(200).nullable(),
  packSize: z.string().max(50).nullable(),
  unit: z.string().max(20).nullable(),
  mrp: money,
  image: z.string().max(300).nullable(),
  typeId: z.string().min(1),
  subtypeId: z.string().nullable(),
});
export const createProductInput = productFields.extend({ module: moduleName });
export const productPatchInput = productFields.partial().strict();

export const orderStatusInput = z.object({ status: orderStatus });

export const roleInput = z.object({
  phone: z.string(),
  name: z.string().trim().max(100).optional(),
  role,
  storeId: z.string().nullable().optional(),
});
export const banInput = z.object({ banned: z.boolean() });
export const resetInput = z.object({ confirm: z.string() });

export const riderAssignInput = z.object({ riderId: z.string().min(1).nullable() });
export const riderStatusInput = z.object({ status: z.enum(["On the way", "Delivered"]) });
export const profileLinkInput = z.object({ userId: z.string().min(1).nullable() });

export const doctorProfileFields = z.object({
  speciality: z.string().trim().max(200),
  designation: z.string().trim().max(200),
  qualifications: z.string().trim().max(500),
  experienceYears: z.coerce.number().int().min(0).max(80),
  consultationFee: money,
  followUpFee: money,
});
export const chamberFields = z.object({ bookingOpen: z.boolean(), consultationFee: money, followUpFee: money });
export const appointmentStatusInput = z.object({ status: z.enum(["Visited", "Cancelled", "No-show"]) });

const nullablePhone = z.string().trim().max(20).nullable();
export const providerFields = z.object({
  contactPerson: z.string().trim().max(100).nullable(),
  phone: nullablePhone,
  altPhone: nullablePhone,
  address: z.string().trim().max(300),
  serviceHours: z.string().trim().max(200).nullable(),
  serviceDetails: z.string().trim().max(3000),
  experienceYears: z.coerce.number().int().min(0).max(80),
  status: z.enum(["active", "inactive"]),
});

// =============================================================== responses

// Every JSON body: { success, message?, result?, ...list extras }.
export const envelope = <R extends z.ZodType>(result: R) =>
  z.object({
    success: z.boolean().optional(),
    message: z.string().optional(),
    result,
    // Paged lists.
    total: z.number().optional(),
    pageSize: z.number().optional(),
    // GET /doctor/appointments: today's date in Dhaka (YYYY-MM-DD).
    today: z.string().optional(),
  });
// A body with only a message (most writes).
export const messageResponse = envelope(z.unknown().optional());

const date = z.string();

// ------------------------------------------------------------ session

export const meRole = z.object({
  role,
  storeId: z.string().nullable(),
  storeName: z.string().nullable(),
  module: moduleName.nullable(),
});
export const me = z.object({ id: z.string(), name: z.string(), phone: z.string().nullable(), roles: z.array(meRole) });
// GET /setup?token=…
export const setupWho = z.object({ name: z.string(), phone: z.string().nullable() });

// ------------------------------------------------------------ dashboard

export const stats = z.object({
  ordersByStatus: z.array(z.object({ status: orderStatus, n: z.number(), total: z.number() })),
  ordersByModule: z.array(z.object({ module: moduleName, n: z.number(), total: z.number() })),
  last24h: z.object({ orders: z.number(), revenue: z.number() }),
  stores: z.number(),
  users: z.number().optional(),
});

// ------------------------------------------------------------- stores

export const district = z.object({ id: z.string(), name: z.string(), nameBn: z.string().nullable().optional() });

export const store = z.object({
  id: z.string(),
  module: moduleName,
  code: z.string(),
  name: z.string(),
  address: z.string(),
  phone: z.string().nullable(),
  altPhone: z.string().nullable(),
  districtId: z.string(),
  districtName: z.string().nullable(),
  areaName: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  bannerApp: z.string().nullable(),
  bannerWeb: z.string().nullable(),
  isActive: z.boolean(),
  isBanned: z.boolean(),
  isClosed: z.boolean(),
  showPrice: z.boolean(),
  deliveryNotice: z.string(),
  minOrder: z.number(),
  minDeliveryCharge: z.number(),
  maxDeliveryCharge: z.number(),
  discount: z.number(),
  discountType,
  maxDiscount: z.number(),
  minOrderForDiscount: z.number(),
  merchantType: z.number(),
  opensAt: z.string().nullable(),
  closesAt: z.string().nullable(),
  createdAt: date,
});
export const storeStaff = z.object({ id: z.string(), role, userId: z.string(), name: z.string(), phone: z.string().nullable() });
export const storeDetail = store.extend({ staff: z.array(storeStaff) });
// POST /stores
export const createdStore = z.object({ id: z.string(), code: z.string(), setupLink: z.string().nullable() });
// POST /stores/:id/items, POST /products
export const createdId = z.object({ id: z.string() });

export const storeItem = z.object({
  id: z.string(),
  productId: z.string(),
  titleEn: z.string(),
  titleBn: z.string().nullable(),
  packSize: z.string().nullable(),
  unit: z.string().nullable(),
  image: z.string().nullable(),
  salePrice: z.number(),
  purchasePrice: z.number(),
  mrp: z.number(),
  stockQty: z.number(),
  isAvailable: z.boolean(),
  maxPerOrder: z.number(),
  discount: z.number(),
  discountType,
});

// ----------------------------------------------------------- catalogue

export const product = z.object({
  id: z.string(),
  module: moduleName,
  slug: z.string(),
  titleEn: z.string(),
  titleBn: z.string().nullable(),
  packSize: z.string().nullable(),
  unit: z.string().nullable(),
  mrp: z.number(),
  image: z.string().nullable(),
  typeId: z.string().nullable(),
  subtypeId: z.string().nullable(),
  attrs: z.record(z.string(), z.unknown()),
  typeName: z.string().nullable(),
  subtypeName: z.string().nullable(),
});
export const productSubtype = z.object({
  id: z.string(),
  typeId: z.string(),
  code: z.string(),
  name: z.string(),
  banner: z.string().nullable(),
  position: z.number(),
});
export const productType = z.object({
  id: z.string(),
  module: moduleName,
  code: z.string(),
  name: z.string(),
  kind: z.enum(["General", "Custom"]),
  position: z.number(),
  subtypes: z.array(productSubtype),
});

// -------------------------------------------------------------- orders

export const deliveryInfo = z.object({
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  altPhone: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

export const orderSummary = z.object({
  id: z.string(),
  code: z.string(),
  module: moduleName,
  status: orderStatus,
  total: z.number(),
  subtotal: z.number(),
  deliveryCharge: z.number(),
  vat: z.number(),
  discount: z.number(),
  paymentMethod: z.string(),
  note: z.string(),
  delivery: deliveryInfo,
  createdAt: date,
  updatedAt: date,
  storeId: z.string(),
  storeName: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  customerPhone: z.string().nullable(),
  riderId: z.string().nullable(),
  assignedAt: date.nullable(),
});
export const orderLine = z.object({
  id: z.string(),
  titleEn: z.string(),
  titleBn: z.string().nullable(),
  packSize: z.string().nullable(),
  unit: z.string().nullable(),
  image: z.string().nullable(),
  mrp: z.number(),
  salePrice: z.number(),
  quantity: z.number(),
});
export const orderDetail = orderSummary.extend({
  customerCode: z.string(),
  rider: z.object({ id: z.string(), name: z.string(), phone: z.string().nullable() }).nullable(),
  items: z.array(orderLine),
  nextStatuses: z.array(orderStatus),
});

// ------------------------------------------------------ users and roles

export const userRole = z.object({
  id: z.string(),
  userId: z.string(),
  role,
  storeId: z.string().nullable(),
  storeName: z.string().nullable(),
});
export const adminUser = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().nullable(),
  banned: z.boolean().nullable(),
  createdAt: date,
  code: z.string().nullable(),
  isDemo: z.boolean(),
  isProtected: z.boolean(),
  roles: z.array(userRole),
});
// POST /roles, POST /users/:id/setup-link
export const setupLinkResult = z.object({ userId: z.string().optional(), setupLink: z.string().nullable() });

// ------------------------------------------------------------ riders

export const rider = z.object({ id: z.string(), name: z.string(), phone: z.string().nullable(), openDeliveries: z.number() });

export const riderOrder = z.object({
  id: z.string(),
  code: z.string(),
  module: moduleName,
  status: orderStatus,
  total: z.number(),
  paymentMethod: z.string(),
  note: z.string(),
  delivery: deliveryInfo,
  createdAt: date,
  updatedAt: date,
  assignedAt: date.nullable(),
  store: z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    phone: z.string().nullable(),
    altPhone: z.string().nullable(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  cashToCollect: z.number(),
  nextStatus: orderStatus.nullable(),
  items: z.array(
    z.object({
      titleEn: z.string(),
      packSize: z.string().nullable(),
      unit: z.string().nullable(),
      quantity: z.number(),
      salePrice: z.number(),
    }),
  ),
});

// ----------------------------------------------- profile links (admins)

export const linkedDoctor = z.object({
  id: z.string(),
  name: z.string(),
  speciality: z.string(),
  designation: z.string(),
  departmentName: z.string(),
  districtName: z.string(),
  isActive: z.boolean(),
  userId: z.string().nullable(),
  userName: z.string().nullable(),
  userPhone: z.string().nullable(),
});
export const linkedProvider = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().nullable(),
  address: z.string(),
  districtName: z.string(),
  status: z.enum(["active", "inactive"]),
  userId: z.string().nullable(),
  userName: z.string().nullable(),
  userPhone: z.string().nullable(),
});

// ------------------------------------------------------------ doctors

export const chamber = z.object({
  id: z.string(),
  centerId: z.string(),
  centerName: z.string(),
  centerType: z.string(),
  centerAddress: z.string().nullable(),
  slotTexts: z.array(z.string()),
  roomNo: z.string().nullable(),
  limitPerSlot: z.number(),
  consultationFee: z.number(),
  followUpFee: z.number(),
  bookingOpen: z.boolean(),
  isOff: z.boolean(),
});
export const doctorProfile = z.object({
  id: z.string(),
  districtId: z.string(),
  departmentId: z.string(),
  departmentName: z.string(),
  name: z.string(),
  gender: z.string().nullable(),
  speciality: z.string(),
  qualifications: z.string(),
  designation: z.string(),
  experienceYears: z.number(),
  bmdcRegNo: z.string().nullable(),
  consultationFee: z.number(),
  followUpFee: z.number(),
  isActive: z.boolean(),
  chambers: z.array(chamber),
});
export const appointment = z.object({
  id: z.string(),
  date: z.string(),
  timeSlot: z.string(),
  serialNo: z.number(),
  status: appointmentStatus,
  consultationFee: z.number(),
  chamberId: z.string(),
  centerName: z.string(),
  patientName: z.string(),
  patientPhone: z.string().nullable(),
  patientAltPhone: z.string().nullable(),
  patientGender: z.string().nullable(),
  patientAge: z.number().nullable(),
});

// --------------------------------------------------- service providers

export const providerListing = z.object({
  id: z.string(),
  name: z.string(),
  districtName: z.string(),
  address: z.string(),
  contactPerson: z.string().nullable(),
  phone: z.string().nullable(),
  altPhone: z.string().nullable(),
  experienceYears: z.number(),
  serviceHours: z.string().nullable(),
  serviceDetails: z.string(),
  rating: z.number(),
  totalReviews: z.number(),
  logo: z.string().nullable(),
  status: z.enum(["active", "inactive"]),
  services: z.array(z.string()),
});

// ---------------------------------------------------------------- data

export const dataResult = z.object({ counts: z.record(z.string(), z.number()), signedIn: z.boolean(), ms: z.number() });
