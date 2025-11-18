import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().notNull(),
  full_name: text("full_name"),
  avatar_url: text("avatar_url"),
  role: text("role"),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().notNull(),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  excerpt: text("excerpt"),
  cover_image_url: text("cover_image_url"),
  is_published: boolean("is_published").default(false),
  author_id: uuid("author_id").references(() => profiles.id),
});
