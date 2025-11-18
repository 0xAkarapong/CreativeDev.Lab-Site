import type { Metadata } from "next";
import Link from "next/link";

import { BlogPostCard } from "@/components/blog/blog-post-card";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { getPublishedPosts } from "@/lib/supabase/queries";
import type { Post } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Modern landing pages + Supabase blog CMS",
  description:
    "CreativeDev.Lab builds high-conversion marketing sites and editorial hubs with Next.js, Supabase, and shadcn/ui.",
};

export default function Home() {
  const latestPostsPromise = getPublishedPosts(3);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full max-w-5xl flex-1 space-y-20 px-5 py-16">
        <Hero />
        <Features />

        <section className="space-y-6" id="blog">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">From the blog</p>
              <h2 className="text-3xl font-bold">Research-backed project notes</h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/blog">Browse all posts</Link>
            </Button>
          </div>
          <BlogList promise={latestPostsPromise} />
        </section>

        <ContactCta />
      </div>
    </main>
  );
}

async function BlogList({
  promise,
}: {
  promise: ReturnType<typeof getPublishedPosts>;
}) {
  const latestPosts = await promise;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {latestPosts.map((post: Post) => (
        <BlogPostCard key={post.id} post={post} variant="compact" />
      ))}
      {!latestPosts.length && (
        <p className="text-muted-foreground">
          Publish your first story from the admin dashboard to see it here.
        </p>
      )}
    </div>
  );
}

function ContactCta() {
  return (
    <section
      id="contact"
      className="rounded-3xl border bg-muted/30 p-10 text-center md:text-left"
    >
      <p className="text-sm font-semibold text-primary">Available for Q1 engagements</p>
      <h2 className="mt-3 text-3xl font-bold">Ready to ship your next launch?</h2>
      <p className="mt-3 text-muted-foreground">
        Drop a note and we will assemble a Supabase + Next.js content system tailored to your team within weeks.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button asChild size="lg">
          <a href="mailto:hello@creativedev.lab">hello@creativedev.lab</a>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/blog">See how we work</Link>
        </Button>
      </div>
    </section>
  );
}
