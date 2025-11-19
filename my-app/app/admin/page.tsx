import type { Metadata } from "next";
import Link from "next/link";

import { AdminPostTable } from "@/components/admin/post-table";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/supabase/drizzle";
import { profiles } from "@/lib/supabase/schema";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Auto-create profile for default admin if missing
  if (user?.email === "akarapong00123@gmail.com" && db) {
    await db
      .insert(profiles)
      .values({
        id: user.id,
        full_name: "Super Admin",
        role: "admin",
      })
      .onConflictDoNothing();
  }

  const posts = await getAllPosts();

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Content Studio</p>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage every landing page highlight and blog entry from a single,
            authenticated surface powered by Supabase Auth.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="lg">
            <Link href="/admin/users">Manage Users</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/admin/new">New post</Link>
          </Button>
        </div>
      </div>
      <section className="mt-10">
        <AdminPostTable posts={posts} />
      </section>
    </div>
  );
}
