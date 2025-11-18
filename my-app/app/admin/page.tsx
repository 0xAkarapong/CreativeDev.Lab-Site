"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPublishedPosts } from "@/lib/supabase/queries";
import Link from "next/link";
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
import { deletePost } from "./actions";
import { useEffect, useState } from "react";

type Post = Awaited<ReturnType<typeof getPublishedPosts>>[0];

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPublishedPosts().then(setPosts);
  }, []);

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/admin/new">New Post</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Published Posts</CardTitle>
          <CardDescription>
            Here are all the published posts on your blog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    {post.created_at
                      ? new Date(post.created_at).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/admin/edit/${post.id}`}>Edit</Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this post?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            await deletePost(post.id);
                            setPosts(posts.filter((p) => p.id !== post.id));
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
