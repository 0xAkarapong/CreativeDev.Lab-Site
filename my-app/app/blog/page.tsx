import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPublishedPosts } from "@/lib/supabase/queries";
import Link from "next/link";

export default async function Blog() {
  const posts = await getPublishedPosts();

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.excerpt}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-gray-500">
                {post.created_at
                  ? new Date(post.created_at).toLocaleDateString()
                  : ""}
              </p>
            </CardFooter>
            <Link href={`/blog/${post.slug}`} className="absolute inset-0" />
          </Card>
        ))}
      </div>
    </div>
  );
}
