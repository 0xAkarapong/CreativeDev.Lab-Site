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
import * as motion from "framer-motion/client";
import { ShareButtons } from "@/components/blog/share-buttons";
import { AuthorBio } from "@/components/blog/author-bio";

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
    <article className="container mx-auto px-4 py-10 md:px-6 md:py-24 max-w-4xl">
      <Link
        href="/blog"
        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 inline-block"
      >
        ← Back to blog
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          <span>·</span>
          <span>{readingTime} min read</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight font-heading sm:text-5xl md:text-6xl leading-tight">
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
        
        <div className="pt-4">
          <ShareButtons title={post.title} slug={post.slug} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-secondary mt-8 md:mt-12 border border-border/50 shadow-sm"
      >
        <Image
          src={cover}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 md:mt-12 grid gap-12 lg:grid-cols-[1fr_300px]"
      >
        <div className="min-w-0">
          <section
            className="prose prose-lg dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
          />
          <div className="mt-12 border-t pt-8">
            <AuthorBio />
          </div>
        </div>
        <aside className="space-y-8 hidden lg:block">
           <div className="sticky top-24 space-y-8">
             <div className="rounded-xl border bg-card/50 p-6 backdrop-blur-sm">
                <h3 className="font-semibold mb-4">Table of Contents</h3>
                <p className="text-sm text-muted-foreground">
                  Coming soon...
                </p>
             </div>
             <div className="rounded-xl border bg-card/50 p-6 backdrop-blur-sm">
                <h3 className="font-semibold mb-4">Share this post</h3>
                <ShareButtons title={post.title} slug={post.slug} />
             </div>
           </div>
        </aside>
      </motion.div>

      <div className="mt-24">
        <h2 className="text-2xl font-bold font-heading mb-8">Related Articles</h2>
        <RelatedPosts posts={relatedPosts} />
      </div>
    </article>
  );
}
