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
CREATE INDEX "fashion_category_type_idx" ON "fashion_category" USING btree ("type_id");--> statement-breakpoint
CREATE INDEX "fashion_product_type_idx" ON "fashion_product" USING btree ("type_id","position");--> statement-breakpoint
CREATE INDEX "fashion_product_category_idx" ON "fashion_product" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "fashion_product_sub_category_idx" ON "fashion_product" USING btree ("sub_category_id");--> statement-breakpoint
CREATE INDEX "fashion_sub_category_category_idx" ON "fashion_sub_category" USING btree ("category_id");