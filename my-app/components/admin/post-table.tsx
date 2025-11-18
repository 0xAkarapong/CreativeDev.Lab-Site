"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

import { deletePost } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { calculateReadingTime, formatDate } from "@/lib/utils";

interface AdminPostTableProps {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    is_published: boolean | null;
    created_at: string | Date | null;
    content: string | null;
  }>;
}

export function AdminPostTable({ posts }: AdminPostTableProps) {
  const [list, setList] = useState(posts);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deletePost(id);
      setList((current) => current.filter((post) => post.id !== id));
    });
  };

  if (!list.length) {
    return (
      <div className="rounded-2xl border p-10 text-center text-muted-foreground">
        Nothing here yet. Publish your first post to populate the landing page
        and blog listing.
      </div>
    );
  }

  return (
    <div className="divide-y rounded-2xl border">
      {list.map((post) => (
        <div key={post.id} className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <Badge variant={post.is_published ? "default" : "secondary"}>
                {post.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDate(post.created_at)} · {calculateReadingTime(post.content ?? "")} min read
            </p>
          </div>
          <div className="flex items-center gap-3">
            {post.is_published ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/blog/${post.slug}`}>View</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                View
              </Button>
            )}
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/edit/${post.id}`}>Edit</Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isPending}>
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete “{post.title}”?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This cannot be undone and will immediately update the blog
                    listing.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(post.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
