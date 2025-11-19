import { createClient } from "@/lib/supabase/server";
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
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "editor" | "user";
};

export const getPublishedPosts = cache(async (page = 1, limit = 10) => {
  const supabase = await createClient();
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

export const getPostBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    return null;
  }

  return post as Post;
});

export const getAllPosts = cache(async () => {
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
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
  const supabase = await createClient();
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

export const getPaginatedPosts = cache(async (page: number, limit: number) => {
  const supabase = await createClient();
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data: posts, count, error } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    console.error("Error fetching paginated posts:", error);
    return { posts: [], total: 0 };
  }

  return { posts: posts as Post[], total: count || 0 };
});