"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Projects Shipped", value: "100+" },
  { label: "Avg. Performance", value: "99/100" },
  { label: "Happy Clients", value: "50+" },
];

export function Hero() {
  return (
    <section className="relative text-center" id="top">
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-primary/20 blur-[100px]" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          CreativeDev.Lab · Product Studio
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl font-heading">
          Landing pages and blogs engineered to convert.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          We architect high-performance marketing sites and editorial hubs on
          Next.js, Supabase, Drizzle ORM, and shadcn/ui. Every component ships
          accessible by default.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Button asChild size="lg" className="h-12 px-8 text-base">
          <Link href="/#contact">Launch a project</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
          <Link href="/blog">Read the blog</Link>
        </Button>
      </motion.div>

      <motion.dl
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 grid gap-6 text-left sm:grid-cols-3"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border bg-card/50 p-6 text-center backdrop-blur-sm">
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="text-3xl font-semibold">{stat.value}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
