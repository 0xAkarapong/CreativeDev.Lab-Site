"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/supabase/drizzle";
import { posts, profiles } from "@/lib/supabase/schema";
import { postFormSchema, type PostFormValues } from "@/lib/validations/post";
import { createClient } from "@/lib/supabase/server";

async function requireAdminUser() {
  const database = assertDb();
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be signed in.");
  }

  const profile = await database.query.profiles.findFirst({
    where: eq(profiles.id, user.id),
  });

  if (profile?.role !== "admin") {
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
  const database = assertDb();
  const authorId = await requireAdminUser();
  const payload = postFormSchema.omit({ id: true }).parse(values);

  await database.insert(posts).values({
    id: randomUUID(),
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    content: payload.content,
    cover_image_url: payload.cover_image_url,
    is_published: payload.is_published,
    author_id: authorId,
    created_at: new Date(),
    updated_at: new Date(),
  });

  revalidateBlog(payload.slug);
  return { slug: payload.slug };
}

export async function updatePost(values: PostFormValues) {
  const database = assertDb();
  const authorId = await requireAdminUser();
  const payload = postFormSchema.parse(values);

  if (!payload.id) {
    throw new Error("Missing post id");
  }

  const existingPost = await database.query.posts.findFirst({
    where: eq(posts.id, payload.id),
  });

  if (!existingPost) {
    throw new Error("Post not found");
  }

  await database
    .update(posts)
    .set({
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      content: payload.content,
      cover_image_url: payload.cover_image_url,
      is_published: payload.is_published,
      updated_at: new Date(),
      author_id: authorId,
    })
    .where(eq(posts.id, payload.id));

  if (existingPost.slug !== payload.slug) {
    revalidateBlog(existingPost.slug);
  }

  revalidateBlog(payload.slug);
  return { slug: payload.slug };
}

export async function deletePost(id: string) {
  const database = assertDb();
  await requireAdminUser();
  const post = await database.query.posts.findFirst({
    where: eq(posts.id, id),
  });

  if (!post) {
    return;
  }

  await database.delete(posts).where(eq(posts.id, id));
  revalidateBlog(post.slug);
}

function assertDb() {
  if (!db) {
    throw new Error(
      "Database connection is not configured. Set DATABASE_URL to enable admin actions.",
    );
  }

  return db;
}
