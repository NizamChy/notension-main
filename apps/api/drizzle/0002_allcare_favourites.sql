CREATE TYPE "public"."favourite_kind" AS ENUM('store', 'item', 'list');--> statement-breakpoint
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
ALTER TABLE "care_provider" ADD CONSTRAINT "care_provider_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_provider" ADD CONSTRAINT "care_provider_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."district"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "care_slider" ADD CONSTRAINT "care_slider_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "public"."district"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favourite" ADD CONSTRAINT "favourite_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "care_provider_district_idx" ON "care_provider" USING btree ("district_id");--> statement-breakpoint
CREATE INDEX "care_provider_services_idx" ON "care_provider" USING gin ("service_ids");--> statement-breakpoint
CREATE INDEX "care_provider_location_idx" ON "care_provider" USING gist ("location");--> statement-breakpoint
CREATE INDEX "care_provider_user_idx" ON "care_provider" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "care_service_districts_idx" ON "care_service" USING gin ("district_ids");--> statement-breakpoint
CREATE INDEX "favourite_user_kind_idx" ON "favourite" USING btree ("user_id","kind","merchant_type");