import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostEditorForm } from "@/components/admin/post-editor-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit post",
};

export default async function EditPost(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!post) {
    notFound();
  }

  const initialValues = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    cover_image_url: post.cover_image_url,
    is_published: post.is_published ?? false,
  };

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <header className="mb-8 space-y-2">
        <p className="text-sm font-semibold text-primary">Editor</p>
        <h1 className="text-4xl font-bold">Update post</h1>
        <p className="text-muted-foreground">
          Editing automatically revalidates the statically generated blog
          detail page and sitemap within sixty seconds.
        </p>
      </header>
      <PostEditorForm mode="edit" initialValues={initialValues} />
    </div>
  );
}
