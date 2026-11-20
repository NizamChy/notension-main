CREATE TYPE "public"."food_option_kind" AS ENUM('variation', 'addon');--> statement-breakpoint
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
ALTER TABLE "food_item_option" ADD CONSTRAINT "food_item_option_store_item_id_store_item_id_fk" FOREIGN KEY ("store_item_id") REFERENCES "public"."store_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_item" ADD CONSTRAINT "food_item_store_item_id_store_item_id_fk" FOREIGN KEY ("store_item_id") REFERENCES "public"."store_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_item" ADD CONSTRAINT "food_item_category_id_food_menu_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."food_menu_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_order_item_option" ADD CONSTRAINT "food_order_item_option_order_item_id_order_item_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_order_item_option" ADD CONSTRAINT "food_order_item_option_option_id_food_item_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."food_item_option"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_slider_set" ADD CONSTRAINT "food_slider_set_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."district"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_slide" ADD CONSTRAINT "food_slide_set_id_food_slider_set_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."food_slider_set"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_store" ADD CONSTRAINT "food_store_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "food_item_option_item_idx" ON "food_item_option" USING btree ("store_item_id");--> statement-breakpoint
CREATE INDEX "food_item_category_idx" ON "food_item" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "food_order_item_option_line_idx" ON "food_order_item_option" USING btree ("order_item_id");--> statement-breakpoint
CREATE INDEX "food_store_categories_idx" ON "food_store" USING gin ("category_ids");