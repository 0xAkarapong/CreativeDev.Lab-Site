import Link from "next/link";

import { Button } from "@/components/ui/button";

const stats = [
  { label: "Launches delivered", value: "32" },
  { label: "Avg. Lighthouse score", value: "98" },
  { label: "Blog subscribers", value: "4.3k" },
];

export function Hero() {
  return (
    <section className="text-center" id="top">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        CreativeDev.Lab · Product Studio
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
        Landing pages and blogs engineered to convert.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        We architect high-performance marketing sites and editorial hubs on
        Next.js, Supabase, Drizzle ORM, and shadcn/ui. Every component ships
        accessible by default.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/#contact">Launch a project</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/blog">Read the blog</Link>
        </Button>
      </div>
      <dl className="mt-12 grid gap-6 text-left sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border p-6 text-center">
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="text-3xl font-semibold">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
