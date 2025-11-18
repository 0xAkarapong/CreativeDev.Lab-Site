import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const features = [
  {
    title: "Modern Stack",
    description:
      "Built with Next.js, Tailwind CSS, and Supabase for a great developer experience.",
  },
  {
    title: "Type-Safe",
    description:
      "End-to-end type-safety with TypeScript and Drizzle ORM.",
  },
  {
    title: "UI Components",
    description:
      "A comprehensive set of UI components from shadcn/ui.",
  },
];

export function Features() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {features.map((feature) => (
        <Card key={feature.title}>
          <CardHeader>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{feature.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
