import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";

import {
  getPostBySlug,
  getPublishedSlugs,
  getRelatedPosts,
} from "@/lib/supabase/queries";
import { calculateReadingTime, formatDate } from "@/lib/utils";
import { RelatedPosts } from "@/components/blog/related-posts";

const getCachedPost = cache(async (slug: string) =>
  getPostBySlug(slug, { includeDrafts: false }),
);

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export async function generateStaticParams() {
  const posts = await getPublishedSlugs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getCachedPost(params.slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  const ogImage = post.cover_image_url
    ? post.cover_image_url
    : `${baseUrl}/opengraph-image.png`;

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: [ogImage],
    },
  };
}

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await getCachedPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug);
  const cover = post.cover_image_url || "/images/post-placeholder.svg";
  const readingTime = calculateReadingTime(post.content ?? "");

  return (
    <article className="container mx-auto py-16 md:py-24 max-w-4xl">
      <Link
        href="/blog"
        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 inline-block"
      >
        ← Back to blog
      </Link>
      <header className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          <span>·</span>
          <span>{readingTime} min read</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight font-heading sm:text-5xl md:text-6xl leading-tight">
          {post.title}
        </h1>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
      </header>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-secondary mt-12 border border-border/50 shadow-sm">
        <Image
          src={cover}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
          priority
        />
      </div>

      <section
        className="blog-content mt-12 space-y-6 text-lg leading-relaxed text-foreground/90"
        dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
      />

      <RelatedPosts posts={relatedPosts} />
    </article>
  );
}
