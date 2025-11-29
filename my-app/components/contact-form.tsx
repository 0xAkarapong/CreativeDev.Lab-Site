"use client";

import { useFormStatus } from "react-dom";
import { submitContactForm, type ContactFormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

const initialState: ContactFormState = {
  message: "",
  errors: {},
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Sending..." : "Send Message"}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      formRef.current?.reset();
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-6 w-full max-w-md p-6 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm">
      <div className="grid gap-2">
        <Label htmlFor="email" className="font-medium">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="h-11 bg-background/50"
        />
        {state.errors?.email && (
          <p className="text-sm text-destructive">{state.errors.email}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message" className="font-medium">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your project..."
          required
          className="min-h-[120px] bg-background/50 resize-none"
        />
        {state.errors?.message && (
          <p className="text-sm text-destructive">{state.errors.message}</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
