import type { Metadata } from "next";

import { PostEditorForm } from "@/components/admin/post-editor-form";

export const metadata: Metadata = {
  title: "New post",
};

export default function NewPost() {
  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <header className="mb-8 space-y-2">
        <p className="text-sm font-semibold text-primary">Editor</p>
        <h1 className="text-4xl font-bold">Create a new article</h1>
        <p className="text-muted-foreground">
          Draft a story, upload a cover, and decide whether to publish or save
          as a draft. Changes are saved via Supabase and Drizzle ORM.
        </p>
      </header>
      <PostEditorForm mode="create" />
    </div>
  );
}
