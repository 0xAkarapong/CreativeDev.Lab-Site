import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AuthorBio() {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card/50 p-6 backdrop-blur-sm">
      <Avatar className="h-16 w-16 border-2 border-primary/20">
        <AvatarImage src="/images/author-placeholder.jpg" alt="Author" />
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h3 className="font-semibold font-heading">CreativeDev.Lab Team</h3>
        <p className="text-sm text-muted-foreground">
          We are a collective of developers and designers building the next generation of web experiences.
          Follow us for tips on Next.js, Supabase, and modern UI design.
        </p>
      </div>
    </div>
  );
}
