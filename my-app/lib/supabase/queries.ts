import { and, desc, eq, ne, sql } from "drizzle-orm";

import { db } from "./drizzle";
import { posts } from "./schema";

const publishedFilter = eq(posts.is_published, true);

type Post = typeof posts.$inferSelect;

const fallbackPosts: Post[] = [
  {
    id: "preview-creative-launch",
    title: "How we ship CreativeDev.Lab launches in days",
    slug: "creative-launch-sprint",
    excerpt:
      "A field guide to building conversion-focused marketing sites using Next.js App Router, Supabase, and shadcn/ui.",
    content: `<p>We start with a conversion brief, wire Storybook-driven components, and publish via Supabase-backed CMS workflows. Every block is statically generated for performance.</p><h2>Tooling stack</h2><ul><li>Next.js App Router + ISR</li><li>Supabase Auth, Postgres, Storage</li><li>Drizzle ORM for schema safety</li><li>shadcn/ui for accessible components</li></ul>`,
    cover_image_url: "/images/post-placeholder.svg",
    created_at: new Date("2024-02-01T00:00:00.000Z"),
    updated_at: new Date("2024-02-02T00:00:00.000Z"),
    is_published: true,
    author_id: null,
  },
  {
    id: "preview-editorial",
    title: "Supabase-powered editorial workflow",
    slug: "supabase-editorial-workflow",
    excerpt:
      "Draft, edit, and publish stories with role-based access, image uploads, and ISR revalidation in under a minute.",
    content: `<p>The admin dashboard authenticates through Supabase middleware. Posts revalidate the listing, detail route, and sitemap, ensuring SEO freshness.</p>`,
    cover_image_url: "/images/post-placeholder.svg",
    created_at: new Date("2024-03-15T00:00:00.000Z"),
    updated_at: new Date("2024-03-15T00:00:00.000Z"),
    is_published: true,
    author_id: null,
  },
  {
    id: "preview-rolling-updates",
    title: "Pattern libraries documented in Storybook",
    slug: "storybook-pattern-library",
    excerpt:
      "Every hero, feature grid, and blog card ships with docs so marketing teams can remix without engineers.",
    content: `<p>Storybook entries demonstrate marketing-ready layouts. We combine lucide icons, shadcn/ui cards, and Tailwind CSS 4 theming.</p>`,
    cover_image_url: "/images/post-placeholder.svg",
    created_at: new Date("2024-04-22T00:00:00.000Z"),
    updated_at: new Date("2024-04-22T00:00:00.000Z"),
    is_published: true,
    author_id: null,
  },
];

function getFallbackPosts(limit?: number) {
  return typeof limit === "number" ? fallbackPosts.slice(0, limit) : fallbackPosts;
}

export async function getPublishedPosts(limit?: number) {
  if (!db) {
    return getFallbackPosts(limit);
  }

  try {
    return await db.query.posts.findMany({
      where: publishedFilter,
      orderBy: desc(posts.created_at),
      limit,
    });
  } catch (error) {
    console.error("Failed to fetch published posts", error);
    return getFallbackPosts(limit);
  }
}

export async function getPaginatedPosts({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) {
  if (!db) {
    const items = fallbackPosts.slice(offset, offset + limit);
    return { items, total: fallbackPosts.length };
  }

  try {
    const [items, countResult] = await Promise.all([
      db.query.posts.findMany({
        where: publishedFilter,
        orderBy: desc(posts.created_at),
        limit,
        offset,
      }),
      db
        .select({ value: sql<number>`count(*)` })
        .from(posts)
        .where(publishedFilter),
    ]);

    const total = Number(countResult[0]?.value ?? 0);
    return { items, total };
  } catch (error) {
    console.error("Failed to paginate posts", error);
    const items = fallbackPosts.slice(offset, offset + limit);
    return { items, total: fallbackPosts.length };
  }
}

export async function getPostBySlug(
  slug: string,
  { includeDrafts = false }: { includeDrafts?: boolean } = {},
) {
  if (!db) {
    return fallbackPosts.find((post) => post.slug === slug);
  }

  const whereClause = includeDrafts
    ? eq(posts.slug, slug)
    : and(eq(posts.slug, slug), publishedFilter);

  try {
    return await db.query.posts.findFirst({
      where: whereClause,
    });
  } catch (error) {
    console.error("Failed to fetch post by slug", error);
    return fallbackPosts.find((post) => post.slug === slug);
  }
}

export async function getPostById(id: string) {
  if (!db) {
    return fallbackPosts.find((post) => post.id === id);
  }

  try {
    return await db.query.posts.findFirst({
      where: eq(posts.id, id),
    });
  } catch (error) {
    console.error("Failed to fetch post by id", error);
    return fallbackPosts.find((post) => post.id === id);
  }
}

export async function getAllPosts() {
  if (!db) {
    return fallbackPosts;
  }

  try {
    return await db.query.posts.findMany({
      orderBy: desc(posts.created_at),
    });
  } catch (error) {
    console.error("Failed to fetch all posts", error);
    return fallbackPosts;
  }
}

export async function getRelatedPosts(slug: string, limit = 3) {
  if (!db) {
    return fallbackPosts.filter((post) => post.slug !== slug).slice(0, limit);
  }

  try {
    return await db.query.posts.findMany({
      where: and(publishedFilter, ne(posts.slug, slug)),
      limit,
      orderBy: desc(posts.created_at),
    });
  } catch (error) {
    console.error("Failed to fetch related posts", error);
    return fallbackPosts.filter((post) => post.slug !== slug).slice(0, limit);
  }
}

export async function getPublishedSlugs() {
  if (!db) {
    return fallbackPosts.map((post) => post.slug);
  }

  try {
    const results = await db.select({ slug: posts.slug }).from(posts).where(publishedFilter);
    return results.map((row) => row.slug);
  } catch (error) {
    console.error("Failed to fetch slugs", error);
    return fallbackPosts.map((post) => post.slug);
  }
}
