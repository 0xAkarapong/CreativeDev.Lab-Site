import { db } from "./drizzle";
import { posts } from "./schema";
import { eq } from "drizzle-orm";

export async function getPublishedPosts() {
  return await db.query.posts.findMany({
    where: eq(posts.is_published, true),
  });
}

export async function getPostBySlug(slug: string) {
  return await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
  });
}

export async function getPostById(id: string) {
  return await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });
}
