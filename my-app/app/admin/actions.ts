"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { postFormSchema, type PostFormValues } from "@/lib/validations/post";
import { createClient } from "@/lib/supabase/server";

async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be signed in.");
  }

  // Check if this is the bootstrap admin email
  const isDefaultAdmin = user.email === "akarapong00123@gmail.com";

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Auto-create profile for bootstrap admin if it doesn't exist
  if (isDefaultAdmin && !profile) {
    await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: "Super Admin",
        role: "admin",
      });
  }

  // Allow access if bootstrap admin OR if profile has admin role
  if (!isDefaultAdmin && (!profile || profile.role !== "admin")) {
    throw new Error("You are not allowed to perform this action.");
  }

  return user.id;
}

function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
  revalidatePath("/admin");
}

type CreatePostValues = Omit<PostFormValues, "id">;

export async function createPost(values: CreatePostValues) {
  const supabase = await createClient();
  const authorId = await requireAdminUser();
  const payload = postFormSchema.omit({ id: true }).parse(values);

  const { error } = await supabase.from("posts").insert({
    id: randomUUID(),
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    content: payload.content,
    cover_image_url: payload.cover_image_url,
    is_published: payload.is_published,
    tags: payload.tags ? payload.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    author_id: authorId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error("Failed to create post: " + error.message);
  }

  revalidateBlog(payload.slug);
  return { slug: payload.slug };
}

export async function updatePost(values: PostFormValues) {
  const supabase = await createClient();
  const authorId = await requireAdminUser();
  const payload = postFormSchema.parse(values);

  if (!payload.id) {
    throw new Error("Missing post id");
  }

  const { data: existingPost } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", payload.id)
    .single();

  if (!existingPost) {
    throw new Error("Post not found");
  }

  const { error } = await supabase
    .from("posts")
    .update({
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      content: payload.content,
      cover_image_url: payload.cover_image_url,
      is_published: payload.is_published,
      tags: payload.tags ? payload.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      updated_at: new Date().toISOString(),
      author_id: authorId,
    })
    .eq("id", payload.id);

  if (error) {
    throw new Error("Failed to update post: " + error.message);
  }

  if (existingPost.slug !== payload.slug) {
    revalidateBlog(existingPost.slug);
  }

  revalidateBlog(payload.slug);
  return { slug: payload.slug };
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  await requireAdminUser();
  
  const { data: post } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", id)
    .single();

  if (!post) {
    return;
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Failed to delete post: " + error.message);
  }

  revalidateBlog(post.slug);
}
