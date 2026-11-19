CREATE SEQUENCE "public"."customer_number_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."order_number_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 2001 CACHE 1;--> statement-breakpoint
CREATE TABLE "app_secret" (
	"name" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer" (
	"user_id" text PRIMARY KEY NOT NULL,
	"code" text DEFAULT ('CUS' || lpad(nextval('customer_number_seq')::text, 7, '0')) NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"alt_phone" text DEFAULT '' NOT NULL,
	"district_id" text,
	"district_name" text DEFAULT '' NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	CONSTRAINT "customer_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "order_item" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"store_item_id" text,
	"product_id" text,
	"title_en" text NOT NULL,
	"title_bn" text,
	"pack_size" text,
	"unit" text,
	"image" text,
	"mrp" numeric(12, 2) DEFAULT 0 NOT NULL,
	"sale_price" numeric(12, 2) DEFAULT 0 NOT NULL,
	"purchase_price" numeric(12, 2) DEFAULT 0 NOT NULL,
	"max_per_order" integer DEFAULT 0 NOT NULL,
	"quantity" integer NOT NULL,
	"delivered_qty" integer DEFAULT 0 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"module" "module" NOT NULL,
	"store_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"status" text DEFAULT 'Pending' NOT NULL,
	"subtotal" numeric(12, 2) DEFAULT 0 NOT NULL,
	"discount" numeric(12, 2) DEFAULT 0 NOT NULL,
	"vat" numeric(12, 2) DEFAULT 0 NOT NULL,
	"delivery_charge" numeric(12, 2) DEFAULT 0 NOT NULL,
	"total" numeric(12, 2) DEFAULT 0 NOT NULL,
	"payment_method" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"delivery" jsonb NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"review" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "order_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "customer" ADD CONSTRAINT "customer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_store_item_id_store_item_id_fk" FOREIGN KEY ("store_item_id") REFERENCES "public"."store_item"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_customer_id_user_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_item_order_idx" ON "order_item" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_customer_idx" ON "order" USING btree ("customer_id","created_at");--> statement-breakpoint
CREATE INDEX "order_store_idx" ON "order" USING btree ("store_id","created_at");