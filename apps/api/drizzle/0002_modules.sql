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
CREATE INDEX "food_item_option_item_idx" ON "food_item_option" USING btree ("store_item_id");--> statement-breakpoint
CREATE INDEX "food_item_category_idx" ON "food_item" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "food_order_item_option_line_idx" ON "food_order_item_option" USING btree ("order_item_id");--> statement-breakpoint
CREATE INDEX "food_store_categories_idx" ON "food_store" USING gin ("category_ids");--> statement-breakpoint
CREATE INDEX "care_provider_district_idx" ON "care_provider" USING btree ("district_id");--> statement-breakpoint
CREATE INDEX "care_provider_services_idx" ON "care_provider" USING gin ("service_ids");--> statement-breakpoint
CREATE INDEX "care_provider_location_idx" ON "care_provider" USING gist ("location");--> statement-breakpoint
CREATE INDEX "care_provider_user_idx" ON "care_provider" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "care_service_districts_idx" ON "care_service" USING gin ("district_ids");--> statement-breakpoint
CREATE INDEX "favourite_user_kind_idx" ON "favourite" USING btree ("user_id","kind","merchant_type");