import { createAnonClient } from "@/lib/supabase/server";
import { cache } from "react";

export type Post = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  author_id: string;
  tags: string[] | null;
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "editor" | "user";
};

export const getPublishedPosts = cache(async (page = 1, limit = 10) => {
  const supabase = createAnonClient();
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    console.error("Error fetching published posts:", error);
    return [];
  }

  return posts as Post[];
});

export const getPostBySlug = cache(async (slug: string, options?: { includeDrafts?: boolean }) => {
  const supabase = createAnonClient();
  let query = supabase
    .from("posts")
    .select("*")
    .eq("slug", slug);

  if (!options?.includeDrafts) {
    query = query.eq("is_published", true);
  }

  const { data: post, error } = await query.single();

  if (error) {
    return null;
  }

  return post as Post;
});

export const getPublishedSlugs = cache(async () => {
  const supabase = createAnonClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("slug, created_at, updated_at")
    .eq("is_published", true);

  if (error) {
    console.error("Error fetching published slugs:", error);
    return [];
  }

  return posts;
});

export const getAllPosts = cache(async () => {
  const supabase = createAnonClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }

  return posts as Post[];
});

export const getRelatedPosts = cache(async (currentSlug: string, limit = 3) => {
  const supabase = createAnonClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, created_at, tags, author_id")
    .eq("is_published", true)
    .neq("slug", currentSlug)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }

  return posts as Post[];
});

export const getPostById = cache(async (id: string) => {
  const supabase = createAnonClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return post as Post;
});

export const getPaginatedPosts = cache(async (params: { limit: number; offset: number; search?: string; tag?: string }) => {
  const { limit, offset, search, tag } = params;
  const supabase = createAnonClient();
  const end = offset + limit - 1;

  let query = supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, created_at, tags, author_id", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(offset, end);

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data: posts, count, error } = await query;

  if (error) {
    console.error("Error fetching paginated posts:", error);
    return { items: [], total: 0 };
  }

  return { items: posts as Post[], total: count || 0 };
});