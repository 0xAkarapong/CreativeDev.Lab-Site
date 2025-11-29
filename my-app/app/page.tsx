import type { Metadata } from "next";
import Link from "next/link";

import { BlogPostCard } from "@/components/blog/blog-post-card";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { getPublishedPosts } from "@/lib/supabase/queries";
import type { Post } from "@/lib/supabase/queries";
import { ContactForm } from "@/components/contact-form";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "CreativeDev.Lab | Multi-Disciplinary Research and Dev Centre",
  description:
    "CreativeDev.Lab Multi-Disciplinary Research and Dev Centre. In co-creation of Harbour.Space Institute of Technology & CreativeLabTH Group.",
};

const ContactSection = dynamic(() => import("@/components/contact-section").then(mod => mod.ContactSection), {
  loading: () => <div className="h-[400px] w-full rounded-3xl bg-muted/30 animate-pulse" />,
});

export default function Home() {
  const latestPostsPromise = getPublishedPosts(3);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full max-w-5xl flex-1 space-y-12 px-4 py-10 md:space-y-20 md:px-5 md:py-16">
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

        <ContactSection />
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


