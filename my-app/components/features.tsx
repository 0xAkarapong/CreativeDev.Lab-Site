import { Code2, Layout, ShieldCheck, Zap } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "App Router + ISR",
    description:
      "Every route is statically generated, cached, and revalidated every minute for SEO-grade performance.",
    icon: Layout,
  },
  {
    title: "Supabase CMS",
    description:
      "Auth, Postgres, file storage, and row level security are wired through Drizzle ORM.",
    icon: Code2,
  },
  {
    title: "Reusable shadcn/ui",
    description:
      "We document custom cards, navigation, and editors with Storybook for your design system.",
    icon: Zap,
  },
  {
    title: "Security built-in",
    description:
      "Middleware checks Supabase roles before loading /admin routes and storage uploads are scoped to buckets.",
    icon: ShieldCheck,
  },
];

export function Features() {
  return (
    <section id="solutions" className="space-y-8">
      <div className="space-y-2 text-center md:text-left">
        <p className="text-sm font-semibold text-primary">Solutions</p>
        <h2 className="text-3xl font-bold">A complete landing page + blog system</h2>
        <p className="text-muted-foreground">
          Built for marketing teams that want type-safe content editing with modern DX.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title} className="h-full">
            <CardHeader className="flex flex-row items-center gap-3">
              <feature.icon className="h-6 w-6 text-primary" aria-hidden />
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
