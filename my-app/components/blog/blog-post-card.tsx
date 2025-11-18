import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { calculateReadingTime, formatDate } from "@/lib/utils";

interface BlogPostCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    cover_image_url: string | null;
    created_at: string | Date | null;
    content: string | null;
  };
  variant?: "default" | "compact";
}

export function BlogPostCard({ post, variant = "default" }: BlogPostCardProps) {
  const href = `/blog/${post.slug}`;
  const cover = post.cover_image_url || "/images/post-placeholder.svg";
  const readingTime = calculateReadingTime(post.content ?? "");
  const layoutClasses =
    variant === "compact"
      ? "flex flex-col gap-3 p-4 border rounded-xl"
      : "flex flex-col h-full";

  const content = (
    <div className={layoutClasses}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-secondary">
        <Image
          src={cover}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
        />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {formatDate(post.created_at)} · {readingTime} min read
        </p>
        <h3 className="text-xl font-semibold leading-tight">{post.title}</h3>
        <p className="text-sm text-muted-foreground flex-1">
          {post.excerpt ?? "This story will be updated soon."}
        </p>
      </div>
      <p className="mt-4 text-sm font-semibold text-primary">
        Read article →
      </p>
    </div>
  );

  if (variant === "compact") {
    return (
      <Link href={href} className="block focus-visible:outline-none">
        {content}
      </Link>
    );
  }

  return (
    <Card className="overflow-hidden group focus-within:ring-2 focus-within:ring-ring">
      <Link href={href} className="flex flex-col h-full">
        {content}
      </Link>
    </Card>
  );
}
