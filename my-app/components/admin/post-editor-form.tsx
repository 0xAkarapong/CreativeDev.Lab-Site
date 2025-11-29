"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createPost, updatePost } from "@/app/admin/actions";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/browser";
import { slugify } from "@/lib/utils";
import {
  postFormSchema,
  type PostFormValues,
} from "@/lib/validations/post";

interface PostEditorFormProps {
  mode: "create" | "edit";
  initialValues?: PostFormValues;
}

const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET;

export function PostEditorForm({ mode, initialValues }: PostEditorFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSlugDirty, setIsSlugDirty] = useState(Boolean(initialValues?.slug));
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema) as Resolver<PostFormValues>,
    defaultValues: {
      id: initialValues?.id,
      title: initialValues?.title ?? "",
      slug: initialValues?.slug ?? "",
      excerpt: initialValues?.excerpt ?? "",
      content: initialValues?.content ?? "",
      cover_image_url: initialValues?.cover_image_url ?? null,
      tags: initialValues?.tags ?? "",
      is_published: initialValues?.is_published ?? false,
    },
  });

  const coverImage = form.watch("cover_image_url");
  const title = form.watch("title");

  useEffect(() => {
    if (!isSlugDirty && title) {
      form.setValue("slug", slugify(title), { shouldValidate: true });
    }
  }, [form, isSlugDirty, title]);

  const handleSubmit = (values: PostFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createPost({
            title: values.title,
            slug: values.slug,
            excerpt: values.excerpt,
            cover_image_url: values.cover_image_url,
            content: values.content,
            is_published: values.is_published,
          });
        } else {
          await updatePost(values);
        }
        router.push("/admin");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to save post");
      }
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!bucket) {
      setError("Set NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET to upload images.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExtension = file.name.split(".").pop();
      const fileId =
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);
      const filePath = `covers/${fileId}.${fileExtension ?? "png"}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: true,
          cacheControl: "3600",
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      form.setValue("cover_image_url", data.publicUrl, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "There was a problem uploading",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a compelling headline" {...field} />
              </FormControl>
              <FormDescription>
                This is the public-facing title that renders in metadata.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input
                  placeholder="creative-launch"
                  {...field}
                  onChange={(event) => {
                    setIsSlugDirty(true);
                    field.onChange(event);
                  }}
                />
              </FormControl>
              <FormDescription>
                Used in the URL (e.g. /blog/creative-launch).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Summarize the story for social previews"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cover_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <div className="flex flex-col gap-4">
                <FormControl>
                  <Input type="file" accept="image/*" onChange={handleFileChange} />
                </FormControl>
                {coverImage && (
                  <div className="relative h-48 w-full overflow-hidden rounded-xl border bg-secondary">
                    <Image
                      src={coverImage}
                      alt={title || "Uploaded cover"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground break-all">
                  {field.value ?? "No cover uploaded yet."}
                </p>
              </div>
              <FormDescription>
                Uploads directly to Supabase Storage ({bucket ?? "bucket"}).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor value={field.value ?? ""} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="nextjs, supabase, design (comma separated)" {...field} />
              </FormControl>
              <FormDescription>
                Comma separated tags for filtering and search.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_published"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-2xl border p-4">
              <div>
                <FormLabel>Publish immediately</FormLabel>
                <FormDescription>
                  Toggle off to save as a draft that only admins can see.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={isPending || uploading}>
          {isPending
            ? "Saving..."
            : mode === "create"
              ? "Publish post"
              : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
