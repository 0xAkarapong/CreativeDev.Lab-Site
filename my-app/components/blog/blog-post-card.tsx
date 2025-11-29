"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
    tags?: string[] | null;
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
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
        />
      </div>
      <div className="flex flex-col gap-2 flex-1 pt-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {formatDate(post.created_at)} · {readingTime} min read
        </p>
        <h3 className="text-xl font-bold tracking-tight font-heading group-hover:text-primary transition-colors">{post.title}</h3>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
        {post.excerpt && (
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{post.excerpt}</p>
        )}
      </div>
      <p className="mt-4 text-sm font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
        Read article →
      </p>
    </div>
  );

  if (variant === "compact") {
    return (
      <Link href={href} className="block focus-visible:outline-none group">
        {content}
      </Link>
    );
  }

  return (
    <Card className="overflow-hidden group focus-within:ring-2 focus-within:ring-ring border-border/50 bg-card/50 backdrop-blur-sm transition-colors hover:bg-card/80 hover:border-primary/20 h-full">
      <Link href={href} className="flex flex-col h-full p-0">
        <div className="p-6 h-full flex flex-col">
           {content}
        </div>
      </Link>
    </Card>
  );
}

export const MotionBlogPostCard = motion(BlogPostCard);
