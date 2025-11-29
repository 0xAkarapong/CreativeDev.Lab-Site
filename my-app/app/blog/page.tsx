import { Suspense } from "react";
import type { Metadata } from "next";

import { BlogPostCard } from "@/components/blog/blog-post-card";
import { PaginationControls } from "@/components/blog/pagination-controls";
import { SearchInput } from "@/components/blog/search-input";
import { BlogListSkeleton } from "@/components/blog/blog-list-skeleton";
import { getPaginatedPosts, type Post } from "@/lib/supabase/queries";
import * as motion from "framer-motion/client";

const POSTS_PER_PAGE = 6;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on shipping performant landing pages, content strategies, and Supabase-backed products.",
};

type SearchParams =
  | Record<string, string | string[] | undefined>
  | undefined;

function parsePage(searchParams?: SearchParams) {
  const raw =
    typeof searchParams?.page === "string"
      ? searchParams?.page
      : Array.isArray(searchParams?.page)
        ? searchParams?.page[0]
        : undefined;
  const page = Number(raw);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function Blog({
  searchParams,
}: {
  searchParams?:
    | SearchParams
    | Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const page = parsePage(resolvedSearchParams);
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;
  const tag = typeof resolvedSearchParams.tag === "string" ? resolvedSearchParams.tag : undefined;

  return (
    <main className="container mx-auto px-4 py-10 md:px-6 md:py-24">
      <header className="max-w-3xl space-y-6">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">CreativeDev.Lab Blog</p>
        <h1 className="text-4xl font-bold tracking-tight font-heading sm:text-5xl">
          Practical guides on building modern landing pages and content systems.
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Every article is drafted with our internal playbooks and backed by the
          Supabase-powered CMS you can inspect in this repo.
        </p>
        <div className="pt-6">
          <SearchInput />
        </div>
      </header>

      <section className="mt-12">
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogContent page={page} search={search} tag={tag} />
        </Suspense>
      </section>
    </main>
  );
}

async function BlogContent({ page, search, tag }: { page: number; search?: string; tag?: string }) {
  const offset = (page - 1) * POSTS_PER_PAGE;
  const { items, total } = await getPaginatedPosts({
    limit: POSTS_PER_PAGE,
    offset,
    search,
    tag,
  });

  const hasNextPage = page * POSTS_PER_PAGE < total;
  const hasPreviousPage = page > 1;

  return (
    <>
      <BlogList posts={items} />
      <PaginationControls
        currentPage={page}
        hasNext={hasNextPage}
        hasPrevious={hasPreviousPage}
      />
    </>
  );
}

function BlogList({ posts }: { posts: Post[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      {posts.map((post) => (
        <motion.div
          layout
          key={post.id}
          variants={item}
          className="h-full"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <BlogPostCard post={post} />
        </motion.div>
      ))}
      {!posts.length && (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground text-lg">
            No posts found. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </motion.div>
  );
}
