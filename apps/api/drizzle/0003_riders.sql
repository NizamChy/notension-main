ALTER TABLE "order" ADD COLUMN "rider_id" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "assigned_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_rider_id_user_id_fk" FOREIGN KEY ("rider_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "order_rider_idx" ON "order" USING btree ("rider_id","created_at");