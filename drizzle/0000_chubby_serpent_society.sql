CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"team_id" integer NOT NULL,
	"round_number" integer,
	"union_id" integer,
	"action" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"round_number" integer NOT NULL,
	"union_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_round_idx" UNIQUE("team_id","round_number")
);
--> statement-breakpoint
CREATE TABLE "round_quotas" (
	"id" serial PRIMARY KEY NOT NULL,
	"round_number" integer NOT NULL,
	"union_id" integer NOT NULL,
	"total_quota" integer NOT NULL,
	"remaining_quota" integer NOT NULL,
	CONSTRAINT "round_union_idx" UNIQUE("round_number","union_id")
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(32) NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_confirmed" boolean DEFAULT false NOT NULL,
	"confirmed_at" timestamp,
	CONSTRAINT "teams_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "unions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_union_id_unions_id_fk" FOREIGN KEY ("union_id") REFERENCES "public"."unions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "round_quotas" ADD CONSTRAINT "round_quotas_union_id_unions_id_fk" FOREIGN KEY ("union_id") REFERENCES "public"."unions"("id") ON DELETE no action ON UPDATE no action;