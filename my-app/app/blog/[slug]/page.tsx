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
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
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

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getCachedPost(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug);
  const cover = post.cover_image_url || "/images/post-placeholder.svg";
  const readingTime = calculateReadingTime(post.content ?? "");

  return (
    <article className="container mx-auto py-12 max-w-4xl">
      <Link
        href="/blog"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to blog
      </Link>
      <header className="mt-6 space-y-4">
        <p className="text-sm font-semibold text-primary">
          Published {formatDate(post.created_at)}
        </p>
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        <p className="text-sm text-muted-foreground">
          {readingTime} minute read
        </p>
      </header>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-secondary mt-10">
        <Image
          src={cover}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
        />
      </div>

      <section
        className="blog-content mt-10 space-y-6 text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
      />

      <RelatedPosts posts={relatedPosts} />
    </article>
  );
}
