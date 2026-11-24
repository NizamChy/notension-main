// Response shapes of the admin API, inferred from the shared contract
// (packages/shared/src/contract/admin.ts) that adminApi validates against.
import type { z } from "zod";
import type { admin } from "@notension/shared";

export type Module = z.infer<typeof admin.moduleName>;
export type OrderStatus = z.infer<typeof admin.orderStatus>;
export type Role = z.infer<typeof admin.role>;
export type DiscountType = z.infer<typeof admin.discountType>;
export type AppointmentStatus = z.infer<typeof admin.appointmentStatus>;

// Every JSON body: { success, message?, result, ...list extras }.
export type ApiResponse<R = unknown> = Omit<z.infer<ReturnType<typeof admin.envelope>>, "result"> & { result: R };

export type MeRole = z.infer<typeof admin.meRole>;
export type Me = z.infer<typeof admin.me>;
export type SetupWho = z.infer<typeof admin.setupWho>;
export type Stats = z.infer<typeof admin.stats>;
export type District = z.infer<typeof admin.district>;
export type Store = z.infer<typeof admin.store>;
export type StoreStaff = z.infer<typeof admin.storeStaff>;
export type StoreDetail = z.infer<typeof admin.storeDetail>;
export type CreatedStore = z.infer<typeof admin.createdStore>;
export type StoreItem = z.infer<typeof admin.storeItem>;
export type Product = z.infer<typeof admin.product>;
export type ProductSubtype = z.infer<typeof admin.productSubtype>;
export type ProductType = z.infer<typeof admin.productType>;
export type DeliveryInfo = z.infer<typeof admin.deliveryInfo>;
export type OrderSummary = z.infer<typeof admin.orderSummary>;
export type OrderLine = z.infer<typeof admin.orderLine>;
export type OrderDetail = z.infer<typeof admin.orderDetail>;
export type UserRole = z.infer<typeof admin.userRole>;
export type AdminUser = z.infer<typeof admin.adminUser>;
export type SetupLinkResult = z.infer<typeof admin.setupLinkResult>;
export type Rider = z.infer<typeof admin.rider>;
export type RiderOrder = z.infer<typeof admin.riderOrder>;
export type LinkedDoctor = z.infer<typeof admin.linkedDoctor>;
export type LinkedProvider = z.infer<typeof admin.linkedProvider>;
export type Chamber = z.infer<typeof admin.chamber>;
export type DoctorProfile = z.infer<typeof admin.doctorProfile>;
export type Appointment = z.infer<typeof admin.appointment>;
export type ProviderListing = z.infer<typeof admin.providerListing>;
export type DataResult = z.infer<typeof admin.dataResult>;
