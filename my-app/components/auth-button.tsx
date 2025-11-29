"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/browser";
import { LogoutButton } from "./logout-button";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

export function AuthButton({ className }: { className?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return user ? (
    <div className={cn("flex items-center gap-4", className)}>
      Hey, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className={cn("flex gap-2", className)}>
      <Button asChild size="sm" variant={"outline"} className="w-full">
        <Link href="/auth/login">Sign in</Link>
      </Button>
    </div>
  );
}
