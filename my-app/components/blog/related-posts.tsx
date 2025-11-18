import { BlogPostCard } from "./blog-post-card";

interface RelatedPostsProps {
  posts: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    cover_image_url: string | null;
    created_at: string | Date | null;
    content: string | null;
  }>;
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts.length) {
    return null;
  }

  return (
    <section className="mt-16 border-t pt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">Related posts</h3>
        <p className="text-sm text-muted-foreground">
          Curated based on recency
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} variant="compact" />
        ))}
      </div>
    </section>
  );
}
