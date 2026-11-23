// Response shapes of the admin API (apps/api/src/modules/admin). The API
// builds them from Drizzle selects, not Zod schemas, so they are written out
// here from those selects. Dates arrive as ISO strings; money as numbers.

export type Module = "grocery" | "medicine" | "food" | "fashion";

export type OrderStatus = "Pending" | "Accepted" | "Processing" | "On the way" | "Delivered" | "Cancelled";

export type Role =
  | "super_admin"
  | "admin"
  | "support"
  | "finance"
  | "content_manager"
  | "merchant_owner"
  | "merchant_manager"
  | "merchant_staff"
  | "rider"
  | "doctor"
  | "service_provider"
  | "customer";

export type DiscountType = "percent" | "flat";

// Every JSON body: { success, message?, result?, ...list extras }.
export type ApiResponse<R = unknown> = {
  success?: boolean;
  message?: string;
  result: R;
  // Paged lists.
  total?: number;
  pageSize?: number;
  // GET /doctor/appointments: today's date in Dhaka (YYYY-MM-DD).
  today?: string;
};

// ------------------------------------------------------------ session

export type MeRole = {
  role: Role;
  storeId: string | null;
  storeName: string | null;
  module: Module | null;
};

export type Me = {
  id: string;
  name: string;
  phone: string | null;
  roles: MeRole[];
};

// GET /setup?token=…
export type SetupWho = { name: string; phone: string | null };

// ------------------------------------------------------------ dashboard

export type Stats = {
  ordersByStatus: { status: OrderStatus; n: number; total: number }[];
  ordersByModule: { module: Module; n: number; total: number }[];
  last24h: { orders: number; revenue: number };
  stores: number;
  users?: number;
};

// ------------------------------------------------------------- stores

export type District = { id: string; name: string; nameBn?: string | null };

export type Store = {
  id: string;
  module: Module;
  code: string;
  name: string;
  address: string;
  phone: string | null;
  altPhone: string | null;
  districtId: string;
  districtName: string | null;
  areaName: string | null;
  latitude: number;
  longitude: number;
  bannerApp: string | null;
  bannerWeb: string | null;
  isActive: boolean;
  isBanned: boolean;
  isClosed: boolean;
  showPrice: boolean;
  deliveryNotice: string;
  minOrder: number;
  minDeliveryCharge: number;
  maxDeliveryCharge: number;
  discount: number;
  discountType: DiscountType;
  maxDiscount: number;
  minOrderForDiscount: number;
  merchantType: number;
  opensAt: string | null;
  closesAt: string | null;
  createdAt: string;
};

export type StoreStaff = { id: string; role: Role; userId: string; name: string; phone: string | null };

export type StoreDetail = Store & { staff: StoreStaff[] };

// POST /stores
export type CreatedStore = { id: string; code: string; setupLink: string | null };

export type StoreItem = {
  id: string;
  productId: string;
  titleEn: string;
  titleBn: string | null;
  packSize: string | null;
  unit: string | null;
  image: string | null;
  salePrice: number;
  purchasePrice: number;
  mrp: number;
  stockQty: number;
  isAvailable: boolean;
  maxPerOrder: number;
  discount: number;
  discountType: DiscountType;
};

// ----------------------------------------------------------- catalogue

export type Product = {
  id: string;
  module: Module;
  slug: string;
  titleEn: string;
  titleBn: string | null;
  packSize: string | null;
  unit: string | null;
  mrp: number;
  image: string | null;
  typeId: string | null;
  subtypeId: string | null;
  attrs: Record<string, unknown>;
  typeName: string | null;
  subtypeName: string | null;
};

export type ProductSubtype = { id: string; typeId: string; code: string; name: string; banner: string | null; position: number };

export type ProductType = {
  id: string;
  module: Module;
  code: string;
  name: string;
  kind: "General" | "Custom";
  position: number;
  subtypes: ProductSubtype[];
};

// -------------------------------------------------------------- orders

export type DeliveryInfo = {
  name: string;
  address: string;
  phone: string;
  altPhone: string;
  latitude: number | null;
  longitude: number | null;
};

export type OrderSummary = {
  id: string;
  code: string;
  module: Module;
  status: OrderStatus;
  total: number;
  subtotal: number;
  deliveryCharge: number;
  vat: number;
  discount: number;
  paymentMethod: string;
  note: string;
  delivery: DeliveryInfo;
  createdAt: string;
  updatedAt: string;
  storeId: string;
  storeName: string;
  customerId: string;
  customerName: string;
  customerPhone: string | null;
  riderId: string | null;
  assignedAt: string | null;
};

export type OrderLine = {
  id: string;
  titleEn: string;
  titleBn: string | null;
  packSize: string | null;
  unit: string | null;
  image: string | null;
  mrp: number;
  salePrice: number;
  quantity: number;
};

export type OrderDetail = OrderSummary & {
  customerCode: string;
  rider: { id: string; name: string; phone: string | null } | null;
  items: OrderLine[];
  nextStatuses: OrderStatus[];
};

// ------------------------------------------------------ users and roles

export type UserRole = { id: string; userId: string; role: Role; storeId: string | null; storeName: string | null };

export type AdminUser = {
  id: string;
  name: string;
  phone: string | null;
  banned: boolean | null;
  createdAt: string;
  code: string | null;
  isDemo: boolean;
  isProtected: boolean;
  roles: UserRole[];
};

// POST /roles, POST /users/:id/setup-link
export type SetupLinkResult = { userId?: string; setupLink: string | null };

// ------------------------------------------------------------ riders

export type Rider = { id: string; name: string; phone: string | null; openDeliveries: number };

export type RiderOrder = {
  id: string;
  code: string;
  module: Module;
  status: OrderStatus;
  total: number;
  paymentMethod: string;
  note: string;
  delivery: DeliveryInfo;
  createdAt: string;
  updatedAt: string;
  assignedAt: string | null;
  store: {
    id: string;
    name: string;
    address: string;
    phone: string | null;
    altPhone: string | null;
    latitude: number;
    longitude: number;
  };
  cashToCollect: number;
  nextStatus: OrderStatus | null;
  items: { titleEn: string; packSize: string | null; unit: string | null; quantity: number; salePrice: number }[];
};

// ----------------------------------------------- profile links (admins)

export type LinkedDoctor = {
  id: string;
  name: string;
  speciality: string;
  designation: string;
  departmentName: string;
  districtName: string;
  isActive: boolean;
  userId: string | null;
  userName: string | null;
  userPhone: string | null;
};

export type LinkedProvider = {
  id: string;
  name: string;
  phone: string | null;
  address: string;
  districtName: string;
  status: "active" | "inactive";
  userId: string | null;
  userName: string | null;
  userPhone: string | null;
};

// ------------------------------------------------------------ doctors

export type AppointmentStatus = "Booked" | "Visited" | "Cancelled" | "No-show";

export type Chamber = {
  id: string;
  centerId: string;
  centerName: string;
  centerType: string;
  centerAddress: string | null;
  slotTexts: string[];
  roomNo: string | null;
  limitPerSlot: number;
  consultationFee: number;
  followUpFee: number;
  bookingOpen: boolean;
  isOff: boolean;
};

export type DoctorProfile = {
  id: string;
  districtId: string;
  departmentId: string;
  departmentName: string;
  name: string;
  gender: string | null;
  speciality: string;
  qualifications: string;
  designation: string;
  experienceYears: number;
  bmdcRegNo: string | null;
  consultationFee: number;
  followUpFee: number;
  isActive: boolean;
  chambers: Chamber[];
};

export type Appointment = {
  id: string;
  date: string;
  timeSlot: string;
  serialNo: number;
  status: AppointmentStatus;
  consultationFee: number;
  chamberId: string;
  centerName: string;
  patientName: string;
  patientPhone: string | null;
  patientAltPhone: string | null;
  patientGender: string | null;
  patientAge: number | null;
};

// --------------------------------------------------- service providers

export type ProviderListing = {
  id: string;
  name: string;
  districtName: string;
  address: string;
  contactPerson: string | null;
  phone: string | null;
  altPhone: string | null;
  experienceYears: number;
  serviceHours: string | null;
  serviceDetails: string;
  rating: number;
  totalReviews: number;
  logo: string | null;
  status: "active" | "inactive";
  services: string[];
};

// ---------------------------------------------------------------- data

export type DataResult = { counts: Record<string, number>; signedIn: boolean; ms: number };
