CREATE TYPE "public"."food_option_kind" AS ENUM('variation', 'addon');--> statement-breakpoint
CREATE TYPE "public"."favourite_kind" AS ENUM('store', 'item', 'list');--> statement-breakpoint
CREATE TABLE "food_item_option" (
	"id" text PRIMARY KEY NOT NULL,
	"store_item_id" text NOT NULL,
	"kind" "food_option_kind" NOT NULL,
	"name" text NOT NULL,
	"price" numeric(12, 2) DEFAULT 0 NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food_item" (
	"store_item_id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"category_id" text,
	"is_popular" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "food_item_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "food_menu_category" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"banner" text,
	"position" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "food_menu_category_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "food_order_item_option" (
	"id" text PRIMARY KEY NOT NULL,
	"order_item_id" text NOT NULL,
	"option_id" text,
	"kind" "food_option_kind" NOT NULL,
	"name" text NOT NULL,
	"price" numeric(12, 2) DEFAULT 0 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food_slider_set" (
	"id" text PRIMARY KEY NOT NULL,
	"district_id" text NOT NULL,
	CONSTRAINT "food_slider_set_district_id_unique" UNIQUE("district_id")
);
--> statement-breakpoint
CREATE TABLE "food_slide" (
	"id" text PRIMARY KEY NOT NULL,
	"set_id" text NOT NULL,
	"slot" text NOT NULL,
	"file_name" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "food_slide_set_slot_position" UNIQUE("set_id","slot","position")
);
--> statement-breakpoint
CREATE TABLE "food_store_category" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"banner" text,
	"regular_distance" integer DEFAULT 10000 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "food_store_category_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "food_store" (
	"store_id" text PRIMARY KEY NOT NULL,
	"logo" text,
	"rating" double precision DEFAULT 0 NOT NULL,
	"delivery_time" text DEFAULT '' NOT NULL,
	"vat_percent" numeric(12, 2) DEFAULT 0 NOT NULL,
	"category_ids" text[] DEFAULT '{}'::text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "care_provider" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"district_id" text NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"location" "geography" GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography) STORED,
	"contact_person" text,
	"phone" text,
	"alt_phone" text,
	"service_ids" text[] DEFAULT '{}'::text[] NOT NULL,
	"rating" double precision DEFAULT 0 NOT NULL,
	"total_reviews" integer DEFAULT 0 NOT NULL,
	"experience_years" integer DEFAULT 0 NOT NULL,
	"service_hours" text,
	"banner_app" text,
	"logo" text,
	"service_details" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "care_service" (
	"id" text PRIMARY KEY NOT NULL,
	"name_en" text NOT NULL,
	"name_bn" text,
	"serial_no" integer DEFAULT 0 NOT NULL,
	"banner_app" text,
	"status" text DEFAULT 'active' NOT NULL,
	"district_ids" text[] DEFAULT '{}'::text[] NOT NULL,
	"slider_id" text,
	"slider_images" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "care_slider" (
	"id" text PRIMARY KEY NOT NULL,
	"district_id" text NOT NULL,
	"slides" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "care_slider_district_id_unique" UNIQUE("district_id")
);
--> statement-breakpoint
CREATE TABLE "favourite" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"kind" "favourite_kind" NOT NULL,
	"merchant_type" integer NOT NULL,
	"ref_id" text NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"seq" bigserial NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "favourite_unique" UNIQUE("user_id","kind","merchant_type","ref_id")
);
--> statement-breakpoint
CREATE TABLE "fashion_brand" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fashion_category" (
	"id" text PRIMARY KEY NOT NULL,
	"type_id" text NOT NULL,
	"name" text NOT NULL,
	"banner" text,
	"position" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fashion_order_item" (
	"order_item_id" text PRIMARY KEY NOT NULL,
	"size" text,
	"color" text,
	"type_id" text,
	"brand" jsonb,
	"web_image" text
);
--> statement-breakpoint
CREATE TABLE "fashion_product_color" (
	"product_id" text NOT NULL,
	"position" integer NOT NULL,
	"name" text NOT NULL,
	"image" text,
	CONSTRAINT "fashion_product_color_product_id_position_pk" PRIMARY KEY("product_id","position")
);
--> statement-breakpoint
CREATE TABLE "fashion_product" (
	"product_id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"type_id" text NOT NULL,
	"category_id" text NOT NULL,
	"sub_category_id" text NOT NULL,
	"brand_id" text,
	"app_image" text,
	"detail_images" text[] DEFAULT '{}'::text[] NOT NULL,
	"sizes" text[] DEFAULT '{}'::text[] NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"specification" text DEFAULT '' NOT NULL,
	"size_chart" text,
	"is_popular" boolean DEFAULT false NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_bestseller" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"rating" double precision DEFAULT 0 NOT NULL,
	"reviews" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fashion_product_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "fashion_store" (
	"store_id" text PRIMARY KEY NOT NULL,
	"logo" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fashion_sub_category" (
	"id" text PRIMARY KEY NOT NULL,
	"category_id" text NOT NULL,
	"name" text NOT NULL,
	"banner_1" text,
	"banner_2" text,
	"position" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fashion_type" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"position" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"patient_name" text NOT NULL,
	"chamber_id" text NOT NULL,
	"doctor_id" text NOT NULL,
	"center_id" text NOT NULL,
	"appointment_date" date NOT NULL,
	"time_slot" text NOT NULL,
	"serial_no" integer NOT NULL,
	"limit_per_slot" integer NOT NULL,
	"consultation_fee" numeric(12, 2) DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'Booked' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "appointment_serial" UNIQUE("chamber_id","appointment_date","time_slot","serial_no")
);
--> statement-breakpoint
CREATE TABLE "doctor_chamber" (
	"id" text PRIMARY KEY NOT NULL,
	"doctor_id" text NOT NULL,
	"center_id" text NOT NULL,
	"slot_texts" text[] DEFAULT '{}'::text[] NOT NULL,
	"schedule" jsonb NOT NULL,
	"scheduling" jsonb NOT NULL,
	"limit_per_slot" integer DEFAULT 30 NOT NULL,
	"consultation_fee" numeric(12, 2) DEFAULT 0 NOT NULL,
	"follow_up_fee" numeric(12, 2) DEFAULT 0 NOT NULL,
	"room_no" text,
	"booking_open" boolean DEFAULT true NOT NULL,
	"is_off" boolean DEFAULT false NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "doctor_chamber_doctor_center" UNIQUE("doctor_id","center_id")
);
--> statement-breakpoint
CREATE TABLE "doctor" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"district_id" text NOT NULL,
	"department_id" text NOT NULL,
	"name" text NOT NULL,
	"gender" text,
	"speciality" text DEFAULT '' NOT NULL,
	"qualifications" text DEFAULT '' NOT NULL,
	"designation" text DEFAULT '' NOT NULL,
	"experience_years" integer DEFAULT 0 NOT NULL,
	"bmdc_reg_no" text,
	"consultation_fee" numeric(12, 2) DEFAULT 0 NOT NULL,
	"follow_up_fee" numeric(12, 2) DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "doctor_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "health_banner" (
	"id" text PRIMARY KEY NOT NULL,
	"slot" text NOT NULL,
	"file_name" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_department" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"name_bn" text,
	"banner_1" text,
	"banner_2" text,
	"serial" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "health_department_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "medical_center" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"center_type" text NOT NULL,
	"district_id" text NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"location" "geography" GENERATED ALWAYS AS (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography) STORED,
	"banner_app" text,
	"contact_1" text,
	"contact_2" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medical_service_provider" (
	"id" text PRIMARY KEY NOT NULL,
	"district_id" text NOT NULL,
	"service_type" text NOT NULL,
	"name" text NOT NULL,
	"contact" text DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"contact" text NOT NULL,
	"alt_contact" text DEFAULT '' NOT NULL,
	"date_of_birth" text DEFAULT '' NOT NULL,
	"gender" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "food_item_option" ADD CONSTRAINT "food_item_option_store_item_id_store_item_id_fk" FOREIGN KEY ("store_item_id") REFERENCES "public"."store_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_item" ADD CONSTRAINT "food_item_store_item_id_store_item_id_fk" FOREIGN KEY ("store_item_id") REFERENCES "public"."store_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_item" ADD CONSTRAINT "food_item_category_id_food_menu_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."food_menu_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_order_item_option" ADD CONSTRAINT "food_order_item_option_order_item_id_order_item_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_order_item_option" ADD CONSTRAINT "food_order_item_option_option_id_food_item_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."food_item_option"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_slider_set" ADD CONSTRAINT "food_slider_set_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."district"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_slide" ADD CONSTRAINT "food_slide_set_id_food_slider_set_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."food_slider_set"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_store" ADD CONSTRAINT "food_store_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_provider" ADD CONSTRAINT "care_provider_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_provider" ADD CONSTRAINT "care_provider_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."district"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_slider" ADD CONSTRAINT "care_slider_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."district"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favourite" ADD CONSTRAINT "favourite_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fashion_category" ADD CONSTRAINT "fashion_category_type_id_fashion_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."fashion_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fashion_order_item" ADD CONSTRAINT "fashion_order_item_order_item_id_order_item_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fashion_product_color" ADD CONSTRAINT "fashion_product_color_product_id_fashion_product_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."fashion_product"("product_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fashion_product" ADD CONSTRAINT "fashion_product_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fashion_product" ADD CONSTRAINT "fashion_product_type_id_fashion_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."fashion_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fashion_product" ADD CONSTRAINT "fashion_product_category_id_fashion_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."fashion_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fashion_product" ADD CONSTRAINT "fashion_product_sub_category_id_fashion_sub_category_id_fk" FOREIGN KEY ("sub_category_id") REFERENCES "public"."fashion_sub_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fashion_product" ADD CONSTRAINT "fashion_product_brand_id_fashion_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."fashion_brand"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fashion_store" ADD CONSTRAINT "fashion_store_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fashion_sub_category" ADD CONSTRAINT "fashion_sub_category_category_id_fashion_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."fashion_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_chamber_id_doctor_chamber_id_fk" FOREIGN KEY ("chamber_id") REFERENCES "public"."doctor_chamber"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_center_id_medical_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "public"."medical_center"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_chamber" ADD CONSTRAINT "doctor_chamber_doctor_id_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor_chamber" ADD CONSTRAINT "doctor_chamber_center_id_medical_center_id_fk" FOREIGN KEY ("center_id") REFERENCES "public"."medical_center"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."district"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_department_id_health_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."health_department"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_center" ADD CONSTRAINT "medical_center_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."district"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_service_provider" ADD CONSTRAINT "medical_service_provider_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."district"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient" ADD CONSTRAINT "patient_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "food_item_option_item_idx" ON "food_item_option" USING btree ("store_item_id");--> statement-breakpoint
CREATE INDEX "food_item_category_idx" ON "food_item" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "food_order_item_option_line_idx" ON "food_order_item_option" USING btree ("order_item_id");--> statement-breakpoint
CREATE INDEX "food_store_categories_idx" ON "food_store" USING gin ("category_ids");--> statement-breakpoint
CREATE INDEX "care_provider_district_idx" ON "care_provider" USING btree ("district_id");--> statement-breakpoint
CREATE INDEX "care_provider_services_idx" ON "care_provider" USING gin ("service_ids");--> statement-breakpoint
CREATE INDEX "care_provider_location_idx" ON "care_provider" USING gist ("location");--> statement-breakpoint
CREATE INDEX "care_provider_user_idx" ON "care_provider" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "care_service_districts_idx" ON "care_service" USING gin ("district_ids");--> statement-breakpoint
CREATE INDEX "favourite_user_kind_idx" ON "favourite" USING btree ("user_id","kind","merchant_type");--> statement-breakpoint
CREATE INDEX "fashion_category_type_idx" ON "fashion_category" USING btree ("type_id");--> statement-breakpoint
CREATE INDEX "fashion_product_type_idx" ON "fashion_product" USING btree ("type_id","position");--> statement-breakpoint
CREATE INDEX "fashion_product_category_idx" ON "fashion_product" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "fashion_product_sub_category_idx" ON "fashion_product" USING btree ("sub_category_id");--> statement-breakpoint
CREATE INDEX "fashion_sub_category_category_idx" ON "fashion_sub_category" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "appointment_patient_idx" ON "appointment" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "appointment_user_idx" ON "appointment" USING btree ("user_id","appointment_date");--> statement-breakpoint
CREATE INDEX "appointment_doctor_idx" ON "appointment" USING btree ("doctor_id","appointment_date");--> statement-breakpoint
CREATE INDEX "doctor_chamber_center_idx" ON "doctor_chamber" USING btree ("center_id");--> statement-breakpoint
CREATE INDEX "doctor_district_dept_idx" ON "doctor" USING btree ("district_id","department_id");--> statement-breakpoint
CREATE INDEX "medical_center_district_idx" ON "medical_center" USING btree ("district_id","center_type");--> statement-breakpoint
CREATE INDEX "medical_center_location_idx" ON "medical_center" USING gist ("location");--> statement-breakpoint
CREATE INDEX "medical_service_provider_district_idx" ON "medical_service_provider" USING btree ("district_id","service_type");--> statement-breakpoint
CREATE INDEX "patient_owner_idx" ON "patient" USING btree ("owner_id","created_at");