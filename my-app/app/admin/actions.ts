"use server";

import { db } from "@/lib/supabase/drizzle";
import { posts } from "@/lib/supabase/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";

const formSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string(),
  is_published: z.boolean(),
});

export async function createPost(
  values: Omit<z.infer<typeof formSchema>, "id">
) {
  await db.insert(posts).values(values);
  revalidatePath("/blog");
  revalidatePath("/admin");
}

export async function updatePost(values: z.infer<typeof formSchema>) {
  await db.update(posts).set(values).where(eq(posts.id, values.id));
  revalidatePath(`/blog/${values.slug}`);
  revalidatePath("/admin");
}

export async function deletePost(id: string) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });
  if (post) {
    await db.delete(posts).where(eq(posts.id, id));
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin");
  }
}
