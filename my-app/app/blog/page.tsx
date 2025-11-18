import type { Metadata } from "next";

import { BlogPostCard } from "@/components/blog/blog-post-card";
import { PaginationControls } from "@/components/blog/pagination-controls";
import { getPaginatedPosts, type Post } from "@/lib/supabase/queries";

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
  const offset = (page - 1) * POSTS_PER_PAGE;
  const { items, total } = await getPaginatedPosts({
    limit: POSTS_PER_PAGE,
    offset,
  });

  const hasNextPage = page * POSTS_PER_PAGE < total;
  const hasPreviousPage = page > 1;

  return (
    <main className="container mx-auto py-12">
      <header className="max-w-3xl space-y-4">
        <p className="text-sm font-medium text-primary">CreativeDev.Lab Blog</p>
        <h1 className="text-4xl font-bold tracking-tight">
          Practical guides on building modern landing pages and content systems.
        </h1>
        <p className="text-lg text-muted-foreground">
          Every article is drafted with our internal playbooks and backed by the
          Supabase-powered CMS you can inspect in this repo.
        </p>
      </header>

      <section className="mt-12">
        {items.length ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {items.map((post: Post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
            <PaginationControls
              currentPage={page}
              hasNext={hasNextPage}
              hasPrevious={hasPreviousPage}
            />
          </>
        ) : (
          <p className="text-muted-foreground">
            No posts yet. Draft something from the admin dashboard!
          </p>
        )}
      </section>
    </main>
  );
}
