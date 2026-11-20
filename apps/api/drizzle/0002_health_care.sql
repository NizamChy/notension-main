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
CREATE INDEX "appointment_patient_idx" ON "appointment" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX "appointment_user_idx" ON "appointment" USING btree ("user_id","appointment_date");--> statement-breakpoint
CREATE INDEX "appointment_doctor_idx" ON "appointment" USING btree ("doctor_id","appointment_date");--> statement-breakpoint
CREATE INDEX "doctor_chamber_center_idx" ON "doctor_chamber" USING btree ("center_id");--> statement-breakpoint
CREATE INDEX "doctor_district_dept_idx" ON "doctor" USING btree ("district_id","department_id");--> statement-breakpoint
CREATE INDEX "medical_center_district_idx" ON "medical_center" USING btree ("district_id","center_type");--> statement-breakpoint
CREATE INDEX "medical_center_location_idx" ON "medical_center" USING gist ("location");--> statement-breakpoint
CREATE INDEX "medical_service_provider_district_idx" ON "medical_service_provider" USING btree ("district_id","service_type");--> statement-breakpoint
CREATE INDEX "patient_owner_idx" ON "patient" USING btree ("owner_id","created_at");