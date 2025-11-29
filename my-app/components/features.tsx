"use client";

import { Code2, Layout, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Next.js App Router",
    description:
      "Built on the cutting-edge App Router for unparalleled performance, nested layouts, and streaming server components.",
    icon: Layout,
  },
  {
    title: "Supabase Backend",
    description:
      "A complete backend-as-a-service with robust authentication, real-time database, and secure file storage.",
    icon: Code2,
  },
  {
    title: "Modern UI System",
    description:
      "Beautifully designed with shadcn/ui and Tailwind CSS, ensuring accessibility and easy customization.",
    icon: Zap,
  },
  {
    title: "Enterprise Security",
    description:
      "Bank-grade security with Row Level Security (RLS), secure API routes, and comprehensive input validation.",
    icon: ShieldCheck,
  },
];

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

export function Features() {
  return (
    <section id="solutions" className="space-y-8">
      <div className="space-y-2 text-center md:text-left">
        <p className="text-sm font-semibold text-primary">Solutions</p>
        <h2 className="text-3xl font-bold font-heading">A complete landing page + blog system</h2>
        <p className="text-muted-foreground max-w-2xl">
          Built for marketing teams that want type-safe content editing with modern DX.
        </p>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-2"
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={item}>
            <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/10 transition-colors hover:bg-card/80 hover:border-primary/20">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <feature.icon className="h-6 w-6 text-primary" aria-hidden />
                </div>
                <CardTitle className="text-xl font-heading">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
