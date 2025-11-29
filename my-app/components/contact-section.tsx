"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="rounded-3xl border bg-muted/30 p-10 md:p-16"
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-primary">Available for Q1 engagements</p>
          <h2 className="text-3xl font-bold">Ready to ship your next launch?</h2>
          <p className="text-muted-foreground">
            Drop a note and we will assemble a Supabase + Next.js content system tailored to your team within weeks.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild variant="ghost" size="lg" className="pl-0 hover:bg-transparent">
              <Link href="/blog">See how we work &rarr;</Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
