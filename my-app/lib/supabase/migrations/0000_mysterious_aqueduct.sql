CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text,
	"excerpt" text,
	"cover_image_url" text,
	"is_published" boolean DEFAULT false,
	"author_id" uuid,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"role" text
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;